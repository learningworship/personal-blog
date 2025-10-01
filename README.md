# Personal Blog

A modern, responsive blog website built with React, Node.js, and PostgreSQL database.

## Features

- Clean, modern UI with Bootstrap styling
- Responsive design for all devices
- Blog post management (create, read, update, delete)
- PostgreSQL database with automatic table initialization
- RESTful API backend
- User authentication system with JWT tokens
- Auto-generated SEO-friendly URLs (slugs)

## Tech Stack

- **Frontend**: React, Bootstrap, Axios
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT tokens with bcrypt password hashing

## Prerequisites

- Node.js (v16 or higher)
- npm
- PostgreSQL (v12 or higher)

## Installation & Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
cd ..
```

### 2. Database Setup

1. **Install PostgreSQL** (if not already installed)
   - Download from: https://www.postgresql.org/download/
   - Remember your PostgreSQL password during installation

2. **Create Database**
   - Open pgAdmin or use psql command line
   - Create a new database called `blog_db`
   - Note your database credentials

3. **Configure Environment**
   ```bash
   # Copy the environment template
   copy server\env.postgres server\.env
   
   # Edit server\.env with your database credentials:
   # DB_HOST=localhost
   # DB_PORT=5432
   # DB_NAME=blog_db
   # DB_USER=your_postgres_username
   # DB_PASSWORD=your_postgres_password
   # JWT_SECRET=your_jwt_secret_key_for_development
   # NODE_ENV=development
   # PORT=5000
   ```

### 3. Start the Application

```bash
# Start both frontend and backend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### 4. Initial Setup

1. **Create Admin User**: The database will be automatically initialized with tables
2. **Set Admin Password**: You'll need to create your first admin user through the API or database
3. **Start Blogging**: Create your first blog post!

## Development

- **Frontend only**: `cd client && npm start`
- **Backend only**: `cd server && npm run dev`
- **Both**: `npm run dev`

## Security Notes

- Change default JWT secret in production
- Use strong passwords for database users
- Never commit `.env` files to version control
- Consider using environment-specific configurations for production

## API Endpoints

- `GET /api/posts` - Get all published posts
- `GET /api/posts/:id` - Get specific post
- `POST /api/posts` - Create new post (requires authentication)
- `PUT /api/posts/:id` - Update post (requires authentication)
- `DELETE /api/posts/:id` - Delete post (requires authentication)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## 🚀 Production Deployment (Railway)

### Step 1: Deploy to Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub
   - Authorize Railway access

2. **Deploy Your Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your Personal_blog repository
   - Click "Deploy Now"

3. **Add PostgreSQL Database**
   - In project dashboard, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway creates the database automatically

### Step 2: Configure Environment Variables

In Railway dashboard → Variables tab, add:
```
NODE_ENV=production
PORT=5000
DB_HOST=your-railway-db-host
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=your-railway-db-password
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-app.railway.app
```

### Step 3: Initialize Database

1. **Go to PostgreSQL database** in Railway
2. **Click "Query" tab**
3. **Copy SQL from `server/scripts/init-db.sql`**
4. **Paste and run** the initialization script

### Step 4: Create Admin User

1. **Test your API**
   - Visit `https://your-app.railway.app/api/health`
   - Should return `{"status":"OK"}`

2. **Create admin user via API**
   ```bash
   curl -X POST https://your-app.railway.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","email":"admin@example.com","password":"admin123"}'
   ```

3. **Start blogging!**
   - Visit your Railway URL
   - Login with admin credentials
   - Create your first post

## 🎯 Deployment Checklist

- [ ] Railway account created
- [ ] Project deployed from GitHub
- [ ] PostgreSQL database added
- [ ] Environment variables set
- [ ] Database tables initialized
- [ ] Admin user created
- [ ] Blog is live and working!

## 💰 Cost Breakdown

- **Railway**: $5/month (includes database)
- **Total**: $5/month

## 🔧 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check Railway database credentials
   - Verify environment variables

2. **CORS Errors**
   - Update `FRONTEND_URL` in Railway environment variables
   - Check CORS configuration in `server/index.js`

3. **Build Failures**
   - Check Railway build logs
   - Verify all dependencies are in `package.json`

### Support:
- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
