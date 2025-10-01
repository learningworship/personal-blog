# 📋 Deployment Checklist

Use this checklist to ensure smooth deployment of your Personal Blog.

## Pre-Deployment

- [ ] All code changes committed to Git
- [ ] Code pushed to GitHub/GitLab
- [ ] All tests passing (if any)
- [ ] No console errors in development
- [ ] Build runs successfully: `npm run build`

## Database Setup

- [ ] Cloud PostgreSQL database created
- [ ] Database credentials saved securely
- [ ] Database connection tested
- [ ] Tables will auto-initialize on first connection

## Environment Variables

Create these in your hosting platform:

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5000` (or platform default)
- [ ] `DB_HOST` = Your database host
- [ ] `DB_PORT` = `5432`
- [ ] `DB_NAME` = Your database name
- [ ] `DB_USER` = Your database user
- [ ] `DB_PASSWORD` = Your database password (keep secure!)
- [ ] `JWT_SECRET` = Random 64+ character string (generate new one!)
- [ ] `FRONTEND_URL` = Your deployed app URL (e.g., https://myapp.onrender.com)

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Deployment Configuration

- [ ] Platform: ________ (Render/Railway/Heroku/etc)
- [ ] Build command configured: `npm run build-production`
- [ ] Start command configured: `npm run start-production`
- [ ] Auto-deploy on Git push enabled (optional)
- [ ] Custom domain configured (optional)

## Post-Deployment Verification

- [ ] App loads at deployed URL
- [ ] Health check works: `https://your-app.com/api/health`
- [ ] Database connected (check logs)
- [ ] No CORS errors in browser console
- [ ] Can navigate between pages
- [ ] Register new user works
- [ ] Login works
- [ ] Admin user created (via database or register + update)
- [ ] Can create blog post (as admin)
- [ ] Can edit blog post
- [ ] Can delete blog post
- [ ] Blog posts display on home page
- [ ] Individual post page works
- [ ] Search functionality works
- [ ] Pagination works
- [ ] Logout works
- [ ] HTTPS enabled (should be automatic)

## Security

- [ ] `.env` files NOT committed to Git
- [ ] Strong database password used
- [ ] Strong JWT_SECRET generated (64+ chars)
- [ ] CORS properly configured
- [ ] Only admin users can create/edit/delete posts
- [ ] SQL injection protected (using parameterized queries - already done)
- [ ] XSS protected (React handles this - already done)

## Monitoring

- [ ] Can access deployment logs
- [ ] Error monitoring set up (optional)
- [ ] Uptime monitoring set up (optional - e.g., UptimeRobot)
- [ ] Performance monitoring (optional - e.g., New Relic)

## Documentation

- [ ] Deployment platform documented
- [ ] Admin credentials stored securely (password manager)
- [ ] Database credentials stored securely
- [ ] Recovery plan documented (database backups, etc)

## Optional Enhancements

- [ ] Custom domain connected
- [ ] SSL certificate configured (usually automatic)
- [ ] CDN configured for images (optional)
- [ ] Email notifications set up (optional)
- [ ] Analytics added (optional - Google Analytics, etc)
- [ ] SEO optimization (meta tags, sitemap)
- [ ] Social media preview images

## Backup Strategy

- [ ] Database backup schedule configured
- [ ] Code backed up to Git (already done)
- [ ] Environment variables documented securely
- [ ] Recovery procedure tested

## Common Issues Checklist

If something doesn't work:

- [ ] Check deployment logs for errors
- [ ] Verify all environment variables are set correctly
- [ ] Verify database is running and accessible
- [ ] Check CORS configuration matches deployed URL
- [ ] Verify build completed successfully
- [ ] Check browser console for frontend errors
- [ ] Test API endpoints directly: `/api/health`, `/api/posts`
- [ ] Verify PostgreSQL SSL is enabled for production
- [ ] Check that `FRONTEND_URL` exactly matches your app URL

## Rollback Plan

If deployment fails:

1. [ ] Previous version URL: _______________
2. [ ] Database backup location: _______________
3. [ ] How to rollback: _______________

## Success Criteria

Your deployment is successful when:

- ✅ App loads without errors
- ✅ Users can register and login
- ✅ Admin can create, edit, delete posts
- ✅ Public users can view published posts
- ✅ All pages navigate correctly
- ✅ No console errors
- ✅ HTTPS is active
- ✅ Performance is acceptable (< 3s page load)

---

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Platform**: _______________  
**URL**: _______________  
**Notes**: _______________

