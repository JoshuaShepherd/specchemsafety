# ⚡ Quick Start Guide - SpecChem Safety LMS v2

This guide will get you from zero to deployed in **under 30 minutes**.

## 📋 Pre-Flight Checklist

Before starting, make sure you have:

- [ ] Windows PC with PowerShell
- [ ] GitHub account: Josh-SpecChem (jshepherd@specchemllc.com)
- [ ] Supabase project credentials
- [ ] 30 minutes of time

---

## 🎯 The 5-Step Deployment

### Step 1: Install Git (5 minutes)

1. **Download Git**: https://git-scm.com/download/win
2. **Run installer** → Use all default settings → Click "Next" repeatedly → "Install"
3. **Close** the installer when done
4. **Open a NEW PowerShell window** (important!)
5. **Verify**: Type `git --version` and press Enter
   - ✅ Should show: `git version 2.x.x`
   - ❌ If error: Restart your computer and try again

---

### Step 2: Push to GitHub (10 minutes)

Open PowerShell and run these commands **one at a time**:

```powershell
# Navigate to your project
cd "C:\Users\jshepherd\OneDrive - SpecChem, LLC\Desktop\specchem-safety-lms-v2-main"

# Configure Git with your work identity
git config user.name "Josh-SpecChem"
git config user.email "jshepherd@specchemllc.com"

# Initialize Git repository
git init

# Stage all files
git add .

# Create first commit
git commit -m "Initial commit: SpecChem Safety LMS v2"
```

**Now create the GitHub repository:**

1. Open browser → Go to https://github.com/new
2. **Make sure you're logged in as Josh-SpecChem** (check top-right corner)
3. Fill in:
   - **Repository name**: `specchem-safety-lms-v2`
   - **Description**: `SpecChem Safety LMS - Production training platform`
   - **Private**: ✅ (keep checked)
   - **DO NOT** check "Initialize with README"
4. Click **"Create repository"**

**Push your code:**

Back in PowerShell, run:

```powershell
# Add GitHub as remote
git remote add origin https://github.com/Josh-SpecChem/specchem-safety-lms-v2.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**If prompted for login:**
- Username: `Josh-SpecChem`
- Password: Use a [Personal Access Token](https://github.com/settings/tokens/new)
  - Click the link above → "Generate new token (classic)"
  - Select scope: `repo` → Click "Generate"
  - Copy the token and paste it as your password

✅ **Success**: You should see progress bars and "Branch 'main' set up to track remote branch 'main' from 'origin'"

---

### Step 3: Deploy to Vercel (10 minutes)

1. **Go to Vercel**: https://vercel.com/signup
2. **Sign in with GitHub** → Authorize Vercel → Select Josh-SpecChem account
3. **Import Project**:
   - Click "Add New..." → "Project"
   - Find `Josh-SpecChem/specchem-safety-lms-v2`
   - Click "Import"

4. **Configure Project**:
   
   **Root Directory**: 
   - Click "Edit" next to Root Directory
   - Select `apps/safety-lms`
   - ✅ This is CRITICAL!

   **Framework Preset**: `Next.js` (should auto-detect)

   **Build & Development Settings**:
   - Build Command: `pnpm build` (default is fine)
   - Output Directory: `.next` (default is fine)
   - Install Command: `pnpm install` (default is fine)

5. **Add Environment Variables**:
   
   Click "Environment Variables" → Add these **one by one**:

   ```
   Name: NODE_VERSION
   Value: 18.17.0
   ```

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://radbukphijxenmgiljtu.supabase.co
   ```

   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: [GET FROM SUPABASE - see below]
   ```

   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: [GET FROM SUPABASE - see below]
   ```

   **To get Supabase keys:**
   - Open new tab → https://supabase.com/dashboard/project/radbukphijxenmgiljtu/settings/api
   - Copy `anon` `public` key → Paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` `secret` key → Paste as `SUPABASE_SERVICE_ROLE_KEY`

6. **Deploy**:
   - Click "Deploy"
   - ☕ Wait 2-3 minutes (watch the build logs!)

✅ **Success**: You'll see "Congratulations!" with a URL like `specchem-safety-lms-v2.vercel.app`

---

### Step 4: Verify Deployment (3 minutes)

1. **Click "Visit"** or go to your Vercel URL
2. **Check these:**
   - [ ] Website loads (no errors)
   - [ ] Login page appears
   - [ ] Styles are applied (looks nice)

3. **Test login** (if you have test credentials):
   - Enter email and password
   - Should redirect to dashboard
   - ✅ Success = Everything is working!

4. **Check Vercel Dashboard**:
   - Go back to Vercel
   - Check "Deployments" tab
   - Should show green checkmark ✅

---

### Step 5: Set Up Auto-Deploy (2 minutes)

Good news! This is **already done**. From now on:

- Every time you `git push` to `main` → Vercel auto-deploys
- Every Pull Request → Gets a preview deployment
- You get email notifications for each deployment

**Test it:**
```powershell
# Make a small change
echo "# SpecChem Safety LMS" > test.txt
git add test.txt
git commit -m "Test auto-deploy"
git push
```

Watch Vercel dashboard - you should see a new deployment start automatically! 🚀

---

## 🎉 You're Done!

Your app is now:
- ✅ **On GitHub**: https://github.com/Josh-SpecChem/specchem-safety-lms-v2
- ✅ **On Vercel**: [your-app].vercel.app
- ✅ **Auto-deploying**: Every push to main triggers a deployment
- ✅ **Production-ready**: With security headers and optimizations

---

## 📝 Next Steps (Optional)

### Add Custom Domain
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `training.specchemllc.com`)
3. Update DNS as instructed
4. Vercel handles SSL automatically

### Enable Preview Deployments
Already enabled! Every PR gets its own preview URL.

### Set Up Monitoring
1. Vercel Dashboard → Your Project → Analytics (automatically enabled)
2. Check "Runtime Logs" for errors
3. Enable alerts in Settings

### GitKraken MCP (Optional)
For a better Git experience in Cursor, see the [Installation Guide](#gitkraken-mcp-installation) below.

---

## 🆘 Troubleshooting

### "Git is not recognized"
- **Fix**: Close PowerShell, open a NEW window, try again
- Still broken? Restart your computer

### "Authentication failed" when pushing
- **Fix**: You need a Personal Access Token, not your password
- Generate here: https://github.com/settings/tokens
- Use token as password when prompted

### Vercel build fails
**Check these:**
1. Root directory is `apps/safety-lms` (not the repo root!)
2. Environment variables are set correctly
3. Supabase keys are valid (test at https://supabase.com)

### Website shows errors
**Check:**
1. Vercel logs: Deployment → Runtime Logs
2. Browser console: F12 → Console tab
3. Environment variables match Supabase project

### Can't login to deployed app
**Fix:**
1. Check Supabase dashboard → Authentication → URL Configuration
2. Add your Vercel URL to "Site URL" and "Redirect URLs"
3. Format: `https://your-app.vercel.app`

---

## 🔧 GitKraken MCP Installation

Want a better Git UI in Cursor? Install GitKraken MCP:

### Windows Installation

1. **Open Cursor Settings**:
   - Press `Ctrl + ,`
   - Or: File → Preferences → Settings

2. **Enable MCP**:
   - Search for "MCP" in settings
   - Find "Model Context Protocol"
   - Toggle ON

3. **Add GitKraken**:
   - Click "Edit in settings.json"
   - Add this configuration:

   ```json
   {
     "cursor.mcp.servers": {
       "gitkraken": {
         "command": "npx",
         "args": ["-y", "@gitkraken/mcp-server"]
       }
     }
   }
   ```

4. **Restart Cursor**:
   - Close Cursor completely
   - Reopen it

5. **Verify**:
   - Open any file in your project
   - Ask AI: "Show me Git status"
   - Should see Git information with better formatting

### Using GitKraken MCP

Once installed, you can ask AI to:
- "Show Git status"
- "Show recent commits"
- "Create a new branch called feature/xyz"
- "Show changes in this file"
- "Show Git history"

It provides a visual, AI-friendly interface to Git!

---

## 📚 Learn More

- **Full Documentation**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Project Overview**: See [docs/PROJECT_OVERVIEW.md](./docs/PROJECT_OVERVIEW.md)
- **Development Guide**: See [docs/DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md)

---

## 🆘 Still Stuck?

If you run into issues:

1. **Check the logs**:
   - Vercel: Deployment → Runtime Logs
   - Browser: Press F12 → Console tab
   - Supabase: Dashboard → Logs

2. **Compare with docs**:
   - [Vercel Docs](https://vercel.com/docs)
   - [Next.js Deployment](https://nextjs.org/docs/deployment)

3. **Common commands**:
   ```powershell
   git status              # What changed?
   git log --oneline       # Recent commits
   git push                # Push to GitHub
   vercel logs             # View deployment logs (if Vercel CLI installed)
   ```

---

**Time to complete**: ~30 minutes  
**Difficulty**: Beginner-friendly  
**Last updated**: October 17, 2025  

**Maintainer**: Josh Shepherd (jshepherd@specchemllc.com)


