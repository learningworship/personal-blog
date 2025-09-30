# Personal Blog

A modern, responsive blog website built with React, Node.js, and an in-memory database for easy development.

## Features

- Clean, modern UI with Bootstrap styling
- Responsive design for all devices
- Blog post management (create, read, update, delete)
- In-memory database (no PostgreSQL required)
- RESTful API backend
- User authentication system

## Tech Stack

- **Frontend**: React, Bootstrap, Axios
- **Backend**: Node.js, Express
- **Database**: In-memory (mock database)

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation & Running

1. **Easy Setup (Windows):**
   ```bash
   .\start-mock.bat
   ```

2. **Manual Setup:**
   ```bash
   # Install dependencies
   npm install
   cd server && npm install
   cd ../client && npm install
   cd ..
   
   # Copy environment file
   copy server\env.mock server\.env
   
   # Start the application
   npm run dev
   ```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Login**: username: `admin`, password: `admin123`

## Sample Data

The application comes with sample blog posts and an admin user:
- 3 sample blog posts (2 published, 1 draft)
- Admin user: `admin` / `admin123`

## Development

- **Frontend only**: `cd client && npm start`
- **Backend only**: `cd server && npm run dev`
- **Both**: `npm run dev`
