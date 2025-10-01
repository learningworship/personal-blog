# 🚀 Quick Deploy to Vercel + Supabase

## 🎯 One-Command Setup (After Manual Steps)

Once you've completed the Supabase and Vercel setup manually, use this to prepare your code:

```bash
# 1. Prepare for deployment
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main

# 2. Your code is now ready for Vercel!
```

## 📋 Manual Steps Required

### 1. Supabase Setup (5 minutes)
1. Go to https://supabase.com
2. Create account and new project
3. Get database credentials
4. Run SQL script in Supabase SQL Editor

### 2. Vercel Setup (5 minutes)
1. Go to https://vercel.com
2. Import your GitHub repository
3. Set environment variables
4. Deploy!

## 🔧 Environment Variables for Vercel

Copy these into Vercel → Settings → Environment Variables:

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

## 🎉 That's It!

Your blog will be live at your Vercel URL in about 10 minutes!

**Total Cost: $0/month** 🆓
