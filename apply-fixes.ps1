# SENZA LUCE SAFARIS - COMPREHENSIVE FIX SCRIPT
# Run this script in PowerShell to identify and fix critical issues

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Senza Luce Safaris - Fix Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "c:\Users\arafa\Desktop\safarisSenzaz\senzalucesafaris"
Set-Location $projectPath

# 1. Check npm vulnerabilities
Write-Host "[1/7] Checking npm vulnerabilities..." -ForegroundColor Yellow
npm audit --json 2>$null | ConvertFrom-Json | Select-Object -ExpandProperty metadata | Format-List
Write-Host ""

# 2. Fix vulnerabilities automatically
Write-Host "[2/7] Fixing npm vulnerabilities..." -ForegroundColor Yellow
npm audit fix
Write-Host ""

# 3. Run ESLint
Write-Host "[3/7] Running ESLint..." -ForegroundColor Yellow
npx eslint src --format stylish 2>&1 | Select-String "problem|error|warning" | Select-Object -First 20
Write-Host ""

# 4. Check TypeScript
Write-Host "[4/7] Checking TypeScript compilation..." -ForegroundColor Yellow
npx tsc --noEmit 2>&1 | Select-String "error" | Select-Object -First 15
Write-Host ""

# 5. Check for console statements
Write-Host "[5/7] Finding console statements in production code..." -ForegroundColor Yellow
$consoleCount = (Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx | Select-String "console\.(log|warn|error)" | Measure-Object).Count
Write-Host "Found $consoleCount console statements that should be removed/replaced" -ForegroundColor $(if ($consoleCount -gt 0) {"Red"} else {"Green"})
Write-Host ""

# 6. Check missing API routes
Write-Host "[6/7] Checking for missing API routes..." -ForegroundColor Yellow
$requiredRoutes = @("bookings", "enquiries", "reviews", "contact")
foreach ($route in $requiredRoutes) {
    $path = "src\app\api\$route"
    if (Test-Path $path) {
        Write-Host "  ✓ $route API route exists" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $route API route MISSING" -ForegroundColor Red
    }
}
Write-Host ""

# 7. Check PWA files
Write-Host "[7/7] Checking PWA configuration..." -ForegroundColor Yellow
$manifestExists = Test-Path "public\manifest.json"
$swExists = Test-Path "public\sw.js"
$iconExists = Test-Path "public\icons\icon-512x512.png"

Write-Host "  manifest.json: $(if ($manifestExists) {'✓'} else {'✗ MISSING'})" -ForegroundColor $(if ($manifestExists) {"Green"} else {"Red"})
Write-Host "  sw.js: $(if ($swExists) {'✓'} else {'✗ MISSING'})" -ForegroundColor $(if ($swExists) {"Green"} else {"Red"})
Write-Host "  icon-512x512.png: $(if ($iconExists) {'✓'} else {'✗ MISSING'})" -ForegroundColor $(if ($iconExists) {"Green"} else {"Red"})
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary of Required Actions:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Copy mcp-fixed.json to MCP config location:" -ForegroundColor Yellow
Write-Host "   Copy-Item mcp-fixed.json `$env:APPDATA\Qoder\SharedClientCache\mcp.json -Force" -ForegroundColor White
Write-Host ""
Write-Host "2. Set environment variables for MCP:" -ForegroundColor Yellow
Write-Host "   `$env:GITHUB_TOKEN = 'your_token_here'" -ForegroundColor White
Write-Host "   `$env:FIGMA_API_KEY = 'your_key_here'" -ForegroundColor White
Write-Host ""
Write-Host "3. Create missing API routes (bookings, enquiries, reviews)" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Add security headers to next.config.ts (see CRITICAL_FIXES_NEEDED.md)" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Remove console.log statements from production code" -ForegroundColor Yellow
Write-Host ""
Write-Host "Full details in: CRITICAL_FIXES_NEEDED.md" -ForegroundColor Cyan
Write-Host ""
