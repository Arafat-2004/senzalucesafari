# Test all website pages
$baseUrl = "http://localhost:3000"

$pages = @(
    "/",
    "/en",
    "/about",
    "/contact",
    "/destinations",
    "/safaris-tours",
    "/en/about",
    "/en/contact",
    "/en/destinations",
    "/en/safaris-tours",
    "/en/destinations/serengeti",
    "/en/destinations/ngorongoro",
    "/en/destinations/tarangire",
    "/en/destinations/lake-manyara",
    "/en/destinations/zanzibar",
    "/en/safaris-tours/5-days-wildlife",
    "/en/safaris-tours/9-days-safari-zanzibar",
    "/en/safaris-tours/kilimanjaro-trekking"
)

Write-Host "Testing all pages..." -ForegroundColor Cyan
Write-Host ""

foreach ($page in $pages) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$page" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $status = $response.StatusCode
        if ($status -eq 200) {
            Write-Host "[OK] $page - Status: $status" -ForegroundColor Green
        } else {
            Write-Host "[WARN] $page - Status: $status" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "[FAIL] $page - Error occurred" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Page testing complete!" -ForegroundColor Cyan
