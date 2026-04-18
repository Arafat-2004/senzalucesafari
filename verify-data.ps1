# PowerShell Script to Verify Supabase Data
# Senza Luce Safaris - Data Verification

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SENZA LUCE SAFARIS" -ForegroundColor Cyan
Write-Host "  Supabase Data Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is available
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host "✅ Environment file found" -ForegroundColor Green
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "✅ Node modules found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Node modules not found. Running npm install..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "Starting verification..." -ForegroundColor Cyan
Write-Host ""

# Run the verification script
node verify-supabase-data.js

# Check exit code
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Verification Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  Verification Failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
