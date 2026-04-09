# Simple Translation Verification Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TRANSLATION VERIFICATION TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check German has German words
Write-Host "[TEST 1] German translations..." -ForegroundColor Yellow
$de = Get-Content "messages\de.json" -Raw
if ($de -match "Startseite" -and $de -match "buchen" -and $de -match "Magie") {
    Write-Host "  [PASS] German contains German words" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] German missing German words" -ForegroundColor Red
}

# Test 2: Check French has French words  
Write-Host "[TEST 2] French translations..." -ForegroundColor Yellow
$fr = Get-Content "messages\fr.json" -Raw
if ($fr -match "Accueil" -and $fr -match "Reserver" -and $fr -match "Magie") {
    Write-Host "  [PASS] French contains French words" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] French missing French words" -ForegroundColor Red
}

# Test 3: Check Spanish has Spanish words
Write-Host "[TEST 3] Spanish translations..." -ForegroundColor Yellow
$es = Get-Content "messages\es.json" -Raw
if ($es -match "Inicio" -and $es -match "Reservar" -and $es -match "Magia") {
    Write-Host "  [PASS] Spanish contains Spanish words" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] Spanish missing Spanish words" -ForegroundColor Red
}

# Test 4: Check Italian has Italian words
Write-Host "[TEST 4] Italian translations..." -ForegroundColor Yellow
$it = Get-Content "messages\it.json" -Raw
if ($it -match "Chi siamo" -and $it -match "Prenota" -and $it -match "Magia") {
    Write-Host "  [PASS] Italian contains Italian words" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] Italian missing Italian words" -ForegroundColor Red
}

# Test 5: Verify they're not all English
Write-Host "[TEST 5] Verifying translations are not English..." -ForegroundColor Yellow
$en = Get-Content "messages\en.json" -Raw
if ($de -ne $en -and $fr -ne $en -and $es -ne $en -and $it -ne $en) {
    Write-Host "  [PASS] Translation files differ from English" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] Some files are identical to English" -ForegroundColor Red
}

# Test 6: Validate JSON
Write-Host "[TEST 6] Validating JSON files..." -ForegroundColor Yellow
$jsonValid = $true
foreach ($lang in @("en", "de", "fr", "es", "it")) {
    try {
        $null = Get-Content "messages\$lang.json" -Raw | ConvertFrom-Json
        Write-Host "  [OK] $lang.json valid" -ForegroundColor Green
    } catch {
        Write-Host "  [FAIL] $lang.json invalid" -ForegroundColor Red
        $jsonValid = $false
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Translations are now in place for:" -ForegroundColor Green
Write-Host "  - German (de): Navigation, Common UI, Home page sections" -ForegroundColor White
Write-Host "  - French (fr): Navigation, Common UI, Home page sections" -ForegroundColor White
Write-Host "  - Spanish (es): Navigation, Common UI, Home page sections" -ForegroundColor White
Write-Host "  - Italian (it): Navigation, Common UI, Home page sections" -ForegroundColor White
Write-Host ""
Write-Host "Test URLs:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000/de - German version" -ForegroundColor White
Write-Host "  http://localhost:3000/fr - French version" -ForegroundColor White
Write-Host "  http://localhost:3000/es - Spanish version" -ForegroundColor White
Write-Host "  http://localhost:3000/it - Italian version" -ForegroundColor White
Write-Host ""
Write-Host "What you should see:" -ForegroundColor Cyan
Write-Host "  - German: Startseite, Safari & Touren, Reiseziele" -ForegroundColor White
Write-Host "  - French: Accueil, Safaris & Circuits, Destinations" -ForegroundColor White
Write-Host "  - Spanish: Inicio, Safaris & Tours, Destinos" -ForegroundColor White
Write-Host "  - Italian: Home, Safari & Tour, Destinazioni" -ForegroundColor White
Write-Host ""
