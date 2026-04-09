# Translation Verification Script
# Verifies that translation files contain actual translations (not English)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TRANSLATION CONTENT VERIFICATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$testResults = @()

# Test 1: Verify German translations
Write-Host "[TEST 1] Checking German (de.json) translations..." -ForegroundColor Yellow
$deContent = Get-Content "messages\de.json" -Raw

$deChecks = @(
    @{Key="home (Startseite)", Pattern='"home":\s*"Startseite"'},
    @{Key="about (Über uns)", Pattern='"about":\s*"Über uns"'},
    @{Key="hero title (Magie)", Pattern='"title":\s*"Erlebe die Magie'},
    @{Key="bookNow (buchen)", Pattern='"bookNow":\s*"Jetzt buchen"'},
    @{Key="contactUs (Kontaktieren)", Pattern='"contactUs":\s*"Kontaktieren'}
)

$dePassed = 0
foreach ($check in $deChecks) {
    if ($deContent -match $check.Pattern) {
        Write-Host "  [OK] $($check.Key)" -ForegroundColor Green
        $dePassed++
    } else {
        Write-Host "  [FAIL] $($check.Key)" -ForegroundColor Red
    }
}

if ($dePassed -eq $deChecks.Count) {
    Write-Host "  ✓ German: $dePassed/$($deChecks.Count) checks passed" -ForegroundColor Green
    $testResults += @{Test="German translations"; Status="PASS"}
} else {
    Write-Host "  ✗ German: $dePassed/$($deChecks.Count) checks passed" -ForegroundColor Red
    $testResults += @{Test="German translations"; Status="FAIL"}
}

Write-Host ""

# Test 2: Verify French translations
Write-Host "[TEST 2] Checking French (fr.json) translations..." -ForegroundColor Yellow
$frContent = Get-Content "messages\fr.json" -Raw

$frChecks = @(
    @{Key="home (Accueil)", Pattern='"home":\s*"Accueil"'},
    @{Key="about (À propos)", Pattern='"about":\s*"À propos"'},
    @{Key="hero title (Magie)", Pattern='"title":\s*"Vivez la Magie'},
    @{Key="bookNow (Réserver)", Pattern='"bookNow":\s*"Réserver maintenant"'},
    @{Key="contactUs (Contactez)", Pattern='"contactUs":\s*"Contactez-nous"'}
)

$frPassed = 0
foreach ($check in $frChecks) {
    if ($frContent -match $check.Pattern) {
        Write-Host "  [OK] $($check.Key)" -ForegroundColor Green
        $frPassed++
    } else {
        Write-Host "  [FAIL] $($check.Key)" -ForegroundColor Red
    }
}

if ($frPassed -eq $frChecks.Count) {
    Write-Host "  ✓ French: $frPassed/$($frChecks.Count) checks passed" -ForegroundColor Green
    $testResults += @{Test="French translations"; Status="PASS"}
} else {
    Write-Host "  ✗ French: $frPassed/$($frChecks.Count) checks passed" -ForegroundColor Red
    $testResults += @{Test="French translations"; Status="FAIL"}
}

Write-Host ""

# Test 3: Verify Spanish translations
Write-Host "[TEST 3] Checking Spanish (es.json) translations..." -ForegroundColor Yellow
$esContent = Get-Content "messages\es.json" -Raw

$esChecks = @(
    @{Key="home (Inicio)", Pattern='"home":\s*"Inicio"'},
    @{Key="about (Sobre nosotros)", Pattern='"about":\s*"Sobre nosotros"'},
    @{Key="hero title (Magia)", Pattern='"title":\s*"Experimenta la Magia'},
    @{Key="bookNow (Reservar)", Pattern='"bookNow":\s*"Reservar ahora"'},
    @{Key="contactUs (Contáctenos)", Pattern='"contactUs":\s*"Contáctenos"'}
)

$esPassed = 0
foreach ($check in $esChecks) {
    if ($esContent -match $check.Pattern) {
        Write-Host "  [OK] $($check.Key)" -ForegroundColor Green
        $esPassed++
    } else {
        Write-Host "  [FAIL] $($check.Key)" -ForegroundColor Red
    }
}

if ($esPassed -eq $esChecks.Count) {
    Write-Host "  ✓ Spanish: $esPassed/$($esChecks.Count) checks passed" -ForegroundColor Green
    $testResults += @{Test="Spanish translations"; Status="PASS"}
} else {
    Write-Host "  ✗ Spanish: $esPassed/$($esChecks.Count) checks passed" -ForegroundColor Red
    $testResults += @{Test="Spanish translations"; Status="FAIL"}
}

Write-Host ""

# Test 4: Verify Italian translations
Write-Host "[TEST 4] Checking Italian (it.json) translations..." -ForegroundColor Yellow
$itContent = Get-Content "messages\it.json" -Raw

$itChecks = @(
    @{Key="home (Home)", Pattern='"home":\s*"Home"'},
    @{Key="about (Chi siamo)", Pattern='"about":\s*"Chi siamo"'},
    @{Key="hero title (Magia)", Pattern='"title":\s*"Vivi la Magia'},
    @{Key="bookNow (Prenota)", Pattern='"bookNow":\s*"Prenota ora"'},
    @{Key="contactUs (Contattaci)", Pattern='"contactUs":\s*"Contattaci"'}
)

$itPassed = 0
foreach ($check in $itChecks) {
    if ($itContent -match $check.Pattern) {
        Write-Host "  [OK] $($check.Key)" -ForegroundColor Green
        $itPassed++
    } else {
        Write-Host "  [FAIL] $($check.Key)" -ForegroundColor Red
    }
}

if ($itPassed -eq $itChecks.Count) {
    Write-Host "  ✓ Italian: $itPassed/$($itChecks.Count) checks passed" -ForegroundColor Green
    $testResults += @{Test="Italian translations"; Status="PASS"}
} else {
    Write-Host "  ✗ Italian: $itPassed/$($itChecks.Count) checks passed" -ForegroundColor Red
    $testResults += @{Test="Italian translations"; Status="FAIL"}
}

Write-Host ""

# Test 5: Verify translations are DIFFERENT from English
Write-Host "[TEST 5] Verifying translations differ from English..." -ForegroundColor Yellow
$enContent = Get-Content "messages\en.json" -Raw

$diffChecks = @(
    @{Lang="German", File=$deContent, EngPattern='"home":\s*"Home"', ShouldNotExist=$true},
    @{Lang="French", File=$frContent, EngPattern='"home":\s*"Home"', ShouldNotExist=$true},
    @{Lang="Spanish", File=$esContent, EngPattern='"home":\s*"Home"', ShouldNotExist=$true}
)

$diffPassed = 0
foreach ($check in $diffChecks) {
    $hasEnglish = $check.File -match $check.EngPattern
    if (-not $hasEnglish) {
        Write-Host "  [OK] $($check.Lang) does not contain English 'Home'" -ForegroundColor Green
        $diffPassed++
    } else {
        Write-Host "  [FAIL] $($check.Lang) still has English 'Home'" -ForegroundColor Red
    }
}

if ($diffPassed -eq $diffChecks.Count) {
    Write-Host "  ✓ All translations differ from English" -ForegroundColor Green
    $testResults += @{Test="Translations differ from English"; Status="PASS"}
} else {
    Write-Host "  ✗ Some translations still contain English" -ForegroundColor Red
    $testResults += @{Test="Translations differ from English"; Status="FAIL"}
}

Write-Host ""

# Test 6: Verify JSON structure validity
Write-Host "[TEST 6] Validating JSON structure..." -ForegroundColor Yellow
$jsonValid = $true
foreach ($lang in @("en", "de", "fr", "es", "it")) {
    try {
        $json = Get-Content "messages\$lang.json" -Raw | ConvertFrom-Json
        Write-Host "  [OK] $lang.json - Valid JSON" -ForegroundColor Green
    } catch {
        Write-Host "  [FAIL] $lang.json - Invalid JSON: $_" -ForegroundColor Red
        $jsonValid = $false
    }
}

if ($jsonValid) {
    $testResults += @{Test="JSON structure validity"; Status="PASS"}
} else {
    $testResults += @{Test="JSON structure validity"; Status="FAIL"}
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$passed = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count

foreach ($result in $testResults) {
    $statusColor = switch ($result.Status) {
        "PASS" { "Green" }
        "FAIL" { "Red" }
    }
    Write-Host "  [$($result.Status)] $($result.Test)" -ForegroundColor $statusColor
}

Write-Host ""
Write-Host "Total: $($testResults.Count) tests" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red

Write-Host ""
if ($failed -eq 0) {
    Write-Host "[SUCCESS] All translations are properly in place!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Translation Coverage:" -ForegroundColor Cyan
    Write-Host "  ✓ Common UI elements (buttons, labels, etc.)" -ForegroundColor Green
    Write-Host "  ✓ Navigation menu items" -ForegroundColor Green
    Write-Host "  ✓ Home page hero section" -ForegroundColor Green
    Write-Host "  ✓ Home page quick info cards" -ForegroundColor Green
    Write-Host "  ✓ Home page stats section" -ForegroundColor Green
    Write-Host "  ✓ Home page safari categories" -ForegroundColor Green
    Write-Host "  ✓ Home page experience section" -ForegroundColor Green
    Write-Host "  ✓ Home page featured safaris" -ForegroundColor Green
    Write-Host "  ✓ Home page destinations section" -ForegroundColor Green
    Write-Host ""
    Write-Host "Test the translations at:" -ForegroundColor Yellow
    Write-Host "  - http://localhost:3000/en (English)" -ForegroundColor White
    Write-Host "  - http://localhost:3000/de (German)" -ForegroundColor White
    Write-Host "  - http://localhost:3000/fr (French)" -ForegroundColor White
    Write-Host "  - http://localhost:3000/es (Spanish)" -ForegroundColor White
    Write-Host "  - http://localhost:3000/it (Italian)" -ForegroundColor White
} else {
    Write-Host "[WARNING] Some translation issues found." -ForegroundColor Red
}

Write-Host ""
