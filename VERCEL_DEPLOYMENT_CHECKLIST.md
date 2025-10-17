# SpecChem Safety LMS - Vercel Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All TypeScript errors resolved (`pnpm type-check`)
- [ ] No ESLint errors (`pnpm lint`)
- [ ] All tests passing (if applicable)
- [ ] No console.log statements in production code
- [ ] No hardcoded secrets or credentials in code
- [ ] `.env` files are in `.gitignore` ✓ (already configured)

### ✅ Database
- [ ] Supabase project is active and accessible
- [ ] All migrations are applied (`pnpm db:migrate`)
- [ ] RLS policies are enabled on all tables
- [ ] Database connection pooling is configured
- [ ] Test database connection locally

### ✅ Environment Variables
- [ ] All required variables documented (see VERCEL_ENV_VARIABLES.md)
- [ ] `NEXTAUTH_SECRET` generated and ready
- [ ] Supabase credentials confirmed
- [ ] Database password confirmed
- [ ] Production URLs prepared

### ✅ Git Repository
- [ ] Git is installed and configured
- [ ] Repository initialized locally
- [ ] All changes committed
- [ ] GitHub repository created (private recommended)
- [ ] Code pushed to GitHub
- [ ] Repository accessible from your GitHub account

### ✅ Vercel Account
- [ ] Vercel account created
- [ ] Signed up with GitHub account (recommended)
- [ ] GitHub integration connected

---

## Deployment Steps

### Step 1: Push to GitHub

```bash
# If not already done
cd "C:\Users\jshepherd\OneDrive - SpecChem, LLC\Desktop\specchem-safety-lms-v2-main"

# Initialize Git (if needed)
git init
git config user.name "Josh-SpecChem"
git config user.email "jshepherd@specchemllc.com"

# Commit all changes
git add .
git commit -m "chore: prepare for Vercel deployment"

# Push to GitHub (if not already done)
git remote add origin https://github.com/Josh-SpecChem/specchem-safety-lms-v2.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Sign in with GitHub (Josh-SpecChem)
3. Click **"Import Git Repository"**
4. Find and select: `Josh-SpecChem/specchem-safety-lms-v2`
5. Click **"Import"**

### Step 3: Configure Build Settings

**Framework Preset:** Next.js ✓ (auto-detected)

**Root Directory:** `apps/safety-lms` ⚠️ **CRITICAL!**
- Click "Edit" next to Root Directory
- Enter: `apps/safety-lms`
- Verify the path is correct

**Build Command:** (use default)
```bash
pnpm build
```

**Output Directory:** `.next` (default, no change needed)

**Install Command:** (use default)
```bash
pnpm install
```

**Node.js Version:** 
- Add environment variable: `NODE_VERSION=18.17.0`

### Step 4: Set Environment Variables

Copy values from `VERCEL_ENV_VARIABLES.md` and add to Vercel:

**Required (set for Production & Preview):**
1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `DATABASE_URL`
4. `NODE_ENV=production`
5. `NEXT_PUBLIC_APP_URL` (use your Vercel URL)
6. `NEXTAUTH_URL` (same as APP_URL)
7. `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)

**Optional but recommended:**
8. `NODE_VERSION=18.17.0`
9. `SUPABASE_SERVICE_ROLE_KEY` (for admin features)

**How to add in Vercel:**
1. In import screen, click **"Add Environment Variables"**
2. Enter each variable name and value
3. Select environments: ✓ Production ✓ Preview
4. Click **"Add"**
5. Repeat for all variables

### Step 5: Deploy

1. Review all settings
2. Click **"Deploy"**
3. Wait for build to complete (usually 2-5 minutes)
4. Watch build logs for any errors

---

## Post-Deployment Verification

### ✅ Deployment Success
- [ ] Build completed successfully
- [ ] No build errors in logs
- [ ] Deployment status shows "Ready"
- [ ] Vercel assigned a URL (e.g., `your-project.vercel.app`)

### ✅ Application Testing
- [ ] Visit deployment URL
- [ ] Homepage loads without errors
- [ ] Login page accessible at `/auth/login`
- [ ] Can log in with test credentials
- [ ] Dashboard loads after login
- [ ] Course list displays
- [ ] No console errors in browser

### ✅ Database Connection
- [ ] Login successful (confirms auth connection)
- [ ] User profile loads (confirms database query)
- [ ] Course data displays (confirms RLS policies work)
- [ ] Navigation works properly

### ✅ API Routes
- [ ] Check Vercel Function Logs for any errors
- [ ] Test a few API endpoints
- [ ] Verify authentication middleware works
- [ ] Check that protected routes require login

### ✅ Performance
- [ ] Lighthouse score > 70
- [ ] First load < 3 seconds
- [ ] No excessive bundle size warnings
- [ ] Images load properly

---

## Configure Custom Domain (Optional)

### Step 1: Add Domain in Vercel
1. Go to Project Settings → Domains
2. Click **"Add"**
3. Enter your domain (e.g., `safety.specchemllc.com`)
4. Vercel will provide DNS records

### Step 2: Update DNS
1. Go to your domain registrar/DNS provider
2. Add the DNS records provided by Vercel
3. Wait for DNS propagation (5-30 minutes)

### Step 3: Update Environment Variables
1. Go to Settings → Environment Variables
2. Update `NEXT_PUBLIC_APP_URL` to your custom domain
3. Update `NEXTAUTH_URL` to your custom domain
4. Trigger a new deployment for changes to take effect

---

## Continuous Deployment Setup

### Auto-Deploy on Push
Vercel automatically sets this up. Every push to `main` will deploy to production.

**Recommended workflow:**
1. Create a new branch for features: `git checkout -b feature/new-feature`
2. Make changes and commit
3. Push branch: `git push origin feature/new-feature`
4. Vercel creates a preview deployment
5. Test the preview deployment
6. Create Pull Request on GitHub
7. Merge to main → auto-deploys to production

### Branch Deployments
- **main** → Production (`your-domain.com`)
- **Other branches** → Preview deployments (`branch-name-project.vercel.app`)
- **Pull Requests** → Preview deployments with comments on PR

---

## Monitoring & Maintenance

### ✅ Set Up Monitoring
- [ ] Enable Vercel Analytics (Settings → Analytics)
- [ ] Set up error monitoring (Sentry recommended)
- [ ] Configure uptime monitoring (UptimeRobot, Better Uptime, etc.)
- [ ] Set up Supabase monitoring/alerts

### ✅ Regular Checks
- [ ] Check Vercel deployment logs weekly
- [ ] Monitor Supabase database usage
- [ ] Review error logs
- [ ] Check for security vulnerabilities: `pnpm audit`

### ✅ Update Schedule
- [ ] Update dependencies monthly: `pnpm update --latest`
- [ ] Apply security patches immediately
- [ ] Test in preview deployment before production
- [ ] Keep Next.js version up to date

---

## Rollback Procedure

If deployment has critical issues:

1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." menu → **"Promote to Production"**
4. Previous version is now live
5. Fix issues locally
6. Redeploy when ready

---

## Common Issues & Solutions

### Build Failure: "Cannot find module"
**Solution:** 
```bash
# Ensure all dependencies are in package.json
pnpm install
# Commit package.json and pnpm-lock.yaml
git add package.json pnpm-lock.yaml
git commit -m "fix: update dependencies"
git push
```

### Build Failure: TypeScript Errors
**Solution:** Enable build errors (already done in config), fix all errors:
```bash
pnpm type-check
# Fix all errors shown
```

### Runtime Error: Database Connection Failed
**Solution:**
1. Verify `DATABASE_URL` in Vercel environment variables
2. Check Supabase project is not paused
3. Test connection string locally
4. Ensure database pooler URL is used

### Runtime Error: Authentication Failed
**Solution:**
1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches deployment URL
3. Verify Supabase credentials
4. Clear browser cookies and try again

### Slow Performance
**Solution:**
1. Check Vercel function logs for slow queries
2. Enable database query caching
3. Optimize images with Next.js Image component
4. Review bundle size: `pnpm build` shows bundle analysis

### RLS Policy Errors
**Solution:**
1. Check Supabase logs (Dashboard → Logs)
2. Verify RLS policies are enabled
3. Test policies with different user roles
4. Update policies if needed

---

## Emergency Contacts

- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support
- **Next.js Docs:** https://nextjs.org/docs
- **Drizzle ORM Docs:** https://orm.drizzle.team/docs

---

## Deployment Checklist Summary

**Before First Deploy:**
- [ ] All code committed to GitHub
- [ ] Environment variables prepared
- [ ] Database migrations applied
- [ ] Tests passing

**During Deploy:**
- [ ] Root directory set to `apps/safety-lms`
- [ ] All environment variables added
- [ ] Build completes successfully

**After Deploy:**
- [ ] Application loads
- [ ] Login works
- [ ] Database connection verified
- [ ] No console errors

**Ongoing:**
- [ ] Monitor logs regularly
- [ ] Update dependencies monthly
- [ ] Test preview deployments before merging
- [ ] Keep documentation updated

---

**Status:** Ready for Deployment ✓

**Last Updated:** October 17, 2025  
**Project:** SpecChem Safety LMS v2  
**Maintainer:** Josh Shepherd (jshepherd@specchemllc.com)

