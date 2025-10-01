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

## 🚀 Production Deployment (Vercel + Supabase)

### Step 1: Set Up Supabase Database

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up for free account
   - Create new project

2. **Get Database Credentials**
   - Go to Settings → Database
   - Copy connection details:
     - Host
     - Port (5432)
     - Database name (postgres)
     - Username (postgres)
     - Password

3. **Set Up Database Tables**
   - Go to SQL Editor in Supabase
   - Run the initialization script from `server/scripts/init-db.sql`

### Step 2: Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Import your repository
   - Set build settings:
     - **Framework Preset**: Other
     - **Root Directory**: Leave empty
     - **Install Command**: `npm install && cd server && npm install && cd ../client && npm install`
     - **Build Command**: `cd client && npm run build`
     - **Output Directory**: `client/build`

3. **Set Environment Variables**
   In Vercel dashboard, go to Settings → Environment Variables:
   ```
   DB_HOST=your-supabase-host.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your-supabase-password
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=production
   FRONTEND_URL=https://your-blog.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your blog will be live at `https://your-blog.vercel.app`

### Step 3: Create Admin User

1. **Access your deployed API**
   - Go to `https://your-blog.vercel.app/api/health`
   - Should return `{"status":"OK"}`

2. **Create admin user via API**
   ```bash
   curl -X POST https://your-blog.vercel.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","email":"admin@example.com","password":"admin123"}'
   ```

3. **Login and start blogging!**
   - Go to your blog URL
   - Login with admin credentials
   - Create your first post

## 🎯 Deployment Checklist

- [ ] Supabase project created
- [ ] Database tables initialized
- [ ] Code pushed to GitHub
- [ ] Vercel project connected
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Admin user created
- [ ] Blog is live and working!

## 💰 Cost Breakdown

- **Vercel**: Free (personal projects)
- **Supabase**: Free (500MB database, 2GB bandwidth)
- **Total**: $0/month

## 🔧 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check Supabase credentials
   - Verify environment variables in Vercel

2. **CORS Errors**
   - Update `FRONTEND_URL` in Vercel environment variables
   - Check CORS configuration in `server/index.js`

3. **Build Failures**
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in `package.json`

### Support:
- Vercel Documentation: https://vercel.com/docs
- Supabase Documentation: https://supabase.com/docs
