# 🚂 Railway Deployment Guide - Step by Step

**Platform:** Railway.app  
**Time Required:** 15-20 minutes  
**Difficulty:** Beginner-Friendly ⭐⭐

---

## 📋 Pre-Deployment Checklist

Before you start, make sure you have:
- [x] GitHub account
- [x] Your code committed to GitHub (or ready to push)
- [x] This project working locally
- [ ] Railway account (you'll create this in Step 1)

---

## 🚀 Step-by-Step Deployment Process

### **Step 1: Create Railway Account**

1. Go to **https://railway.app**
2. Click **"Start a New Project"** or **"Login"**
3. Choose **"Login with GitHub"** (recommended - easiest integration)
4. Authorize Railway to access your GitHub repositories
5. ✅ You're now logged into Railway!

**You should see:** Railway dashboard with "New Project" button

---

### **Step 2: Push Your Code to GitHub** (If Not Already Done)

1. Open your terminal in the project root
2. Make sure all changes are committed:
   ```bash
   git status
   git add .
   git commit -m "Ready for deployment"
   ```

3. Push to GitHub:
   ```bash
   git push origin main
   ```
   (Replace `main` with `master` if that's your branch name)

4. ✅ Verify your code is on GitHub by visiting your repository

**Important:** Make sure your `.env` file is NOT pushed (should be in `.gitignore`)

---

### **Step 3: Create New Project on Railway**

1. On Railway dashboard, click **"New Project"**
2. You'll see several options:
   - Deploy from GitHub repo
   - Deploy from template
   - Provision a database
3. Click **"Deploy from GitHub repo"**
4. Railway will show your GitHub repositories
5. Find and select **"Personal_blog"** (or your repo name)
6. Click on it to start deployment

**Railway will now:**
- Clone your repository
- Detect it's a Node.js app
- Start building automatically

⏳ **Wait for initial build** (this will FAIL - that's expected! We haven't setup the database yet)

---

### **Step 4: Add PostgreSQL Database**

1. In your Railway project dashboard, click **"New"** button (top right)
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will provision a PostgreSQL database (takes ~30 seconds)
5. ✅ You'll see a new "PostgreSQL" service appear in your project

**You should see:** Two services in your project:
- Your web app (Personal_blog)
- PostgreSQL database

---

### **Step 5: Get Database Connection Details**

1. Click on the **PostgreSQL** service (the database card)
2. Go to the **"Variables"** tab
3. You'll see several variables:
   - `DATABASE_URL` (full connection string)
   - `PGHOST` (database host)
   - `PGPORT` (database port - usually 5432)
   - `PGDATABASE` (database name)
   - `PGUSER` (database user)
   - `PGPASSWORD` (database password)

4. **Keep this tab open** - you'll need these values in the next step!

**Note:** Railway automatically creates these. You can use either:
- Individual variables (PGHOST, PGPORT, etc.)
- OR the full `DATABASE_URL` string

---

### **Step 6: Configure Environment Variables for Your App**

1. Go back to your project dashboard
2. Click on your **web app** service (Personal_blog)
3. Go to the **"Variables"** tab
4. Click **"New Variable"** and add these one by one:

#### **Required Variables:**

```
NODE_ENV=production
```

```
PORT=5000
```

```
DB_HOST=${{Postgres.PGHOST}}
```
(This references the PostgreSQL service automatically!)

```
DB_PORT=${{Postgres.PGPORT}}
```

```
DB_NAME=${{Postgres.PGDATABASE}}
```

```
DB_USER=${{Postgres.PGUSER}}
```

```
DB_PASSWORD=${{Postgres.PGPASSWORD}}
```

```
DB_SSL=true
```

#### **Generate JWT Secret:**

Open a terminal and run:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and add as:
```
JWT_SECRET=<paste-the-generated-value-here>
```

#### **Generate Session Secret:**

Run the same command again for a different secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Add as:
```
SESSION_SECRET=<paste-the-generated-value-here>
```

#### **Frontend URL:**

Railway will give you a URL after deployment. For now, use:
```
FRONTEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
```
(This automatically uses your Railway domain!)

#### **Logging:**

```
LOG_LEVEL=info
```

**💡 Pro Tip:** Railway's `${{Postgres.VARIABLE}}` syntax automatically connects your services!

---

### **Step 7: Configure Build and Start Commands**

1. Still in your web app service, go to the **"Settings"** tab
2. Scroll down to **"Build"** section

#### **Root Directory:**
- Leave empty (or set to `/` if needed)

#### **Build Command:**
```
npm run build:all
```

#### **Start Command:**
```
cd server && npm start
```

#### **Watch Paths (Optional):**
- Leave as default or add: `server/**` and `client/**`

3. Click **"Save"** or the changes auto-save

---

### **Step 8: Set Up Deployment Settings**

1. Still in **Settings** tab, scroll to **"Deploy"** section

2. **Auto Deploy:**
   - Make sure **"Enable auto-deploy"** is ON
   - This means every git push will trigger a deployment

3. **Health Check (Optional but Recommended):**
   - Scroll to **"Health Check"** section
   - Set **Health Check Path:** `/api/health`
   - Set **Health Check Timeout:** 30 seconds
   - Railway will verify your app is running

---

### **Step 9: Trigger Deployment**

1. Go back to your project dashboard
2. Click on your web app service
3. Go to the **"Deployments"** tab
4. Click **"Redeploy"** button (if not already deploying)

**OR** just push a commit to GitHub:
```bash
git commit --allow-empty -m "Trigger Railway deployment"
git push origin main
```

#### **What Happens:**
1. Railway pulls your code
2. Runs `npm run build:all` (installs dependencies + builds React)
3. Starts server with `npm start`
4. Connects to PostgreSQL database
5. Your app goes live! 🎉

⏳ **Wait for deployment** (usually 2-4 minutes)

**Watch the logs:**
- Click on your web app
- Go to **"Deployments"** tab
- Click on the active deployment
- Watch the build logs in real-time

---

### **Step 10: Get Your App URL**

1. Once deployment succeeds (green checkmark ✅)
2. Click on your web app service
3. Go to the **"Settings"** tab
4. Scroll to **"Domains"** section
5. You'll see your Railway-provided URL like:
   ```
   your-app-name-production-xxxx.up.railway.app
   ```

6. Click **"Generate Domain"** if no domain exists yet

7. **Copy this URL** - this is your live website! 🎉

---

### **Step 11: Update FRONTEND_URL (Important!)**

1. Now that you have your Railway domain, update the environment variable
2. Go to your web app service → **"Variables"** tab
3. Find **FRONTEND_URL**
4. Update it to your actual Railway URL:
   ```
   FRONTEND_URL=https://your-app-name-production-xxxx.up.railway.app
   ```
   (Copy the exact URL from Step 10)

5. Click **"Redeploy"** to apply the change

**Why this matters:** CORS needs to know your frontend URL to allow requests

---

### **Step 12: Create Your First Admin User**

Your database is now live but empty. Let's create an admin user:

#### **Option A: Via API (Recommended)**

1. Open your browser or Postman
2. Make a POST request to:
   ```
   https://your-railway-url.up.railway.app/api/auth/register
   ```

3. Send JSON body:
   ```json
   {
     "username": "admin",
     "email": "your-email@example.com",
     "password": "your-secure-password"
   }
   ```

4. You'll get back a JWT token and user object

#### **Option B: Update Role to Admin**

The user you created is a regular user. To make them admin:

1. In Railway, click on your **PostgreSQL** service
2. Go to the **"Data"** tab
3. You can browse your database tables here
4. Find the `users` table
5. Update the role from `user` to `admin`

**OR** use Railway's PostgreSQL client:
1. Click on PostgreSQL service → **"Connect"**
2. Copy the connection command
3. Run in your terminal to connect
4. Execute SQL:
   ```sql
   UPDATE users SET role = 'admin' WHERE username = 'admin';
   ```

---

### **Step 13: Test Your Deployment**

1. **Visit Your App:**
   ```
   https://your-railway-url.up.railway.app
   ```
   You should see your blog!

2. **Test Health Endpoint:**
   ```
   https://your-railway-url.up.railway.app/api/health
   ```
   Should return:
   ```json
   {
     "status": "OK",
     "timestamp": "...",
     "database": "connected",
     "environment": "production"
   }
   ```

3. **Test Login:**
   - Go to `/login`
   - Login with your admin credentials
   - Try accessing `/admin`
   - Create a test blog post

4. **Check Logs:**
   - In Railway dashboard → Your app → **"Deployments"**
   - Click on active deployment → View logs
   - You should see Winston logs appearing!

---

### **Step 14: Set Up Custom Domain (Optional)**

Want to use your own domain instead of Railway's?

1. Buy a domain from Namecheap, GoDaddy, etc.
2. In Railway → Your app → **"Settings"** → **"Domains"**
3. Click **"Custom Domain"**
4. Enter your domain (e.g., `myblog.com`)
5. Railway will show you DNS records to add
6. Go to your domain registrar
7. Add the DNS records Railway provided:
   - Type: CNAME
   - Name: @ (or www)
   - Value: (Railway provides this)
8. Wait for DNS propagation (5 minutes - 48 hours)
9. Update `FRONTEND_URL` environment variable to your custom domain
10. Redeploy

✅ Your app is now on your custom domain!

---

## 🎯 Deployment Checklist

After following all steps, verify:

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] PostgreSQL database added
- [ ] Environment variables configured (all 11 variables)
- [ ] Build command set: `npm run build:all`
- [ ] Start command set: `cd server && npm start`
- [ ] Health check configured: `/api/health`
- [ ] Deployment successful (green checkmark)
- [ ] Railway URL obtained
- [ ] FRONTEND_URL updated with actual Railway URL
- [ ] Admin user created
- [ ] App loads in browser
- [ ] Health endpoint responds correctly
- [ ] Can login and access admin panel
- [ ] Logs visible in Railway dashboard

---

## 🔧 Troubleshooting Common Issues

### **Issue 1: Build Fails**

**Error:** "Cannot find module..." or npm install errors

**Solution:**
1. Check **Deployments** → Logs
2. Make sure all dependencies are in `package.json`
3. Try locally: `npm run build:all`
4. If works locally, commit and push again

---

### **Issue 2: Database Connection Failed**

**Error:** "Database connection error" in logs

**Solution:**
1. Verify all database variables are set correctly
2. Make sure you used `${{Postgres.VARIABLE}}` syntax
3. Check `DB_SSL=true` is set
4. In PostgreSQL service → **"Variables"**, verify database is running

---

### **Issue 3: CORS Errors**

**Error:** Browser console shows "CORS policy blocked"

**Solution:**
1. Make sure `FRONTEND_URL` matches your Railway domain exactly
2. Include `https://` in the URL
3. Redeploy after changing environment variables
4. Check browser dev tools for the exact origin being blocked

---

### **Issue 4: 404 on All Routes**

**Error:** App loads but all pages show 404

**Solution:**
1. Verify build command ran successfully
2. Check that `client/build` directory was created
3. Make sure `NODE_ENV=production` is set
4. Verify start command: `cd server && npm start`

---

### **Issue 5: App Works But No Admin Access**

**Solution:**
1. Register a user via `/register`
2. Connect to PostgreSQL (Railway → PostgreSQL → Data tab)
3. Update user role to 'admin' in users table

---

### **Issue 6: Environment Variable Not Working**

**Solution:**
1. After adding/changing variables, you MUST redeploy
2. Variables don't auto-apply to running deployments
3. Click "Redeploy" button or push a new commit

---

## 📊 Monitoring Your App

### **View Logs:**
1. Railway Dashboard → Your App → **"Deployments"**
2. Click on active deployment
3. Scroll through logs in real-time
4. Your Winston logs appear here!

### **Check Metrics:**
1. Go to **"Metrics"** tab
2. See CPU, Memory, Network usage
3. Monitor response times

### **Database Monitoring:**
1. Click on PostgreSQL service
2. Go to **"Metrics"** tab
3. See connection count, storage usage

---

## 💰 Railway Pricing

### **Starter Plan (What You'll Use):**
- **$5 credit per month** (free trial)
- Usually enough for small projects
- ~500 hours of uptime included
- After credit runs out, you pay per usage

### **Typical Monthly Cost for Your Blog:**
- **Web Service:** ~$5-10/month
- **PostgreSQL:** ~$5-10/month  
- **Total:** ~$10-20/month

### **Usage Tips:**
- Monitor usage in Railway dashboard
- Set spending limits in **"Settings"** → **"Usage"**
- Optimize if costs are high (reduce resources)

---

## 🚀 Next Steps After Deployment

### **1. Setup Monitoring**
- Add UptimeRobot or similar to ping your app
- Monitor `/api/health` endpoint
- Get alerts if app goes down

### **2. Configure Backups**
- Railway auto-backs up PostgreSQL
- Can also export database manually
- Consider automated backup service

### **3. Setup CI/CD**
- Already done! ✅ Railway auto-deploys on git push
- Consider adding GitHub Actions for tests

### **4. Improve Performance**
- Monitor Railway metrics
- Optimize slow queries
- Consider upgrading resources if needed

### **5. Add Features**
- Comments system
- Image uploads (use Cloudinary or AWS S3)
- Email notifications
- Search functionality

---

## 📞 Getting Help

### **Railway Resources:**
- **Docs:** https://docs.railway.app
- **Discord:** https://discord.gg/railway
- **Status:** https://status.railway.app

### **Your App Issues:**
- Check Railway deployment logs first
- Test locally in production mode: `npm run prod`
- Check environment variables are set correctly
- Review CORS configuration

---

## ✅ Success! Your App is Live!

Congratulations! 🎉 Your Personal Blog is now:

- ✅ **Live on the internet** at your Railway URL
- ✅ **Secured with HTTPS** (Railway provides SSL)
- ✅ **Connected to PostgreSQL** database
- ✅ **Auto-deploying** on every git push
- ✅ **Monitored** with health checks
- ✅ **Logged** with Winston (visible in Railway)

**Share your Railway URL and start blogging!** 🚀

---

## 🎯 Quick Commands Summary

### **Deploy Changes:**
```bash
git add .
git commit -m "Your changes"
git push origin main
```
(Railway auto-deploys!)

### **View Logs:**
- Railway Dashboard → App → Deployments → Click deployment

### **Update Environment Variable:**
- Railway Dashboard → App → Variables → Edit → Redeploy

### **Rollback:**
- Railway Dashboard → Deployments → Find previous deployment → Redeploy

---

**Need help?** Check the troubleshooting section or Railway's Discord community!

**Happy Deploying! 🚂**

