# Run this script AFTER Git is installed
# This will configure Git and create your initial commit

Write-Host "================================================"
Write-Host "   Post-Git Installation Setup"
Write-Host "================================================"
Write-Host ""

# Verify Git is installed
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "ERROR: Git is still not found!"
    Write-Host "Make sure you opened a NEW PowerShell window after installing Git"
    exit 1
}

Write-Host "SUCCESS: Git found!"
git --version
Write-Host ""

# Configure Git
Write-Host "Step 1: Configuring Git with your work account..."
git config user.name "Josh-SpecChem"
git config user.email "jshepherd@specchemllc.com"
Write-Host "SUCCESS: Git configured"
Write-Host ""

# Initialize repository
Write-Host "Step 2: Initializing Git repository..."
if (-not (Test-Path ".git")) {
    git init
    Write-Host "SUCCESS: Repository initialized"
} else {
    Write-Host "SUCCESS: Repository already initialized"
}
Write-Host ""

# Create .gitignore if needed
Write-Host "Step 3: Checking .gitignore..."
if (Test-Path ".gitignore") {
    Write-Host "SUCCESS: .gitignore exists"
} else {
    Write-Host "WARNING: No .gitignore found"
}
Write-Host ""

# Stage all files
Write-Host "Step 4: Staging all files..."
git add .
Write-Host "SUCCESS: Files staged"
Write-Host ""

# Show what will be committed
Write-Host "Files to be committed:"
git status --short
Write-Host ""

# Create commit
Write-Host "Step 5: Creating initial commit..."
git commit -m "Initial commit: SpecChem Safety LMS v2"
Write-Host "SUCCESS: Initial commit created"
Write-Host ""

# Show commit
Write-Host "Commit created:"
git log --oneline -1
Write-Host ""

Write-Host "================================================"
Write-Host "   Git Setup Complete!"
Write-Host "================================================"
Write-Host ""
Write-Host "NEXT STEPS:"
Write-Host ""
Write-Host "1. Create GitHub repository:"
Write-Host "   -> Go to: https://github.com/new"
Write-Host "   -> Name: specchem-safety-lms-v2"
Write-Host "   -> Private: YES"
Write-Host "   -> Do NOT initialize with README"
Write-Host "   -> Click Create repository"
Write-Host ""
Write-Host "2. Then run these commands:"
Write-Host ""
Write-Host "   git remote add origin https://github.com/Josh-SpecChem/specchem-safety-lms-v2.git"
Write-Host "   git branch -M main"
Write-Host "   git push -u origin main"
Write-Host ""
Write-Host "3. Deploy to Vercel:"
Write-Host "   -> See QUICK_START.md Step 5"
Write-Host ""

$open = Read-Host "Press Enter to open GitHub (or type 'no' to skip)"
if ($open -ne "no") {
    Start-Process "https://github.com/new"
}


