@echo off
echo 🐘 Setting up PostgreSQL Database Schema

REM Check if psql is available
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not installed or not in PATH
    echo Please install PostgreSQL and add it to your PATH
    pause
    exit /b 1
)

echo ✅ PostgreSQL is available

echo.
echo 🔧 Initializing database schema and sample data...

REM Run the initialization script
psql -U blog_user -d blog_db -f init-db.sql

if %errorlevel% neq 0 (
    echo ❌ Failed to initialize database
    echo.
    echo Troubleshooting:
    echo 1. Make sure PostgreSQL is running
    echo 2. Check that blog_db database exists
    echo 3. Verify blog_user has proper permissions
    echo.
    pause
    exit /b 1
)

echo ✅ Database initialized successfully!
echo.
echo 📊 Database contains:
echo   - 3 published blog posts
echo   - 1 draft post
echo   - 1 admin user (username: admin, password: admin123)
echo.
pause
