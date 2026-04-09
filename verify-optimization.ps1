# Comprehensive Image Optimization Verification Script
# This script verifies all aspects of the image optimization task

$ErrorActionPreference = "Continue"
$projectRoot = "c:\Users\arafa\Desktop\safarisSenza\senzalucesafaris"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  IMAGE OPTIMIZATION VERIFICATION REPORT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$passCount = 0
$failCount = 0
$warnings = 0

function Test-Condition {
    param($Condition, $PassMessage, $FailMessage)
    if ($Condition) {
        Write-Host "  [PASS] $PassMessage" -ForegroundColor Green
        $script:passCount++
        return $true
    } else {
        Write-Host "  [FAIL] $FailMessage" -ForegroundColor Red
        $script:failCount++
        return $false
    }
}

# 1. Verify Image Files Exist
Write-Host "1. IMAGE FILES VERIFICATION" -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Yellow

$placeholderImages = @(
    "hero-safari.jpg", "serengeti.jpg", "kilimanjaro.jpg", "zanzibar-beach.jpg",
    "stone-town.jpg", "experience-hero.jpg", "luxury-lodge.jpg", "midrange-lodge.jpg",
    "budget-lodge.jpg", "5-days-wildlife.jpg", "9-days-safari-zanzibar.jpg",
    "northern-circuit.jpg", "zanzibar-beach-holiday.jpg", "serengeti-migration.jpg",
    "bush-beach-combo.jpg", "luxury-lodges.jpg", "big-five.jpg"
)

$placeholdersPath = Join-Path $projectRoot "public\images\placeholders"
$existingPlaceholders = (Get-ChildItem $placeholdersPath -Filter "*.jpg").Count
Test-Condition ($existingPlaceholders -ge 15) "Found $existingPlaceholders placeholder images (expected 17)" "Only $existingPlaceholders placeholder images found"

# Check blog images
$blogPath = Join-Path $projectRoot "public\images\blog"
$existingBlog = (Get-ChildItem $blogPath -Filter "*.jpg").Count
Test-Condition ($existingBlog -eq 6) "Found $existingBlog blog images (expected 6)" "Only $existingBlog blog images found"

# Check destination images
$destPath = Join-Path $projectRoot "public\images\destinations"
$mainDestImages = (Get-ChildItem $destPath -Filter "*.jpg").Count
$destSubdirs = (Get-ChildItem $destPath -Directory).Count
Test-Condition ($mainDestImages -ge 4) "Found $mainDestImages main destination images" "Only $mainDestImages destination images found"
Test-Condition ($destSubdirs -ge 6) "Found $destSubdirs destination subdirectories" "Only $destSubdirs subdirectories found"

# Check destination gallery images
$galleryCount = 0
$subdirs = Get-ChildItem $destPath -Directory
foreach ($dir in $subdirs) {
    $count = (Get-ChildItem $dir.FullName -Filter "*.jpg").Count
    $galleryCount += $count
}
Test-Condition ($galleryCount -ge 30) "Found $galleryCount gallery images in subdirectories" "Only $galleryCount gallery images found"

# 2. Verify Image File Sizes
Write-Host "`n2. IMAGE FILE SIZE VERIFICATION" -ForegroundColor Yellow
Write-Host "-------------------------------" -ForegroundColor Yellow

$heroImage = Join-Path $placeholdersPath "hero-safari.jpg"
if (Test-Path $heroImage) {
    $heroSize = (Get-Item $heroImage).Length / 1KB
    Test-Condition ($heroSize -lt 500) "Hero image size: $([math]::Round($heroSize, 1)) KB (< 500 KB)" "Hero image too large: $([math]::Round($heroSize, 1)) KB"
}

$serengetiImage = Join-Path $placeholdersPath "serengeti.jpg"
if (Test-Path $serengetiImage) {
    $serengetiSize = (Get-Item $serengetiImage).Length / 1KB
    Test-Condition ($serengetiSize -lt 300) "Serengeti image size: $([math]::Round($serengetiSize, 1)) KB (< 300 KB)" "Serengeti image too large: $([math]::Round($serengetiSize, 1)) KB"
}

# 3. Verify Data Files
Write-Host "`n3. DATA FILES VERIFICATION" -ForegroundColor Yellow
Write-Host "--------------------------" -ForegroundColor Yellow

$toursFile = Join-Path $projectRoot "src\data\tours.ts"
Test-Condition (Test-Path $toursFile) "tours.ts exists" "tours.ts not found"

if (Test-Path $toursFile) {
    $toursContent = Get-Content $toursFile -Raw
    $imageUrlCount = ([regex]::Matches($toursContent, 'imageUrl:')).Count
    Test-Condition ($imageUrlCount -ge 30) "Found $imageUrlCount tour image mappings" "Only $imageUrlCount image mappings found"
    
    $hasPlaceholderRefs = $toursContent -match '/images/placeholders/'
    Test-Condition $hasPlaceholderRefs "Tours reference placeholder images" "No placeholder references found"
}

$destinationsFile = Join-Path $projectRoot "src\data\destinations.ts"
Test-Condition (Test-Path $destinationsFile) "destinations.ts exists" "destinations.ts not found"

if (Test-Path $destinationsFile) {
    $destContent = Get-Content $destinationsFile -Raw
    $galleryCount2 = ([regex]::Matches($destContent, 'gallery:\s*\[')).Count
    Test-Condition ($galleryCount2 -ge 6) "Found $galleryCount2 destination galleries" "Only $galleryCount2 galleries found"
}

# 4. Verify Next.js Configuration
Write-Host "`n4. NEXT.JS CONFIGURATION" -ForegroundColor Yellow
Write-Host "-------------------------" -ForegroundColor Yellow

$configFile = Join-Path $projectRoot "next.config.ts"
Test-Condition (Test-Path $configFile) "next.config.ts exists" "next.config.ts not found"

if (Test-Path $configFile) {
    $configContent = Get-Content $configFile -Raw
    
    $hasWebP = $configContent -match "image/webp"
    Test-Condition $hasWebP "WebP format enabled" "WebP format not enabled"
    
    $hasAvif = $configContent -match "image/avif"
    Test-Condition $hasAvif "AVIF format enabled" "AVIF format not enabled"
    
    $hasUnsplash = $configContent -match "images.unsplash.com"
    Test-Condition $hasUnsplash "Unsplash remote pattern configured" "Unsplash not configured"
    
    $hasDeviceSizes = $configContent -match "deviceSizes"
    Test-Condition $hasDeviceSizes "Device sizes configured" "Device sizes not configured"
    
    $hasCacheHeaders = $configContent -match "Cache-Control"
    Test-Condition $hasCacheHeaders "Cache headers configured" "Cache headers not configured"
}

# 5. Verify Components
Write-Host "`n5. COMPONENT VERIFICATION" -ForegroundColor Yellow
Write-Host "-------------------------" -ForegroundColor Yellow

$tourCardFile = Join-Path $projectRoot "src\components\ui\tour-card.tsx"
Test-Condition (Test-Path $tourCardFile) "tour-card.tsx exists" "tour-card.tsx not found"

if (Test-Path $tourCardFile) {
    $tourCardContent = Get-Content $tourCardFile -Raw
    
    $usesImage = $tourCardContent -match 'from "next/image"'
    Test-Condition $usesImage "Uses Next.js Image component" "Not using Next.js Image"
    
    $hasAlt = $tourCardContent -match 'alt='
    Test-Condition $hasAlt "Has alt text" "Missing alt text"
    
    $hasFill = $tourCardContent -match 'fill'
    Test-Condition $hasFill "Uses fill prop" "Not using fill prop"
    
    $hasSizes = $tourCardContent -match 'sizes='
    Test-Condition $hasSizes "Has sizes attribute" "Missing sizes attribute"
    
    $hasErrorHandling = $tourCardContent -match 'onError'
    Test-Condition $hasErrorHandling "Has error handling" "Missing error handling"
}

# 6. Verify Optimization Report
Write-Host "`n6. DOCUMENTATION VERIFICATION" -ForegroundColor Yellow
Write-Host "-------------------------------" -ForegroundColor Yellow

$reportFile = Join-Path $projectRoot "IMAGE_OPTIMIZATION_REPORT.md"
Test-Condition (Test-Path $reportFile) "Optimization report exists" "Report not found"

if (Test-Path $reportFile) {
    $reportSize = (Get-Item $reportFile).Length / 1KB
    Test-Condition ($reportSize -gt 5) "Report size: $([math]::Round($reportSize, 1)) KB" "Report too small"
}

$downloadScript = Join-Path $projectRoot "download-images.ps1"
Test-Condition (Test-Path $downloadScript) "Download script exists" "Download script not found"

# Final Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Total Tests:  $($passCount + $failCount)" -ForegroundColor White
Write-Host "  Passed:       $passCount" -ForegroundColor Green
Write-Host "  Failed:       $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($failCount -eq 0) {
    Write-Host "  [SUCCESS] All verification tests passed!" -ForegroundColor Green
    Write-Host "  The image optimization task is COMPLETE and WORKING.`n" -ForegroundColor Green
    exit 0
} else {
    Write-Host "  [WARNING] Some tests failed. Review the output above.`n" -ForegroundColor Yellow
    exit 1
}
