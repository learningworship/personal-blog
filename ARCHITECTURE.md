# 🏗️ Application Architecture

## Development Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    DEVELOPMENT                           │
└─────────────────────────────────────────────────────────┘

┌──────────────────┐              ┌──────────────────┐
│   React App      │              │   Express API    │
│  localhost:3000  │──(proxy)──>  │  localhost:5000  │
│                  │              │                  │
│  - Hot Reload    │              │  - Nodemon       │
│  - Source Maps   │              │  - Dev Logs      │
│  - Proxy to API  │              │  /api/*          │
└──────────────────┘              └──────────────────┘
                                           │
                                           │
                                           ▼
                                  ┌──────────────────┐
                                  │   PostgreSQL     │
                                  │   localhost      │
                                  │   (no SSL)       │
                                  └──────────────────┘

User accesses: http://localhost:3000
API calls go through webpack dev server proxy
CORS: localhost:3000
```

---

## Production Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCTION                            │
└─────────────────────────────────────────────────────────┘

                    ┌──────────────────────────┐
                    │    Hosting Platform      │
                    │  (Render/Railway/etc)    │
                    │  https://your-app.com    │
                    └──────────────────────────┘
                              │
                              ▼
                    ┌──────────────────────────┐
                    │   Node.js Server :5000   │
                    │                          │
                    │  ┌────────────────────┐  │
                    │  │  Express API       │  │
                    │  │  /api/*           │  │
                    │  └────────────────────┘  │
                    │           +              │
                    │  ┌────────────────────┐  │
                    │  │  Static Files      │  │
                    │  │  (React Build)     │  │
                    │  │  /*               │  │
                    │  └────────────────────┘  │
                    └──────────────────────────┘
                              │
                              │ SSL
                              ▼
                    ┌──────────────────────────┐
                    │   PostgreSQL Cloud       │
                    │   (Render/Neon/etc)      │
                    │   SSL Enabled            │
                    └──────────────────────────┘

User accesses: https://your-app.com
Same origin - no CORS needed
All requests handled by single server
```

---

## Request Flow

### Development
```
User Browser
    │
    ├─> http://localhost:3000/
    │       ↓
    │   React Dev Server (webpack)
    │       ↓
    │   Returns index.html + source JS
    │
    └─> http://localhost:3000/api/posts
            ↓
        Proxied to http://localhost:5000/api/posts
            ↓
        Express Server
            ↓
        PostgreSQL (localhost)
```

### Production
```
User Browser
    │
    ├─> https://your-app.com/
    │       ↓
    │   Node.js Server
    │       ↓
    │   Static middleware serves build/index.html
    │       ↓
    │   Returns minified HTML + bundled JS
    │
    └─> https://your-app.com/api/posts
            ↓
        Same Node.js Server
            ↓
        Express API Router
            ↓
        PostgreSQL Cloud (SSL)
```

---

## File Structure

```
Personal_blog/
│
├── client/                    # React Frontend
│   ├── public/               # Static assets
│   ├── src/                  # React source code
│   │   ├── components/       # Reusable components
│   │   ├── contexts/         # React contexts (Auth)
│   │   ├── pages/            # Page components
│   │   ├── config/           # Configuration files
│   │   ├── App.js            # Main app component
│   │   └── index.js          # Entry point
│   ├── build/                # Production build (gitignored)
│   └── package.json          # Client dependencies
│
├── server/                   # Node.js Backend
│   ├── config/               # Server configuration
│   │   └── database.js       # PostgreSQL connection
│   ├── middleware/           # Express middleware
│   │   └── auth.js           # JWT authentication
│   ├── routes/               # API route handlers
│   │   ├── auth.js           # Authentication routes
│   │   └── posts.js          # Blog post routes
│   ├── scripts/              # Utility scripts
│   │   └── init-db.sql       # Database initialization
│   ├── .env                  # Environment variables (gitignored)
│   ├── index.js              # Server entry point
│   └── package.json          # Server dependencies
│
├── DEPLOYMENT.md             # Deployment guide
├── DEPLOYMENT-CHECKLIST.md   # Deployment checklist
├── DEPLOYMENT-SUMMARY.md     # Changes explanation
├── ARCHITECTURE.md           # This file
├── render.yaml               # Render.com config
├── Procfile                  # Heroku config
├── .gitignore                # Git ignore rules
├── package.json              # Root package (dev scripts)
└── README.md                 # Project documentation
```

---

## Environment Variables Flow

### Development (`.env` file)
```javascript
// server/.env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blog_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=dev_secret_not_secure
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Production (Hosting Platform Dashboard)
```javascript
// Set via platform UI or CLI
DB_HOST=dpg-xxxxx.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=blog_db_xyz
DB_USER=blog_user_xyz
DB_PASSWORD=super_secure_random_password_123
JWT_SECRET=a1b2c3d4e5f6g7h8...64_character_random_string
NODE_ENV=production
PORT=5000  # Usually auto-set by platform
FRONTEND_URL=https://your-app.onrender.com
```

---

## Data Models

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Posts Table
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  author VARCHAR(100) NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### Public Endpoints
```
GET  /api/posts              # Get all published posts (paginated)
GET  /api/posts/:slug        # Get single post by slug
POST /api/auth/register      # Register new user
POST /api/auth/login         # Login user
GET  /api/health             # Health check
```

### Protected Endpoints (Require JWT)
```
POST   /api/posts            # Create new post (admin)
PUT    /api/posts/:id        # Update post (admin)
DELETE /api/posts/:id        # Delete post (admin)
GET    /api/auth/me          # Get current user info
```

---

## Security Layers

```
┌─────────────────────────────────────┐
│  1. HTTPS (Transport Security)      │  ← Platform provides
├─────────────────────────────────────┤
│  2. CORS (Origin Validation)        │  ← server/index.js
├─────────────────────────────────────┤
│  3. JWT (Authentication)            │  ← middleware/auth.js
├─────────────────────────────────────┤
│  4. Bcrypt (Password Hashing)       │  ← routes/auth.js
├─────────────────────────────────────┤
│  5. Input Validation                │  ← express-validator
├─────────────────────────────────────┤
│  6. SQL Injection Protection        │  ← Parameterized queries
├─────────────────────────────────────┤
│  7. XSS Protection                  │  ← React auto-escaping
├─────────────────────────────────────┤
│  8. Database SSL                    │  ← config/database.js
└─────────────────────────────────────┘
```

---

## Build Process

### Development
```bash
npm run dev
    ↓
Runs concurrently:
    ├─> cd client && npm start      # React dev server
    └─> cd server && npm run dev    # Nodemon server
```

### Production
```bash
npm run build-production
    ↓
1. npm install (root dependencies)
    ↓
2. cd client && npm install
    ↓
3. npm run build (creates optimized bundle)
    ↓
4. cd ../server && npm install
    ↓
Ready to deploy!

npm run start-production
    ↓
NODE_ENV=production node server/index.js
    ↓
Server starts, serves API + static files
```

---

## Scaling Considerations

### Current Architecture (Single Server)
- ✅ Perfect for personal blog
- ✅ Simple deployment
- ✅ Low cost (free tier)
- ⚠️ Limited to ~1000 concurrent users

### Future Scaling Options
1. **Horizontal Scaling**: Multiple server instances with load balancer
2. **CDN**: CloudFlare/CloudFront for static assets
3. **Database Replication**: Read replicas for better performance
4. **Caching**: Redis for frequently accessed data
5. **Separate Frontend**: Deploy React to Netlify/Vercel

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI framework |
| **Routing** | React Router 6 | Client-side routing |
| **HTTP Client** | Axios | API requests |
| **Styling** | Bootstrap 5 | UI components |
| **Markdown** | react-markdown | Content rendering |
| **Backend** | Node.js + Express | API server |
| **Authentication** | JWT + bcrypt | Secure auth |
| **Database** | PostgreSQL | Data persistence |
| **Validation** | express-validator | Input validation |
| **Development** | Nodemon + Concurrently | Dev tools |

---

## Performance Optimizations

### Already Implemented
- ✅ Production builds (minified, optimized)
- ✅ Database indexing (slug, published, created_at)
- ✅ Connection pooling (pg Pool)
- ✅ Pagination (prevents loading all posts)
- ✅ Static file caching (Express static middleware)

### Future Improvements
- [ ] Image optimization (compress before upload)
- [ ] Lazy loading images
- [ ] Service worker (PWA)
- [ ] Database query optimization
- [ ] Response compression (gzip)

---

This architecture provides a solid foundation for a personal blog with room to grow! 🚀

