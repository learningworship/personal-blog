# Quick Fix Guide for Production Deployment

This guide provides step-by-step instructions to fix the **CRITICAL** security issues before production deployment.

---

## 🚨 Critical Fixes (Do These First)

### 1. Install Security Dependencies

```bash
cd server
npm install helmet express-rate-limit compression hpp cors express-mongo-sanitize --save
npm install winston --save
```

---

### 2. Update server/index.js

Replace the entire file with the following production-ready version:

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const hpp = require('hpp');
const path = require('path');
require('dotenv').config();

const db = require('./config/database');
const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (important for rate limiting behind proxies)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration - PRODUCTION READY
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// Apply rate limiting
app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Compression
app.use(compression());

// HTTP Parameter Pollution protection
app.use(hpp());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// API Routes
app.use('/api/posts', postsRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint with database status
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    await db.pool.query('SELECT 1');
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      environment: process.env.NODE_ENV || 'development'
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Don't leak error details in production
  const errorResponse = {
    message: process.env.NODE_ENV === 'production' 
      ? 'An error occurred' 
      : err.message,
    status: 'error'
  };

  res.status(err.status || 500).json(errorResponse);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection and server start
const startServer = async () => {
  try {
    await db.connect();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  db.pool.end(() => {
    logger.info('Database pool closed');
    process.exit(0);
  });
});

startServer();

module.exports = app;
```

---

### 3. Create Winston Logger

Create `server/utils/logger.js`:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'blog-api' },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // Write errors to error.log
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ]
});

// If we're not in production, log to console with more detail
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;
```

---

### 4. Create Environment Files

**Create `server/.env.example`:**

```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blog_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# Security
JWT_SECRET=your-jwt-secret-key-minimum-32-characters-long
SESSION_SECRET=your-session-secret-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=info

# Optional: Error Tracking
SENTRY_DSN=
```

**Create `server/.env.production.example`:**

```bash
# Server Configuration
NODE_ENV=production
PORT=5000

# Database Configuration (Use your production database)
DB_HOST=your-production-db-host
DB_PORT=5432
DB_NAME=blog_db_production
DB_USER=your_production_user
DB_PASSWORD=your_strong_production_password

# Security (MUST BE STRONG AND UNIQUE)
JWT_SECRET=CHANGE_THIS_TO_A_VERY_STRONG_SECRET_MINIMUM_256_BITS
SESSION_SECRET=CHANGE_THIS_TO_ANOTHER_STRONG_SECRET

# Frontend URL (Your production domain)
FRONTEND_URL=https://yourdomain.com

# Logging
LOG_LEVEL=warn

# Optional: Error Tracking
SENTRY_DSN=your-sentry-dsn-here
```

---

### 5. Create Frontend API Configuration

**Create `client/src/config/api.js`:**

```javascript
// API configuration based on environment
const getApiUrl = () => {
  // Check if we're in production
  if (process.env.NODE_ENV === 'production') {
    // Use environment variable or default to production API
    return process.env.REACT_APP_API_URL || 'https://api.yourdomain.com';
  }
  
  // Development: use proxy configured in package.json
  return '';
};

export const API_URL = getApiUrl();

// Export default axios config
export const axiosConfig = {
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};
```

**Create `client/.env.production`:**

```bash
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENV=production
```

**Create `client/.env.development`:**

```bash
REACT_APP_API_URL=
REACT_APP_ENV=development
```

---

### 6. Update Frontend to Use API Config

**Update `client/src/contexts/AuthContext.js`:**

Add at the top:
```javascript
import { axiosConfig } from '../config/api';

// Configure axios defaults
axios.defaults.timeout = axiosConfig.timeout;
if (axiosConfig.baseURL) {
  axios.defaults.baseURL = axiosConfig.baseURL;
}
```

---

### 7. Add Role-Based Access Control

**Update `server/middleware/auth.js`:**

```javascript
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists
    const result = await db.query(
      'SELECT id, username, role FROM users WHERE id = $1', 
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    const user = result.rows[0];
    req.user = {
      userId: user.id,
      username: user.username,
      role: user.role
    };
    
    next();
  } catch (err) {
    logger.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

module.exports = { auth, isAdmin };
```

---

### 8. Update Database Query Logging

**Update `server/config/database.js`:**

Replace console.log with logger:

```javascript
const { Pool } = require('pg');
const logger = require('../utils/logger');

// ... rest of the code ...

// Query helper function
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Only log in development or if duration is high
    if (process.env.NODE_ENV !== 'production' || duration > 1000) {
      logger.debug('Executed query', { 
        text: text.substring(0, 100), // Only log first 100 chars
        duration, 
        rows: res.rowCount 
      });
    }
    
    return res;
  } catch (err) {
    logger.error('Database query error:', { error: err.message, query: text });
    throw err;
  }
};
```

---

### 9. Update Package.json Scripts

**Update `server/package.json`:**

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "prod": "NODE_ENV=production node index.js",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

**Update root `package.json`:**

```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm start",
    "build": "cd client && npm run build",
    "start": "cd server && npm start",
    "prod": "cd server && npm run prod",
    "build:all": "npm install && cd server && npm install && cd ../client && npm install && npm run build"
  }
}
```

---

### 10. Create logs Directory

```bash
cd server
mkdir -p logs
```

**Update `.gitignore` to include logs:**

```
# Logs
logs/
*.log
```

---

## 🧪 Testing Your Changes

### 1. Test Development Mode

```bash
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm start
```

Visit http://localhost:3000 and verify everything works.

---

### 2. Test Production Build

```bash
# Build the client
cd client
npm run build

# Start server in production mode
cd ../server
NODE_ENV=production npm start
```

Visit http://localhost:5000 and verify the app loads.

---

### 3. Test Rate Limiting

Try making multiple rapid requests to `/api/auth/login` and verify you get rate limited.

---

### 4. Test Health Check

```bash
curl http://localhost:5000/api/health
```

Should return JSON with database status.

---

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] Update `server/.env` with production values
- [ ] Change `JWT_SECRET` to a strong random string (minimum 32 characters)
- [ ] Update `FRONTEND_URL` to your actual domain
- [ ] Update database credentials
- [ ] Test all endpoints with production build
- [ ] Verify CORS is working with your domain
- [ ] Test rate limiting
- [ ] Verify error handling doesn't leak information
- [ ] Check logs are being written correctly
- [ ] Test health check endpoint
- [ ] Verify static files are served correctly
- [ ] SSL/HTTPS certificate is configured
- [ ] Database has SSL enabled
- [ ] Create first admin user
- [ ] Backup database before deployment

---

## 🚀 Deployment Commands

### Build for Production

```bash
# Install all dependencies
npm run build:all

# Build will be in client/build/
```

### Start Production Server

```bash
cd server
NODE_ENV=production npm start
```

---

## 🔐 Generate Strong JWT Secret

Use this command to generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET` in production.

---

## 📊 Monitoring in Production

After deployment, monitor:

1. **Logs**: Check `server/logs/` directory regularly
2. **Health Check**: Setup monitoring to ping `/api/health` every 5 minutes
3. **Error Rate**: Monitor error.log for issues
4. **Response Time**: Check combined.log for slow queries
5. **Rate Limiting**: Monitor if legitimate users are being rate limited

---

## 🆘 Troubleshooting

### CORS Errors in Production
- Verify `FRONTEND_URL` in `.env` matches your domain exactly
- Check if your domain includes www or not
- Verify the origin header in browser dev tools

### Database Connection Fails
- Check database credentials in `.env`
- Verify database allows connections from your server IP
- Check if SSL is required and configured correctly

### Static Files Not Loading
- Verify `client/build` directory exists
- Check if `NODE_ENV=production` is set
- Verify path in `express.static` is correct

### Rate Limiting Too Aggressive
- Adjust `max` value in rate limiter configuration
- Consider different limits for different endpoints

---

## ✅ Verification

After implementing all fixes, verify:

```bash
# 1. Security headers present
curl -I http://localhost:5000/api/health

# Should see headers like:
# X-Content-Type-Options: nosniff
# X-Frame-Options: SAMEORIGIN
# Strict-Transport-Security: max-age=15552000

# 2. Rate limiting works
for i in {1..10}; do curl http://localhost:5000/api/auth/login; done

# Should eventually get "Too many requests"

# 3. Health check works
curl http://localhost:5000/api/health

# Should return database status
```

---

**Next Step:** After implementing these fixes, run the full deployment checklist from `PRODUCTION-READINESS-AUDIT.md`

