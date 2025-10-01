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

- Use strong passwords for database users
- Never commit `.env` files to version control
- Keep your JWT secret secure

## API Endpoints

- `GET /api/posts` - Get all published posts
- `GET /api/posts/:id` - Get specific post
- `POST /api/posts` - Create new post (requires authentication)
- `PUT /api/posts/:id` - Update post (requires authentication)
- `DELETE /api/posts/:id` - Delete post (requires authentication)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## 🎯 Development Features

- **Local PostgreSQL database** with automatic table initialization
- **Hot reload** for both frontend and backend
- **ESLint** for code quality
- **Bootstrap** for responsive design
- **JWT authentication** with secure password hashing
