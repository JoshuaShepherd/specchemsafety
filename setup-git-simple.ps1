# SpecChem Safety LMS - Git Setup Script
# Simple version without special characters

Write-Host "================================================"
Write-Host "   SpecChem Safety LMS - Git Setup Script"
Write-Host "================================================"
Write-Host ""

# Check if Git is installed
Write-Host "Checking for Git installation..."
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue

if (-not $gitInstalled) {
    Write-Host "ERROR: Git is not installed!"
    Write-Host ""
    Write-Host "Please install Git first:"
    Write-Host "1. Download from: https://git-scm.com/download/win"
    Write-Host "2. Run the installer with default settings"
    Write-Host "3. Close PowerShell and open a NEW window"
    Write-Host "4. Run this script again"
    Write-Host ""
    Read-Host "Press Enter to open Git download page"
    Start-Process "https://git-scm.com/download/win"
    exit 1
}

Write-Host "SUCCESS: Git is installed"
git --version
Write-Host ""

# Configure Git user
Write-Host "Configuring Git user..."
git config user.name "Josh-SpecChem"
git config user.email "jshepherd@specchemllc.com"
Write-Host "SUCCESS: Git configured"
Write-Host "   Name: Josh-SpecChem"
Write-Host "   Email: jshepherd@specchemllc.com"
Write-Host ""

# Initialize repository if not already done
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..."
    git init
    Write-Host "SUCCESS: Repository initialized"
} else {
    Write-Host "SUCCESS: Repository already initialized"
}
Write-Host ""

# Stage and commit all files
Write-Host "Checking for changes to commit..."
$status = git status --porcelain
if ($status) {
    Write-Host "Found changes. Creating commit..."
    git add .
    git commit -m "Initial commit: SpecChem Safety LMS v2"
    Write-Host "SUCCESS: Commit created"
} else {
    Write-Host "SUCCESS: No changes to commit (already committed)"
}
Write-Host ""

# Check for remote
$hasRemote = git remote | Select-String "origin"
if (-not $hasRemote) {
    Write-Host "================================================"
    Write-Host "   Next: Create GitHub Repository"
    Write-Host "================================================"
    Write-Host ""
    Write-Host "1. Go to: https://github.com/new"
    Write-Host "2. Make sure you are logged in as Josh-SpecChem"
    Write-Host "3. Repository name: specchem-safety-lms-v2"
    Write-Host "4. Set to Private (checked)"
    Write-Host "5. DO NOT initialize with README"
    Write-Host "6. Click Create repository button"
    Write-Host ""
    Write-Host "Then run these commands:"
    Write-Host ""
    Write-Host "git remote add origin https://github.com/Josh-SpecChem/specchem-safety-lms-v2.git"
    Write-Host "git branch -M main"
    Write-Host "git push -u origin main"
    Write-Host ""
    
    $openGitHub = Read-Host "Press Enter to open GitHub repository creation page"
    Start-Process "https://github.com/new"
} else {
    Write-Host "SUCCESS: Remote origin is already configured"
    Write-Host ""
    git remote -v
    Write-Host ""
    
    # Ask if they want to push
    Write-Host "Would you like to push to GitHub now? (yes/no)"
    $push = Read-Host
    
    if ($push -eq "yes") {
        Write-Host ""
        Write-Host "Pushing to GitHub..."
        git branch -M main
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "SUCCESS: Pushed to GitHub!"
        } else {
            Write-Host "ERROR: Failed to push. You may need to authenticate."
            Write-Host ""
            Write-Host "If you need a Personal Access Token:"
            Write-Host "1. Go to: https://github.com/settings/tokens/new"
            Write-Host "2. Select scope: repo"
            Write-Host "3. Generate token"
            Write-Host "4. Use token as password when prompted"
        }
    }
}

Write-Host ""
Write-Host "================================================"
Write-Host "   Setup Complete!"
Write-Host "================================================"
Write-Host ""
Write-Host "Next: Deploy to Vercel"
Write-Host "See QUICK_START.md for instructions"
Write-Host ""


