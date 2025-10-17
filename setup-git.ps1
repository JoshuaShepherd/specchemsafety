# SpecChem Safety LMS - Git Setup Script
# This script automates the Git configuration and initial commit

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   SpecChem Safety LMS - Git Setup Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
Write-Host "Checking for Git installation..." -ForegroundColor Yellow
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue

if (-not $gitInstalled) {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Run the installer with default settings" -ForegroundColor White
    Write-Host "3. Close PowerShell and open a NEW window" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to open Git download page"
    Start-Process "https://git-scm.com/download/win"
    exit 1
}

Write-Host "✅ Git is installed: $(git --version)" -ForegroundColor Green
Write-Host ""

# Check if already initialized
if (Test-Path ".git") {
    Write-Host "⚠️  Git repository already initialized!" -ForegroundColor Yellow
    $continue = Read-Host "Do you want to continue anyway? (yes/no)"
    if ($continue -ne "yes") {
        Write-Host "Setup cancelled." -ForegroundColor Red
        exit 1
    }
}

# Configure Git user
Write-Host "Configuring Git user..." -ForegroundColor Yellow
git config user.name "Josh-SpecChem"
git config user.email "jshepherd@specchemllc.com"
Write-Host "✅ Git configured with work account" -ForegroundColor Green
Write-Host "   Name: Josh-SpecChem" -ForegroundColor Gray
Write-Host "   Email: jshepherd@specchemllc.com" -ForegroundColor Gray
Write-Host ""

# Show current configuration
Write-Host "Current Git configuration:" -ForegroundColor Yellow
git config --list --local | Select-String "user\."
Write-Host ""

# Initialize repository if not already done
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repository initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Repository already initialized" -ForegroundColor Green
}
Write-Host ""

# Check for changes
Write-Host "Checking for changes to commit..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "Found changes to commit." -ForegroundColor Green
    Write-Host ""
    
    # Stage all files
    Write-Host "Staging all files..." -ForegroundColor Yellow
    git add .
    Write-Host "✅ Files staged" -ForegroundColor Green
    Write-Host ""
    
    # Create commit
    Write-Host "Creating initial commit..." -ForegroundColor Yellow
    git commit -m "Initial commit: SpecChem Safety LMS v2"
    Write-Host "✅ Commit created" -ForegroundColor Green
} else {
    Write-Host "✅ No changes to commit (already committed)" -ForegroundColor Green
}
Write-Host ""

# Check for remote
$hasRemote = git remote | Select-String "origin"
if (-not $hasRemote) {
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "   Next Steps: Create GitHub Repository" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Go to: https://github.com/new" -ForegroundColor White
    Write-Host "2. Make sure you're logged in as Josh-SpecChem" -ForegroundColor White
    Write-Host "3. Repository name: specchem-safety-lms-v2" -ForegroundColor White
    Write-Host "4. Set to Private ✓" -ForegroundColor White
    Write-Host "5. DO NOT initialize with README" -ForegroundColor White
    Write-Host "6. Click Create repository" -ForegroundColor White
    Write-Host ""
    Write-Host "Then run these commands:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "git remote add origin https://github.com/Josh-SpecChem/specchem-safety-lms-v2.git" -ForegroundColor Cyan
    Write-Host "git branch -M main" -ForegroundColor Cyan
    Write-Host "git push -u origin main" -ForegroundColor Cyan
    Write-Host ""
    
    $openGitHub = Read-Host "Press Enter to open GitHub repository creation page"
    Start-Process "https://github.com/new"
} else {
    Write-Host "✅ Remote 'origin' is already configured" -ForegroundColor Green
    Write-Host ""
    git remote -v
    Write-Host ""
    
    # Ask if they want to push
    Write-Host "Would you like to push to GitHub now?" -ForegroundColor Yellow
    $push = Read-Host "(yes/no)"
    
    if ($push -eq "yes") {
        Write-Host ""
        Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
        git branch -M main
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to push. You may need to authenticate." -ForegroundColor Red
            Write-Host ""
            Write-Host "If you need a Personal Access Token:" -ForegroundColor Yellow
            Write-Host "1. Go to: https://github.com/settings/tokens/new" -ForegroundColor White
            Write-Host "2. Select scope: repo" -ForegroundColor White
            Write-Host "3. Generate token" -ForegroundColor White
            Write-Host "4. Use token as password when prompted" -ForegroundColor White
        }
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Setup Complete!" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Deploy to Vercel" -ForegroundColor Yellow
Write-Host "See QUICK_START.md for instructions" -ForegroundColor Gray
Write-Host ""

