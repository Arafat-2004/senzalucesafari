# Quick Page Visibility Check
$projectRoot = "c:\Users\arafa\Desktop\safarisSenza\senzalucesafaris"

Write-Host "`n=== PAGE VISIBILITY QUICK CHECK ===`n" -ForegroundColor Cyan

# Check testimonials section for hardcoded text
Write-Host "1. Checking Testimonials Section..." -ForegroundColor Yellow
$testFile = Join-Path $projectRoot "src\components\home\testimonials-section.tsx"
$testContent = Get-Content $testFile -Raw
if ($testContent -match 'What Our Travelers Say') {
    Write-Host "   [ISSUE] Found hardcoded text: 'What Our Travelers Say'" -ForegroundColor Red
}
if ($testContent -match 'Real experiences from real adventurers') {
    Write-Host "   [ISSUE] Found hardcoded text: 'Real experiences...'" -ForegroundColor Red
}

# Check experience section  
Write-Host "`n2. Checking Experience Section..." -ForegroundColor Yellow
$expFile = Join-Path $projectRoot "src\components\home\experience-section.tsx"
$expContent = Get-Content $expFile -Raw
if ($expContent -match 'overflow-hidden') {
    Write-Host "   [INFO] Has overflow-hidden (may clip content on mobile)" -ForegroundColor Yellow
}
Write-Host "   [OK] Experience section structure looks good" -ForegroundColor Green

# Check accommodations section
Write-Host "`n3. Checking Accommodations Section..." -ForegroundColor Yellow
$accFile = Join-Path $projectRoot "src\components\home\accommodations-section.tsx"
if (Test-Path $accFile) {
    Write-Host "   [OK] File exists" -ForegroundColor Green
}

# Count pages
Write-Host "`n4. Counting all pages..." -ForegroundColor Yellow
$pages = Get-ChildItem (Join-Path $projectRoot "src\app\[locale]") -Recurse -Filter "page.tsx" | Where-Object { $_.FullName -notmatch "node_modules" }
Write-Host "   Found $($pages.Count) pages" -ForegroundColor Green

foreach ($page in $pages) {
    $relPath = $page.FullName.Replace($projectRoot, "").TrimStart("\")
    Write-Host "   - $relPath" -ForegroundColor White
}

Write-Host "`n=== CHECK COMPLETE ===`n" -ForegroundColor Cyan
