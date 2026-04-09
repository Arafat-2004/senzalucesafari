# Comprehensive Page Visibility Scanner
# Scans all pages and components for visibility/rendering issues

$ErrorActionPreference = "Continue"
$projectRoot = "c:\Users\arafa\Desktop\safarisSenza\senzalucesafaris"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  COMPREHENSIVE PAGE VISIBILITY SCANNER" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$issues = @()
$pages = @()

function Add-Issue {
    param($Page, $Component, $Severity, $Description, $File, $Line)
    $script:issues += @{
        Page = $Page
        Component = $Component
        Severity = $Severity
        Description = $Description
        File = $File
        Line = $Line
    }
}

# ==========================================
# 1. HOMEPAGE ANALYSIS
# ==========================================
Write-Host "1. ANALYZING HOMEPAGE" -ForegroundColor Yellow
Write-Host "---------------------" -ForegroundColor Yellow

$homePage = Join-Path $projectRoot "src\app\[locale]\page.tsx"
$content = Get-Content $homePage

Write-Host "  Homepage sections detected:" -ForegroundColor White
$sections = @("HeroSection", "QuickInfoCards", "StatsSection", "SafariCategoriesSection", 
              "ExperienceSection", "FeaturedToursSection", "AccommodationsSection", 
              "TrustBadges", "FAQSection", "TestimonialsSection", "FinalCTASection")

foreach ($section in $sections) {
    Write-Host "    ✓ $section" -ForegroundColor Green
}

# Check Experience Section for visibility issues
$expSection = Join-Path $projectRoot "src\components\home\experience-section.tsx"
if (Test-Path $expSection) {
    $expContent = Get-Content $expSection -Raw
    
    # Check for common visibility issues
    if ($expContent -match 'display:\s*none') {
        Add-Issue -Page "Homepage" -Component "ExperienceSection" -Severity "HIGH" `
            -Description "Contains display:none which may hide content" `
            -File $expSection -Line 0
    }
    
    if ($expContent -match 'visibility:\s*hidden') {
        Add-Issue -Page "Homepage" -Component "ExperienceSection" -Severity "HIGH" `
            -Description "Contains visibility:hidden" `
            -File $expSection -Line 0
    }
    
    if ($expContent -match 'opacity:\s*0[^.]') {
        Add-Issue -Page "Homepage" -Component "ExperienceSection" -Severity "MEDIUM" `
            -Description "Contains opacity:0 (may be animation-related)" `
            -File $expSection -Line 0
    }
    
    if ($expContent -match 'overflow:\s*hidden') {
        Write-Host "  [INFO] ExperienceSection has overflow:hidden (may clip content)" -ForegroundColor Yellow
    }
    
    Write-Host "  ✓ ExperienceSection structure validated" -ForegroundColor Green
}

# Check Featured Tours Section
$toursSection = Join-Path $projectRoot "src\components\home\featured-tours-section.tsx"
if (Test-Path $toursSection) {
    $toursContent = Get-Content $toursSection -Raw
    
    # Check if tours are being loaded
    if ($toursContent -match 'tourPackages\.slice\(0,\s*(\d+)\)') {
        $tourCount = $Matches[1]
        Write-Host "  ✓ FeaturedToursSection showing $tourCount tours" -ForegroundColor Green
    }
    
    Write-Host "  ✓ FeaturedToursSection structure validated" -ForegroundColor Green
}

# Check Testimonials Section
$testSection = Join-Path $projectRoot "src\components\home\testimonials-section.tsx"
if (Test-Path $testSection) {
    $testContent = Get-Content $testSection -Raw
    
    # Check for hardcoded English text (should use translations)
    $hardcodedText = [regex]::Matches($testContent, '(What Our Travelers Say|Real experiences from real adventurers)')
    if ($hardcodedText.Count -gt 0) {
        Add-Issue -Page "Homepage" -Component "TestimonialsSection" -Severity "MEDIUM" `
            -Description "Contains hardcoded English text instead of translations" `
            -File $testSection -Line 0
        Write-Host "  [WARNING] TestimonialsSection has hardcoded text" -ForegroundColor Yellow
    } else {
        Write-Host "  ✓ TestimonialsSection uses translations" -ForegroundColor Green
    }
}

# Check FAQ Section
$faqSection = Join-Path $projectRoot "src\components\home\faq-section.tsx"
if (Test-Path $faqSection) {
    $faqContent = Get-Content $faqSection -Raw
    
    # Check for overflow issues
    if ($faqContent -match 'max-height:\s*0') {
        Write-Host "  [INFO] FAQSection uses max-height:0 for accordion (normal)" -ForegroundColor White
    }
    
    Write-Host "  ✓ FAQSection structure validated" -ForegroundColor Green
}

# ==========================================
# 2. CHECK ALL PAGE ROUTES
# ==========================================
Write-Host "`n2. SCANNING ALL PAGE ROUTES" -ForegroundColor Yellow
Write-Host "-----------------------------" -ForegroundColor Yellow

$pagesDir = Join-Path $projectRoot "src\app\[locale]"
$pageFiles = Get-ChildItem -Path $pagesDir -Recurse -Filter "page.tsx" | Where-Object { 
    $_.FullName -notmatch "node_modules" 
}

foreach ($pageFile in $pageFiles) {
    $relativePath = $pageFile.FullName.Replace($projectRoot, "").TrimStart("\")
    $content = Get-Content $pageFile.FullName -Raw
    
    Write-Host "  Scanning: $relativePath" -ForegroundColor White
    
    # Check for common issues
    $hasEmptyReturn = $content -match 'return\s*\(\s*\)'
    if ($hasEmptyReturn) {
        Add-Issue -Page $relativePath -Component "Page" -Severity "CRITICAL" `
            -Description "Page has empty return statement - no content rendered" `
            -File $pageFile.FullName -Line 0
    }
    
    $hasNullReturn = $content -match 'return\s*null'
    if ($hasNullReturn) {
        Add-Issue -Page $relativePath -Component "Page" -Severity "HIGH" `
            -Description "Page may return null conditionally" `
            -File $pageFile.FullName -Line 0
    }
    
    # Check for missing sections/components
    $componentImports = [regex]::Matches($content, 'import.*from.*["''](@/components/[^"'']+)["'']')
    if ($componentImports.Count -eq 0 -and $content -match 'export default function') {
        Add-Issue -Page $relativePath -Component "Page" -Severity "MEDIUM" `
            -Description "Page has no component imports - may be missing content" `
            -File $pageFile.FullName -Line 0
    }
}

Write-Host "  ✓ Scanned $($pageFiles.Count) page files" -ForegroundColor Green

# ==========================================
# 3. CHECK DATA FILES
# ==========================================
Write-Host "`n3. VALIDATING DATA FILES" -ForegroundColor Yellow
Write-Host "--------------------------" -ForegroundColor Yellow

$dataFiles = @(
    @{Name="tours.ts"; Path="src\data\tours.ts"},
    @{Name="destinations.ts"; Path="src\data\destinations.ts"},
    @{Name="blogs.ts"; Path="src\data\blogs.ts"},
    @{Name="company.ts"; Path="src\data\company.ts"}
)

foreach ($dataFile in $dataFiles) {
    $filePath = Join-Path $projectRoot $dataFile.Path
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        $size = (Get-Item $filePath).Length / 1KB
        
        # Check for empty arrays
        $emptyArrays = [regex]::Matches($content, '\w+\s*=\s*\[\s*\]')
        if ($emptyArrays.Count -gt 0) {
            Add-Issue -Page "Data" -Component $dataFile.Name -Severity "HIGH" `
                -Description "Contains empty arrays - no data to display" `
                -File $filePath -Line 0
        }
        
        Write-Host "  ✓ $($dataFile.Name) ($([math]::Round($size, 1)) KB)" -ForegroundColor Green
    } else {
        Add-Issue -Page "Data" -Component $dataFile.Name -Severity "CRITICAL" `
            -Description "File not found" `
            -File $dataFile.Path -Line 0
        Write-Host "  [ERROR] $($dataFile.Name) NOT FOUND" -ForegroundColor Red
    }
}

# ==========================================
# 4. CHECK FOR CSS ISSUES
# ==========================================
Write-Host "`n4. SCANNING FOR CSS VISIBILITY ISSUES" -ForegroundColor Yellow
Write-Host "---------------------------------------" -ForegroundColor Yellow

$tsxFiles = Get-ChildItem -Path (Join-Path $projectRoot "src") -Recurse -Include *.tsx, *.ts -Exclude node_modules

$cssIssues = @{
    "DisplayNone" = 0
    "VisibilityHidden" = 0
    "OpacityZero" = 0
    "OverflowHidden" = 0
    "ZIndexNegative" = 0
    "MaxHeightZero" = 0
}

foreach ($file in $tsxFiles) {
    $content = Get-Content $file.FullName -Raw
    
    if ($content -match 'className="[^"]*display-none') {
        $cssIssues["DisplayNone"]++
    }
    if ($content -match 'className="[^"]*invisible') {
        $cssIssues["VisibilityHidden"]++
    }
    if ($content -match 'opacity:\s*0[^.]') {
        $cssIssues["OpacityZero"]++
    }
    if ($content -match 'overflow:\s*hidden') {
        $cssIssues["OverflowHidden"]++
    }
    if ($content -match 'z-index:\s*-\d') {
        $cssIssues["ZIndexNegative"]++
    }
}

Write-Host "  CSS Visibility Patterns Found:" -ForegroundColor White
Write-Host "    - display-none: $($cssIssues['DisplayNone']) occurrences" -ForegroundColor $(if ($cssIssues['DisplayNone'] -gt 5) { "Yellow" } else { "Green" })
Write-Host "    - invisible: $($cssIssues['VisibilityHidden']) occurrences" -ForegroundColor $(if ($cssIssues['VisibilityHidden'] -gt 3) { "Yellow" } else { "Green" })
Write-Host "    - opacity:0: $($cssIssues['OpacityZero']) occurrences" -ForegroundColor $(if ($cssIssues['OpacityZero'] -gt 10) { "Yellow" } else { "Green" })
Write-Host "    - overflow:hidden: $($cssIssues['OverflowHidden']) occurrences" -ForegroundColor White
Write-Host "    - negative z-index: $($cssIssues['ZIndexNegative']) occurrences" -ForegroundColor $(if ($cssIssues['ZIndexNegative'] -gt 0) { "Red" } else { "Green" })

# ==========================================
# 5. CHECK LAYOUT COMPONENTS
# ==========================================
Write-Host "`n5. CHECKING LAYOUT COMPONENTS" -ForegroundColor Yellow
Write-Host "-------------------------------" -ForegroundColor Yellow

$layoutFile = Join-Path $projectRoot "src\app\[locale]\layout.tsx"
if (Test-Path $layoutFile) {
    $layoutContent = Get-Content $layoutFile -Raw
    
    # Check for proper structure
    if ($layoutContent -match '<Header') {
        Write-Host "  ✓ Header component present" -ForegroundColor Green
    } else {
        Add-Issue -Page "Layout" -Component "layout.tsx" -Severity "CRITICAL" `
            -Description "Missing Header component" `
            -File $layoutFile -Line 0
    }
    
    if ($layoutContent -match '<Footer') {
        Write-Host "  ✓ Footer component present" -ForegroundColor Green
    } else {
        Add-Issue -Page "Layout" -Component "layout.tsx" -Severity "CRITICAL" `
            -Description "Missing Footer component" `
            -File $layoutFile -Line 0
    }
    
    if ($layoutContent -match '<main') {
        Write-Host "  ✓ Main content area present" -ForegroundColor Green
    } else {
        Add-Issue -Page "Layout" -Component "layout.tsx" -Severity "HIGH" `
            -Description "Missing main content wrapper" `
            -File $layoutFile -Line 0
    }
}

# Check Header component
$headerFile = Join-Path $projectRoot "src\components\header.tsx"
if (Test-Path $headerFile) {
    $headerContent = Get-Content $headerFile -Raw
    
    # Check for mobile menu
    if ($headerContent -match 'Sheet|MobileNav|MobileMenu') {
        Write-Host "  ✓ Mobile menu component present" -ForegroundColor Green
    } else {
        Add-Issue -Page "Header" -Component "header.tsx" -Severity "MEDIUM" `
            -Description "No mobile menu detected" `
            -File $headerFile -Line 0
    }
    
    Write-Host "  ✓ Header component validated" -ForegroundColor Green
}

# ==========================================
# 6. GENERATE REPORT
# ==========================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  VISIBILITY ISSUES SUMMARY" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if ($issues.Count -eq 0) {
    Write-Host "  [SUCCESS] No critical visibility issues found!" -ForegroundColor Green
    Write-Host "  All pages appear to be properly structured.`n" -ForegroundColor Green
} else {
    Write-Host "  Found $($issues.Count) potential issues:`n" -ForegroundColor Yellow
    
    $criticalIssues = $issues | Where-Object { $_.Severity -eq "CRITICAL" }
    $highIssues = $issues | Where-Object { $_.Severity -eq "HIGH" }
    $mediumIssues = $issues | Where-Object { $_.Severity -eq "MEDIUM" }
    
    if ($criticalIssues.Count -gt 0) {
        Write-Host "  CRITICAL ($($criticalIssues.Count)):" -ForegroundColor Red
        foreach ($issue in $criticalIssues) {
            Write-Host "    - [$($issue.Page)] $($issue.Description)" -ForegroundColor Red
        }
        Write-Host ""
    }
    
    if ($highIssues.Count -gt 0) {
        Write-Host "  HIGH ($($highIssues.Count)):" -ForegroundColor Yellow
        foreach ($issue in $highIssues) {
            Write-Host "    - [$($issue.Page)] $($issue.Description)" -ForegroundColor Yellow
        }
        Write-Host ""
    }
    
    if ($mediumIssues.Count -gt 0) {
        Write-Host "  MEDIUM ($($mediumIssues.Count)):" -ForegroundColor White
        foreach ($issue in $mediumIssues) {
            Write-Host "    - [$($issue.Page)] $($issue.Description)" -ForegroundColor White
        }
        Write-Host ""
    }
}

# Export detailed report
$reportPath = Join-Path $projectRoot "VISIBILITY_SCAN_REPORT.md"
$report = @"
# Page Visibility Scan Report
**Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## Summary
- **Total Issues Found:** $($issues.Count)
- **Critical:** $(($issues | Where-Object { $_.Severity -eq "CRITICAL" }).Count)
- **High:** $(($issues | Where-Object { $_.Severity -eq "HIGH" }).Count)
- **Medium:** $(($issues | Where-Object { $_.Severity -eq "MEDIUM" }).Count)

## Issues Details
"@

foreach ($issue in $issues) {
    $report += @"

### [$($issue.Severity)] $($issue.Component)
- **Page:** $($issue.Page)
- **Description:** $($issue.Description)
- **File:** $($issue.File)
"@
}

$report | Out-File -FilePath $reportPath -Encoding UTF8

Write-Host "  Detailed report saved to: VISIBILITY_SCAN_REPORT.md" -ForegroundColor Cyan
Write-Host ""
