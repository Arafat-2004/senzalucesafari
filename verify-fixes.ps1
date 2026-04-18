# QUICK VERIFICATION SCRIPT
# Run this to verify the fixes were applied correctly

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verifying Fixes..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location c:\Users\arafa\Desktop\safarisSenzaz\senzalucesafaris

# 1. Verify ESLint error is fixed
Write-Host "[1/2] Checking ESLint..." -ForegroundColor Yellow
$eslintResult = npx eslint src/app/global-error.tsx --format stylish 2>&1
if ($eslintResult -match "0 problems") {
    Write-Host "  ✓ ESLint error FIXED" -ForegroundColor Green
} else {
    Write-Host "  ✗ ESLint still has issues:" -ForegroundColor Red
    $eslintResult | Select-String "error|warning"
}
Write-Host ""

# 2. Verify TypeScript error is fixed
Write-Host "[2/2] Checking TypeScript..." -ForegroundColor Yellow
$tscResult = npx tsc --noEmit 2>&1
if ($tscResult -match "error") {
    Write-Host "  ✗ TypeScript still has errors:" -ForegroundColor Red
    $tscResult | Select-String "error" | Select-Object -First 5
} else {
    Write-Host "  ✓ TypeScript compilation SUCCESSFUL" -ForegroundColor Green
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verification Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
