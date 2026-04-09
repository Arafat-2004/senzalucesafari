# Download Context-Specific Images from Unsplash
# This script downloads optimized images for the Senza Luce Safaris website

$ErrorActionPreference = "Stop"
$outputDir = "c:\Users\arafa\Desktop\safarisSenza\senzalucesafaris\public\images"

Write-Host "=== Downloading Context-Specific Safari Images ===" -ForegroundColor Cyan

# Image mapping with Unsplash URLs (using source.unsplash.com for direct downloads)
# All images optimized for web with proper dimensions
$imageMap = @{
    # Placeholders folder - Main images
    "placeholders/hero-safari.jpg" = "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&h=1080&fit=crop&q=85"
    "placeholders/serengeti.jpg" = "https://images.unsplash.com/photo-1534177616064-26c1014be040?w=1200&h=800&fit=crop&q=80"
    "placeholders/kilimanjaro.jpg" = "https://images.unsplash.com/photo-1609198093091-1f7c4e9c0a5b?w=1200&h=800&fit=crop&q=80"
    "placeholders/zanzibar-beach.jpg" = "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1200&h=800&fit=crop&q=80"
    "placeholders/stone-town.jpg" = "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200&h=800&fit=crop&q=80"
    "placeholders/experience-hero.jpg" = "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&h=800&fit=crop&q=80"
    "placeholders/luxury-lodge.jpg" = "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&h=800&fit=crop&q=80"
    "placeholders/midrange-lodge.jpg" = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop&q=80"
    "placeholders/budget-lodge.jpg" = "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&h=800&fit=crop&q=80"
    "placeholders/5-days-wildlife.jpg" = "https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&h=800&fit=crop&q=80"
    "placeholders/9-days-safari-zanzibar.jpg" = "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200&h=800&fit=crop&q=80"
    "placeholders/northern-circuit.jpg" = "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=1200&h=800&fit=crop&q=80"
    "placeholders/zanzibar-beach-holiday.jpg" = "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&h=800&fit=crop&q=80"
    "placeholders/serengeti-migration.jpg" = "https://images.unsplash.com/photo-1535338454528-1b5c8e9b1e5c?w=1200&h=800&fit=crop&q=80"
    "placeholders/bush-beach-combo.jpg" = "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&h=800&fit=crop&q=80"
    "placeholders/luxury-lodges.jpg" = "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&h=800&fit=crop&q=80"
    "placeholders/big-five.jpg" = "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=1200&h=800&fit=crop&q=80"
    
    # Blog folder
    "blog/big-five.jpg" = "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=1200&h=800&fit=crop&q=80"
    "blog/great-migration.jpg" = "https://images.unsplash.com/photo-1535338454528-1b5c8e9b1e5c?w=1200&h=800&fit=crop&q=80"
    "blog/kilimanjaro-climb.jpg" = "https://images.unsplash.com/photo-1609198093091-1f7c4e9c0a5b?w=1200&h=800&fit=crop&q=80"
    "blog/luxury-lodges.jpg" = "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&h=800&fit=crop&q=80"
    "blog/seasons-guide.jpg" = "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=1200&h=800&fit=crop&q=80"
    "blog/stone-town.jpg" = "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200&h=800&fit=crop&q=80"
    
    # Destinations folder
    "destinations/tarangire.jpg" = "https://images.unsplash.com/photo-1581852017103-68accd557206?w=1200&h=800&fit=crop&q=80"
    "destinations/ngorongoro.jpg" = "https://images.unsplash.com/photo-1621252179027-94459d27d36c?w=1200&h=800&fit=crop&q=80"
    "destinations/lake-manyara.jpg" = "https://images.unsplash.com/photo-1603780813360-3c24b07e323e?w=1200&h=800&fit=crop&q=80"
}

# Download each image
$successCount = 0
$failCount = 0

foreach ($relativePath in $imageMap.Keys) {
    $url = $imageMap[$relativePath]
    $fullPath = Join-Path $outputDir $relativePath
    
    Write-Host "`nDownloading: $relativePath" -ForegroundColor Yellow
    
    try {
        # Create directory if it doesn't exist
        $dir = Split-Path $fullPath -Parent
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
        
        # Download the image
        Invoke-WebRequest -Uri $url -OutFile $fullPath -UseBasicParsing
        
        # Verify file was downloaded
        if (Test-Path $fullPath) {
            $fileSize = (Get-Item $fullPath).Length / 1KB
            Write-Host "  [OK] Success ($([math]::Round($fileSize, 1)) KB)" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "  [FAIL] Failed: File not created" -ForegroundColor Red
            $failCount++
        }
    } catch {
        Write-Host "  [FAIL] Failed: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
}

Write-Host "`n=== Download Complete ===" -ForegroundColor Cyan
Write-Host "Successful: $successCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
