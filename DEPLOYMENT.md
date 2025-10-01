# Deployment Guide

This guide walks you through deploying your Personal Blog to production.

## 🚀 Quick Deploy to Render (Recommended)

### Step 1: Prepare Your Repository

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   ```

2. **Push to GitHub:**
   ```bash
   git push origin main
   ```

### Step 2: Set Up Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **PostgreSQL**
3. Fill in:
   - **Name**: `blog-database`
   - **Database**: `blog_db`
   - **User**: (auto-generated)
   - **Region**: Choose closest to you
   - **Plan**: Free
4. Click **Create Database**
5. **Copy the connection details** (you'll need these)

### Step 3: Deploy Web Service

1. In Render Dashboard, click **New +** → **Web Service**
2. Connect your GitHub repository
3. Fill in:
   - **Name**: `personal-blog`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Environment**: `Node`
   - **Build Command**: 
     ```
     npm install && cd client && npm install && npm run build && cd ../server && npm install
     ```
   - **Start Command**: 
     ```
     cd server && NODE_ENV=production node index.js
     ```
   - **Plan**: Free

4. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=<from step 2>
   DB_PORT=5432
   DB_NAME=blog_db
   DB_USER=<from step 2>
   DB_PASSWORD=<from step 2>
   JWT_SECRET=<generate-random-string-64-chars>
   FRONTEND_URL=<will be provided after deployment>
   ```

5. Click **Create Web Service**

### Step 4: Update Frontend URL

1. After deployment completes, copy your app URL (e.g., `https://personal-blog.onrender.com`)
2. Go to **Environment** tab
3. Update `FRONTEND_URL` to your app URL
4. Save changes (will trigger auto-redeploy)

### Step 5: Create Admin User

You'll need to create your first admin user directly in the database:

1. In Render Dashboard, go to your PostgreSQL service
2. Click **Connect** → **External Connection**
3. Use a PostgreSQL client (pgAdmin, DBeaver, or psql) to connect
4. Run this SQL (replace values):
   ```sql
   INSERT INTO users (username, email, password_hash, role)
   VALUES (
     'admin',
     'your-email@example.com',
     '$2a$10$...', -- Generate this by registering first, then update role
     'admin'
   );
   ```

   **Easier method**: 
   - Register normally at `https://your-app.onrender.com/register`
   - Then update the user's role to 'admin' in the database:
     ```sql
     UPDATE users SET role = 'admin' WHERE username = 'your-username';
     ```

### Step 6: Test Your Deployment

1. Visit your app URL
2. Register/Login
3. Create your first blog post
4. Verify everything works!

## 🔧 Other Deployment Options

### Deploy to Railway

1. Go to [Railway](https://railway.app/)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Add PostgreSQL service
5. Configure environment variables (same as above)
6. Deploy!

### Deploy to Heroku

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Create Heroku app:
   ```bash
   heroku create your-blog-name
   ```
3. Add PostgreSQL:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```
4. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret-here
   heroku config:set FRONTEND_URL=https://your-app.herokuapp.com
   ```
5. Deploy:
   ```bash
   git push heroku main
   ```

### Deploy to DigitalOcean App Platform

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click **Create App**
3. Connect GitHub repository
4. Configure build and run commands (same as Render)
5. Add managed PostgreSQL database
6. Set environment variables
7. Deploy!

## 📝 Post-Deployment Checklist

- [ ] Database is accessible and tables are created
- [ ] Admin user is created and can login
- [ ] Can create/edit/delete blog posts
- [ ] Blog posts display correctly
- [ ] Images load properly
- [ ] Authentication works
- [ ] HTTPS is enabled (automatic on most platforms)
- [ ] Custom domain configured (optional)

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong JWT_SECRET** - Min 64 characters
3. **Use strong database password**
4. **Enable 2FA** on your hosting platform
5. **Regularly update dependencies**:
   ```bash
   npm audit fix
   ```

## 🐛 Troubleshooting

### "Cannot connect to database"
- Verify database credentials in environment variables
- Check database is running and accessible
- Verify SSL is enabled for production DB

### "CORS error"
- Ensure `FRONTEND_URL` matches your actual deployment URL
- Check CORS configuration in `server/index.js`

### "404 on refresh"
- This is normal! The server is configured to handle React routing
- If it persists, verify the build folder exists

### "API calls failing"
- Check browser console for specific errors
- Verify API routes are accessible: `https://your-app.com/api/health`
- Check server logs in hosting platform dashboard

## 🔄 Updating Your Deployment

Simply push to GitHub:
```bash
git add .
git commit -m "Update blog"
git push origin main
```

Most platforms auto-deploy on push!

## 📊 Monitoring

- **Render**: Check Logs tab in dashboard
- **Railway**: Check Deployments → Logs
- **Heroku**: `heroku logs --tail`

## 💰 Cost Optimization

All platforms mentioned offer free tiers sufficient for personal blogs:
- **Render**: 750 hours/month free
- **Railway**: $5 free credit/month
- **Heroku**: Free dyno hours (requires credit card)

For production with more traffic, consider upgrading to paid tiers ($7-25/month).

