# SpecChem Safety LMS - Deployment Guide

## Prerequisites Checklist

### 1. Install Git
- **Download**: https://git-scm.com/download/win
- **Installation**: Use default settings
- **Verify**: Open PowerShell and run `git --version`

### 2. GitHub Account Setup
- **Account**: Josh-SpecChem
- **Email**: jshepherd@specchemllc.com
- **Action Required**: Make sure you're logged into GitHub with this account in your browser

### 3. Vercel Account
- **Sign up**: https://vercel.com/signup
- **Recommendation**: Sign up with your GitHub account (Josh-SpecChem)

---

## Step 1: Install Git

1. Download Git for Windows from https://git-scm.com/download/win
2. Run the installer with default settings
3. Open a NEW PowerShell window
4. Verify installation:
   ```powershell
   git --version
   ```

---

## Step 2: Configure Git with Your Work Account

Once Git is installed, run these commands in PowerShell from your project directory:

```powershell
cd "C:\Users\jshepherd\OneDrive - SpecChem, LLC\Desktop\specchem-safety-lms-v2-main"

# Set your work identity
git config user.name "Josh-SpecChem"
git config user.email "jshepherd@specchemllc.com"

# Verify configuration
git config --list
```

---

## Step 3: Initialize Git Repository

```powershell
# Initialize the repository
git init

# Add all files (respects .gitignore)
git add .

# Create initial commit
git commit -m "Initial commit: SpecChem Safety LMS v2"
```

---

## Step 4: Create GitHub Repository

### Option A: Via GitHub Website (Recommended)

1. Go to https://github.com/new
2. **Make sure you're logged in as Josh-SpecChem**
3. Fill in the details:
   - **Repository name**: `specchem-safety-lms-v2`
   - **Description**: `SpecChem Safety Learning Management System - Production LMS for HazMat and OSHA training`
   - **Visibility**: 
     - ✅ **Private** (recommended for production code with business logic)
     - ⚠️ Public (only if you want to open-source it)
   - **DO NOT** initialize with README, .gitignore, or license (we already have them)
4. Click **"Create repository"**

### Option B: Via GitHub CLI (if you have it installed)

```powershell
gh repo create specchem-safety-lms-v2 --private --source=. --remote=origin
```

---

## Step 5: Push to GitHub

After creating the repository on GitHub, you'll see a page with commands. Run:

```powershell
# Add the remote (replace with your actual repo URL)
git remote add origin https://github.com/Josh-SpecChem/specchem-safety-lms-v2.git

# Verify the remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

**If prompted for credentials:**
- Use your GitHub username: `Josh-SpecChem`
- For password, use a **Personal Access Token** (not your GitHub password)
  - Create one at: https://github.com/settings/tokens
  - Scopes needed: `repo` (Full control of private repositories)

---

## Step 6: Deploy to Vercel

### Method 1: Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com/login
2. Sign in with your GitHub account (Josh-SpecChem)
3. Click **"Add New Project"**
4. Select **"Import Git Repository"**
5. Find and select `Josh-SpecChem/specchem-safety-lms-v2`
6. Configure the project:

   **Framework Preset**: `Next.js`
   
   **Root Directory**: `apps/safety-lms` ← **IMPORTANT!**
   
   **Build Command**: 
   ```
   pnpm build
   ```
   
   **Output Directory**: `.next` (default)
   
   **Install Command**: 
   ```
   pnpm install
   ```

7. **Environment Variables** (click "Add"):

   **Required Variables:**
   ```
   NODE_VERSION=18.17.0
   NEXT_PUBLIC_SUPABASE_URL=https://radbukphijxenmgiljtu.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
   SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
   ```

   **Get your Supabase keys:**
   - Go to https://supabase.com/dashboard/project/radbukphijxenmgiljtu/settings/api
   - Copy `anon` key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` key → paste as `SUPABASE_SERVICE_ROLE_KEY`

8. Click **"Deploy"**

### Method 2: Via Vercel CLI

```powershell
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel --prod
```

---

## Step 7: Post-Deployment Checklist

### 1. Verify Deployment
- [ ] Visit your Vercel deployment URL
- [ ] Check that the login page loads
- [ ] Verify Supabase connection (try logging in)

### 2. Configure Domain (Optional)
- [ ] Add custom domain in Vercel dashboard
- [ ] Update DNS records
- [ ] Enable HTTPS (automatic in Vercel)

### 3. Set Up GitHub Integration
- [ ] Enable automatic deployments on push
- [ ] Set up preview deployments for PRs

### 4. Database Migrations
Your migrations are in `apps/safety-lms/drizzle/`. They should auto-run, but verify:
- [ ] Check Supabase dashboard for applied migrations
- [ ] Verify RLS policies are active

### 5. Monitor First Deployment
- [ ] Check Vercel logs for any errors
- [ ] Test core functionality (login, course access)
- [ ] Verify multi-tenancy (plant isolation)

---

## Common Issues & Solutions

### Issue: "Git not found"
**Solution**: Install Git, then open a NEW PowerShell window

### Issue: "Authentication failed" when pushing
**Solution**: Use a Personal Access Token instead of password
- Create at: https://github.com/settings/tokens
- Select scope: `repo`
- Use token as password

### Issue: "Vercel build failed"
**Solution**: Check these:
1. Root directory is set to `apps/safety-lms`
2. Build command uses `pnpm` (not `npm`)
3. Environment variables are set correctly
4. Node version is 18.x or higher

### Issue: "Database connection failed"
**Solution**: 
1. Verify Supabase keys in Vercel environment variables
2. Check Supabase project is active (not paused)
3. Verify connection pooling settings

### Issue: "Module not found" during build
**Solution**: 
1. Ensure all dependencies are in `package.json`
2. Clear Vercel cache and redeploy
3. Check that pnpm-lock.yaml is committed

---

## GitKraken MCP Setup (Optional Enhancement)

Once Git is installed, you can optionally install GitKraken MCP for a better Git experience in Cursor:

1. **Install GitKraken MCP**:
   - Open Cursor Settings (Ctrl+,)
   - Go to "Cursor Settings" → "Features" → "Model Context Protocol"
   - Add this configuration:

   ```json
   {
     "mcpServers": {
       "gitkraken": {
         "command": "npx",
         "args": ["-y", "@gitkraken/mcp-server"]
       }
     }
   }
   ```

2. **Restart Cursor**

3. **Benefits**:
   - Visual Git operations
   - Branch management
   - Merge conflict resolution
   - Commit history visualization

---

## Maintenance Commands

### Update Dependencies
```powershell
pnpm update --latest
```

### Run Database Migrations
```powershell
cd apps/safety-lms
pnpm db:migrate
```

### Deploy New Version
```powershell
git add .
git commit -m "Description of changes"
git push origin main
# Vercel will auto-deploy
```

### Rollback Deployment
1. Go to Vercel dashboard
2. Find the previous successful deployment
3. Click "Promote to Production"

---

## Security Checklist

- [ ] All `.env` files are in `.gitignore` (✅ already configured)
- [ ] Service role key is ONLY in Vercel environment variables
- [ ] GitHub repository is private
- [ ] Supabase RLS policies are enabled
- [ ] No hardcoded secrets in code

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Supabase**: https://supabase.com/docs
- **Drizzle ORM**: https://orm.drizzle.team/docs

---

## Quick Reference

### Git Commands
```powershell
git status                  # Check status
git add .                   # Stage all changes
git commit -m "message"     # Commit changes
git push                    # Push to GitHub
git pull                    # Pull latest changes
git log --oneline           # View commit history
```

### Vercel Commands
```powershell
vercel                      # Deploy preview
vercel --prod               # Deploy to production
vercel logs                 # View deployment logs
vercel env ls               # List environment variables
```

### Project Commands
```powershell
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm type-check            # Check TypeScript types
pnpm lint                  # Run linter
```

---

**Last Updated**: October 17, 2025
**Project**: SpecChem Safety LMS v2
**Maintainer**: Josh Shepherd (jshepherd@specchemllc.com)

