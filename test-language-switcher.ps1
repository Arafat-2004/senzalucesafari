# Language Switcher Test Script
# Tests proper language switching without nested locale paths

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LANGUAGE SWITCHER VERIFICATION TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$testResults = @()

# Test 1: Verify language switcher code uses correct pattern
Write-Host "[TEST 1] Checking language switcher implementation..." -ForegroundColor Yellow
$switcherFile = "src\components\ui\language-switcher.tsx"

if (Test-Path $switcherFile) {
    $content = Get-Content $switcherFile -Raw
    
    # Check if it uses the correct next-intl pattern
    $hasLocaleOption = $content -match "router\.push.*locale:"
    $hasPathWithoutLocale = $content -match "pathWithoutLocale"
    $noManualSegmentManipulation = $content -notmatch "segments\[0\] = newLocale"
    
    if ($hasLocaleOption -and $hasPathWithoutLocale -and $noManualSegmentManipulation) {
        Write-Host "  [PASS] Language switcher uses correct next-intl pattern" -ForegroundColor Green
        $testResults += @{Test="Language switcher code"; Status="PASS"}
    } else {
        Write-Host "  [FAIL] Language switcher has incorrect implementation" -ForegroundColor Red
        Write-Host "    - Uses locale option: $hasLocaleOption" -ForegroundColor Red
        Write-Host "    - Has pathWithoutLocale: $hasPathWithoutLocale" -ForegroundColor Red
        Write-Host "    - No manual manipulation: $noManualSegmentManipulation" -ForegroundColor Red
        $testResults += @{Test="Language switcher code"; Status="FAIL"}
    }
} else {
    Write-Host "  [FAIL] File not found: $switcherFile" -ForegroundColor Red
    $testResults += @{Test="Language switcher file exists"; Status="FAIL"}
}

Write-Host ""

# Test 2: Verify navigation configuration
Write-Host "[TEST 2] Checking i18n navigation configuration..." -ForegroundColor Yellow
$navFile = "src\i18n\navigation.ts"

if (Test-Path $navFile) {
    $navContent = Get-Content $navFile -Raw
    
    $hasCorrectLocales = $navContent -match "locales:.*'en'.*'it'.*'de'.*'fr'.*'es'"
    $hasDefaultLocale = $navContent -match "defaultLocale: 'en'"
    $hasLocalePrefix = $navContent -match "localePrefix: 'as-needed'"
    $hasCreateNavigation = $navContent -match "createNavigation\(routing\)"
    
    if ($hasCorrectLocales -and $hasDefaultLocale -and $hasLocalePrefix -and $hasCreateNavigation) {
        Write-Host "  [PASS] Navigation configuration is correct" -ForegroundColor Green
        $testResults += @{Test="Navigation config"; Status="PASS"}
    } else {
        Write-Host "  [FAIL] Navigation configuration has issues" -ForegroundColor Red
        $testResults += @{Test="Navigation config"; Status="FAIL"}
    }
} else {
    Write-Host "  [FAIL] Navigation file not found" -ForegroundColor Red
    $testResults += @{Test="Navigation config"; Status="FAIL"}
}

Write-Host ""

# Test 3: Check that all pages use I18nLink for internal navigation
Write-Host "[TEST 3] Checking I18nLink usage in components..." -ForegroundColor Yellow

$filesToCheck = @(
    "src\components\layout\header.tsx",
    "src\components\layout\footer.tsx",
    "src\app\[locale]\safaris-tours\tours-content.tsx",
    "src\app\[locale]\vehicles\page.tsx"
)

$linkCheckPassed = $true
foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        $fileContent = Get-Content $file -Raw
        if ($fileContent -match "from.*@/i18n/navigation") {
            Write-Host "  [OK] $file uses I18nLink" -ForegroundColor Green
        } else {
            Write-Host "  [WARN] $file may not use I18nLink" -ForegroundColor Yellow
            $linkCheckPassed = $false
        }
    }
}

if ($linkCheckPassed) {
    $testResults += @{Test="I18nLink usage"; Status="PASS"}
} else {
    $testResults += @{Test="I18nLink usage"; Status="WARN"}
}

Write-Host ""

# Test 4: Verify translation files structure
Write-Host "[TEST 4] Checking translation files..." -ForegroundColor Yellow
$locales = @("en", "it", "de", "fr", "es")
$translationCheckPassed = $true

foreach ($loc in $locales) {
    $translationFile = "messages\$loc.json"
    if (Test-Path $translationFile) {
        try {
            $json = Get-Content $translationFile -Raw | ConvertFrom-Json
            $hasHome = $null -ne $json.home
            $hasAbout = $null -ne $json.about
            $hasContact = $null -ne $json.contact
            
            if ($hasHome -and $hasAbout -and $hasContact) {
                Write-Host "  [OK] $loc.json - Valid structure" -ForegroundColor Green
            } else {
                Write-Host "  [WARN] $loc.json - Missing sections" -ForegroundColor Yellow
                $translationCheckPassed = $false
            }
        } catch {
            Write-Host "  [FAIL] $loc.json - Invalid JSON" -ForegroundColor Red
            $translationCheckPassed = $false
        }
    } else {
        Write-Host "  [FAIL] $loc.json - Not found" -ForegroundColor Red
        $translationCheckPassed = $false
    }
}

if ($translationCheckPassed) {
    $testResults += @{Test="Translation files"; Status="PASS"}
} else {
    $testResults += @{Test="Translation files"; Status="FAIL"}
}

Write-Host ""

# Test 5: Verify middleware/proxy configuration
Write-Host "[TEST 5] Checking middleware configuration..." -ForegroundColor Yellow
if (Test-Path "src\middleware.ts") {
    $middlewareContent = Get-Content "src\middleware.ts" -Raw
    if ($middlewareContent -match "next-intl") {
        Write-Host "  [PASS] Middleware configured with next-intl" -ForegroundColor Green
        $testResults += @{Test="Middleware config"; Status="PASS"}
    } else {
        Write-Host "  [WARN] Middleware exists but may not use next-intl" -ForegroundColor Yellow
        $testResults += @{Test="Middleware config"; Status="WARN"}
    }
} else {
    Write-Host "  [WARN] No middleware.ts found" -ForegroundColor Yellow
    $testResults += @{Test="Middleware config"; Status="WARN"}
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$passed = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$warnings = ($testResults | Where-Object { $_.Status -eq "WARN" }).Count

foreach ($result in $testResults) {
    $statusColor = switch ($result.Status) {
        "PASS" { "Green" }
        "FAIL" { "Red" }
        "WARN" { "Yellow" }
    }
    Write-Host "  [$($result.Status)] $($result.Test)" -ForegroundColor $statusColor
}

Write-Host ""
Write-Host "Total: $($testResults.Count) tests" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host "Warnings: $warnings" -ForegroundColor Yellow

Write-Host ""
if ($failed -eq 0) {
    Write-Host "[SUCCESS] Language switcher is properly configured!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Expected behavior after fix:" -ForegroundColor Cyan
    Write-Host "  - /en -> Switch to DE -> /de (NOT /en/de)" -ForegroundColor Green
    Write-Host "  - /de -> Switch to FR -> /fr (NOT /de/fr)" -ForegroundColor Green
    Write-Host "  - /it/about -> Switch to ES -> /es/about (NOT /it/es/about)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Test URLs to verify manually:" -ForegroundColor Yellow
    Write-Host "  - $baseUrl/en (English Home)" -ForegroundColor White
    Write-Host "  - $baseUrl/de (German Home)" -ForegroundColor White
    Write-Host "  - $baseUrl/it/about (Italian About)" -ForegroundColor White
    Write-Host "  - $baseUrl/fr/safaris-tours (French Tours)" -ForegroundColor White
    Write-Host "  - $baseUrl/es/contact (Spanish Contact)" -ForegroundColor White
} else {
    Write-Host "[WARNING] Some issues found. Please review the failures above." -ForegroundColor Red
}

Write-Host ""
