# 🚀 Vercel + Supabase Deployment Checklist

## 📋 Pre-Deployment Setup

### ✅ Code Preparation
- [ ] Code is working locally
- [ ] All dependencies are in package.json
- [ ] Environment variables are configured
- [ ] CORS settings updated for production
- [ ] Code committed to Git

### ✅ GitHub Setup
- [ ] Repository created on GitHub
- [ ] Code pushed to main branch
- [ ] Repository is public (for free Vercel deployment)

## 🗄️ Step 1: Supabase Database Setup

### ✅ Create Supabase Account
- [ ] Go to https://supabase.com
- [ ] Sign up with GitHub/Google
- [ ] Verify email address

### ✅ Create New Project
- [ ] Click "New Project"
- [ ] Choose organization
- [ ] Enter project name: `personal-blog`
- [ ] Enter database password (save this!)
- [ ] Choose region (closest to you)
- [ ] Click "Create new project"
- [ ] Wait for project to be ready (2-3 minutes)

### ✅ Get Database Credentials
- [ ] Go to Settings → Database
- [ ] Copy the following details:
  - [ ] **Host**: `db.xxxxxxxxxxxxx.supabase.co`
  - [ ] **Port**: `5432`
  - [ ] **Database**: `postgres`
  - [ ] **Username**: `postgres`
  - [ ] **Password**: `[your-password]`

### ✅ Initialize Database Tables
- [ ] Go to SQL Editor in Supabase
- [ ] Click "New Query"
- [ ] Copy and paste the SQL from `server/scripts/init-db.sql`
- [ ] Click "Run" to execute the script
- [ ] Verify tables are created (posts, users)

## 🚀 Step 2: Vercel Deployment

### ✅ Create Vercel Account
- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub
- [ ] Authorize Vercel to access your repositories

### ✅ Import Project
- [ ] Click "New Project"
- [ ] Select your GitHub repository
- [ ] Click "Import"

### ✅ Configure Build Settings
- [ ] **Framework Preset**: Other
- [ ] **Root Directory**: Leave empty
- [ ] **Build Command**: `cd client && npm run build`
- [ ] **Output Directory**: `client/build`
- [ ] **Install Command**: `npm install && cd server && npm install && cd ../client && npm install`

### ✅ Set Environment Variables
In Vercel dashboard → Settings → Environment Variables:
- [ ] `DB_HOST` = `your-supabase-host.supabase.co`
- [ ] `DB_PORT` = `5432`
- [ ] `DB_NAME` = `postgres`
- [ ] `DB_USER` = `postgres`
- [ ] `DB_PASSWORD` = `your-supabase-password`
- [ ] `JWT_SECRET` = `your-super-secret-jwt-key`
- [ ] `NODE_ENV` = `production`
- [ ] `FRONTEND_URL` = `https://your-blog.vercel.app` (update after deployment)

### ✅ Deploy
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete (5-10 minutes)
- [ ] Note your deployment URL: `https://your-blog.vercel.app`

### ✅ Update Frontend URL
- [ ] Go back to Environment Variables
- [ ] Update `FRONTEND_URL` to your actual Vercel URL
- [ ] Redeploy if necessary

## 🧪 Step 3: Testing & Setup

### ✅ Test API Endpoints
- [ ] Visit `https://your-blog.vercel.app/api/health`
- [ ] Should return: `{"status":"OK","timestamp":"..."}`

### ✅ Create Admin User
- [ ] Use the API to create admin user:
  ```bash
  curl -X POST https://your-blog.vercel.app/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","email":"admin@example.com","password":"admin123"}'
  ```

### ✅ Test Frontend
- [ ] Visit your blog URL
- [ ] Should see the homepage with sample posts
- [ ] Test login functionality
- [ ] Create a test blog post
- [ ] Verify everything works

## 🎉 Step 4: Go Live!

### ✅ Final Checks
- [ ] Blog is accessible at your Vercel URL
- [ ] Login works with admin credentials
- [ ] Can create, edit, and delete posts
- [ ] All features working correctly

### ✅ Custom Domain (Optional)
- [ ] Go to Vercel → Domains
- [ ] Add your custom domain
- [ ] Update DNS settings
- [ ] Update `FRONTEND_URL` environment variable

## 🔧 Troubleshooting

### ❌ Common Issues & Solutions

**Database Connection Failed:**
- [ ] Check Supabase credentials
- [ ] Verify environment variables in Vercel
- [ ] Check Supabase project is active

**CORS Errors:**
- [ ] Update `FRONTEND_URL` in Vercel
- [ ] Check CORS configuration in `server/index.js`

**Build Failures:**
- [ ] Check build logs in Vercel dashboard
- [ ] Verify all dependencies are installed
- [ ] Check for syntax errors

**API Not Working:**
- [ ] Test `/api/health` endpoint
- [ ] Check Vercel function logs
- [ ] Verify database connection

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **GitHub Issues**: Create issue in your repository

## 🎯 Success Criteria

Your blog is successfully deployed when:
- [ ] ✅ Blog loads at your Vercel URL
- [ ] ✅ Can login with admin credentials
- [ ] ✅ Can create and manage blog posts
- [ ] ✅ Database is connected and working
- [ ] ✅ All features function correctly

**🎉 Congratulations! Your blog is live! 🎉**
