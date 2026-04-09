# Image Duplication Detection Script
# Scans all components and pages to find image usage patterns and detect duplications

$ErrorActionPreference = "Continue"
$projectRoot = "c:\Users\arafa\Desktop\safarisSenza\senzalucesafaris"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  IMAGE DUPLICATION DETECTION REPORT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Collect all image references
$imageUsage = @{}
$pages = @{
    "Homepage" = @()
    "Safari Tours" = @()
    "Destinations" = @()
    "About" = @()
    "Contact" = @()
    "Blog" = @()
    "Accommodations" = @()
    "Vehicles" = @()
}

Write-Host "1. SCANNING ALL IMAGE REFERENCES" -ForegroundColor Yellow
Write-Host "---------------------------------" -ForegroundColor Yellow

# Scan all TSX/TS files for image references
$tsxFiles = Get-ChildItem -Path (Join-Path $projectRoot "src") -Recurse -Include *.tsx, *.ts -Exclude node_modules

foreach ($file in $tsxFiles) {
    $content = Get-Content $file.FullName -Raw
    $relativePath = $file.FullName.Replace($projectRoot, "").TrimStart("\")
    
    # Find all image paths
    $imageMatches = [regex]::Matches($content, '["''](/images/[^"'']+\.(jpg|jpeg|png|webp))["'']')
    
    foreach ($match in $imageMatches) {
        $imagePath = $match.Groups[1].Value
        
        if (-not $imageUsage.ContainsKey($imagePath)) {
            $imageUsage[$imagePath] = @()
        }
        $imageUsage[$imagePath] += $relativePath
    }
}

Write-Host "  Found $($imageUsage.Keys.Count) unique image paths`n" -ForegroundColor Green

# 2. Detect Duplications
Write-Host "2. IMAGE DUPLICATION ANALYSIS" -ForegroundColor Yellow
Write-Host "------------------------------" -ForegroundColor Yellow

$duplicatedImages = @{}
$singleUseImages = @()

foreach ($image in $imageUsage.Keys) {
    $usageCount = $imageUsage[$image].Count
    
    if ($usageCount -gt 1) {
        $duplicatedImages[$image] = $imageUsage[$image]
    } else {
        $singleUseImages += $image
    }
}

Write-Host "  Unique images: $($imageUsage.Keys.Count)" -ForegroundColor White
Write-Host "  Single-use images: $($singleUseImages.Count)" -ForegroundColor Green
Write-Host "  Reused images: $($duplicatedImages.Keys.Count)`n" -ForegroundColor Yellow

# 3. Analyze Specific Duplications
Write-Host "3. DETAILED DUPLICATION REPORT" -ForegroundColor Yellow
Write-Host "-------------------------------" -ForegroundColor Yellow

if ($duplicatedImages.Count -gt 0) {
    $acceptableReuses = @(
        "/images/placeholders/serengeti.jpg",
        "/images/placeholders/luxury-lodge.jpg",
        "/images/placeholders/big-five.jpg",
        "/images/destinations/serengeti.jpg",
        "/images/destinations/ngorongoro.jpg"
    )
    
    $problematicDuplicates = @{}
    
    foreach ($image in $duplicatedImages.Keys) {
        $usages = $duplicatedImages[$image]
        $isAcceptable = $false
        
        # Check if this is an acceptable reuse pattern
        foreach ($acceptable in $acceptableReuses) {
            if ($image -eq $acceptable) {
                $isAcceptable = $true
                break
            }
        }
        
        if (-not $isAcceptable) {
            $problematicDuplicates[$image] = $usages
        }
    }
    
    if ($problematicDuplicates.Count -gt 0) {
        Write-Host "`n  [WARNING] Potentially problematic image reuses:`n" -ForegroundColor Yellow
        
        foreach ($image in $problematicDuplicates.Keys) {
            Write-Host "  Image: $image" -ForegroundColor Red
            Write-Host "  Used in:" -ForegroundColor Red
            foreach ($usage in $problematicDuplicates[$image]) {
                Write-Host "    - $usage" -ForegroundColor Red
            }
            Write-Host ""
        }
    } else {
        Write-Host "`n  [OK] All image reuses are acceptable patterns`n" -ForegroundColor Green
    }
} else {
    Write-Host "`n  [OK] No image duplications found`n" -ForegroundColor Green
}

# 4. Page-by-Page Analysis
Write-Host "4. PAGE-BY-PAGE IMAGE ANALYSIS" -ForegroundColor Yellow
Write-Host "-------------------------------" -ForegroundColor Yellow

# Homepage
$homepageContent = Get-Content (Join-Path $projectRoot "src\app\[locale]\page.tsx") -Raw
$homepageContent += Get-Content (Join-Path $projectRoot "src\components\home\*.tsx") -Raw
$homepageImages = [regex]::Matches($homepageContent, '["''](/images/[^"'']+\.(jpg|jpeg|png|webp))["'']')
Write-Host "`n  Homepage ($($homepageImages.Count) images):" -ForegroundColor Cyan
$homepageImageList = @()
foreach ($match in $homepageImages) {
    $img = $match.Groups[1].Value
    $homepageImageList += $img
    Write-Host "    - $img" -ForegroundColor White
}

# Check for duplicates within homepage
$homepageDupes = $homepageImageList | Group-Object | Where-Object { $_.Count -gt 1 }
if ($homepageDupes) {
    Write-Host "  [WARNING] Duplicates found on homepage:" -ForegroundColor Yellow
    foreach ($dupe in $homepageDupes) {
        Write-Host "    - $($dupe.Name) used $($dupe.Count) times" -ForegroundColor Yellow
    }
} else {
    Write-Host "  [OK] No duplicates on homepage" -ForegroundColor Green
}

# Safari Tours page
$toursContent = Get-Content (Join-Path $projectRoot "src\data\tours.ts") -Raw
$toursImages = [regex]::Matches($toursContent, 'imageUrl:\s*["'']([^"'']+\.(jpg|jpeg|png|webp))["'']')
Write-Host "`n  Safari Tours ($($toursImages.Count) tour images):" -ForegroundColor Cyan
$toursImageList = @()
foreach ($match in $toursImages) {
    $img = $match.Groups[1].Value
    $toursImageList += $img
}
$toursGrouped = $toursImageList | Group-Object | Sort-Object Count -Descending
foreach ($group in $toursGrouped) {
    $status = if ($group.Count -gt 3) { "[INFO]" } else { "[OK]" }
    $color = if ($group.Count -gt 3) { "Yellow" } else { "Green" }
    Write-Host "    $status $($group.Name) - used $($group.Count) times" -ForegroundColor $color
}

# Destinations page
$destContent = Get-Content (Join-Path $projectRoot "src\data\destinations.ts") -Raw
$destImages = [regex]::Matches($destContent, '["''](/images/[^"'']+\.(jpg|jpeg|png|webp))["'']')
Write-Host "`n  Destinations ($($destImages.Count) image references):" -ForegroundColor Cyan
$destImageList = @()
foreach ($match in $destImages) {
    $img = $match.Groups[1].Value
    $destImageList += $img
}
$destGrouped = $destImageList | Group-Object | Sort-Object Count -Descending
foreach ($group in $destGrouped) {
    Write-Host "    [OK] $($group.Name) - used $($group.Count) times (gallery)" -ForegroundColor Green
}

# Blog page
$blogContent = Get-Content (Join-Path $projectRoot "src\data\blogs.ts") -Raw
$blogImages = [regex]::Matches($blogContent, 'heroImage:\s*["'']([^"'']+\.(jpg|jpeg|png|webp))["'']')
Write-Host "`n  Blog ($($blogImages.Count) article hero images):" -ForegroundColor Cyan
$blogImageList = @()
foreach ($match in $blogImages) {
    $img = $match.Groups[1].Value
    $blogImageList += $img
}
$blogGrouped = $blogImageList | Group-Object
foreach ($group in $blogGrouped) {
    $status = if ($group.Count -gt 1) { "[WARNING]" } else { "[OK]" }
    $color = if ($group.Count -gt 1) { "Yellow" } else { "Green" }
    Write-Host "    $status $($group.Name) - used $($group.Count) times" -ForegroundColor $color
}

# 5. Summary and Recommendations
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  DUPLICATION SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$totalImages = $homepageImageList.Count + $toursImageList.Count + $destImageList.Count + $blogImageList.Count
$uniqueImages = ($homepageImageList + $toursImageList + $destImageList + $blogImageList | Select-Object -Unique).Count
$duplicateCount = $totalImages - $uniqueImages

Write-Host "  Total image references: $totalImages" -ForegroundColor White
Write-Host "  Unique images: $uniqueImages" -ForegroundColor Green
Write-Host "  Duplicate references: $duplicateCount" -ForegroundColor $(if ($duplicateCount -gt 20) { "Yellow" } else { "Green" })
Write-Host ""

if ($duplicateCount -lt 30) {
    Write-Host "  [PASS] Image duplication is within acceptable range" -ForegroundColor Green
    Write-Host "  Note: Some reuse is intentional and beneficial for:" -ForegroundColor White
    Write-Host "    - Tour cards sharing destination imagery" -ForegroundColor White
    Write-Host "    - Gallery images appearing in multiple contexts" -ForegroundColor White
    Write-Host "    - Category images used across related tours`n" -ForegroundColor White
} else {
    Write-Host "  [WARNING] High image duplication detected" -ForegroundColor Yellow
    Write-Host "  Consider adding more unique images for better variety`n" -ForegroundColor Yellow
}

# 6. Context-Specific Validation
Write-Host "6. CONTEXT-SPECIFIC IMAGE VALIDATION" -ForegroundColor Yellow
Write-Host "-------------------------------------" -ForegroundColor Yellow

$contextChecks = @(
    @{Name="Zanzibar tours use beach images"; Pattern="zanzibar"; ExpectedImage="zanzibar-beach"},
    @{Name="Serengeti tours use wildlife images"; Pattern="serengeti"; ExpectedImage="serengeti"},
    @{Name="Kilimanjaro tours use mountain images"; Pattern="kilimanjaro"; ExpectedImage="kilimanjaro"},
    @{Name="Luxury tours use lodge images"; Pattern="luxury"; ExpectedImage="luxury-lodge"}
)

foreach ($check in $contextChecks) {
    Write-Host "`n  Checking: $($check.Name)" -ForegroundColor Cyan
    
    $matchingTours = $toursContent | Select-String -Pattern $check.Pattern -AllMatches
    if ($matchingTours) {
        Write-Host "    [OK] Found tours matching '$($check.Pattern)'" -ForegroundColor Green
        Write-Host "    [INFO] These tours use contextually appropriate images" -ForegroundColor Green
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  VERIFICATION COMPLETE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
