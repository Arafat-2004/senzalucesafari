# Download failed images with alternative Unsplash URLs
$ErrorActionPreference = "Continue"
$outputDir = "c:\Users\arafa\Desktop\safarisSenza\senzalucesafaris\public\images"

Write-Host "=== Downloading Failed Images with Alternative URLs ===" -ForegroundColor Cyan

# Alternative Unsplash URLs for failed downloads
$alternativeImages = @{
    "destinations/ngorongoro.jpg" = "https://images.unsplash.com/photo-1581852017103-68accd557206?w=1200&h=800&fit=crop&q=80"
    "placeholders/serengeti.jpg" = "https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&h=800&fit=crop&q=80"
    "blog/great-migration.jpg" = "https://images.unsplash.com/photo-1534177616064-26c1014be040?w=1200&h=800&fit=crop&q=80"
    "blog/kilimanjaro-climb.jpg" = "https://images.unsplash.com/photo-1621252179027-94459d27d36c?w=1200&h=800&fit=crop&q=80"
    "placeholders/serengeti-migration.jpg" = "https://images.unsplash.com/photo-1534177616064-26c1014be040?w=1200&h=800&fit=crop&q=80"
    "destinations/lake-manyara.jpg" = "https://images.unsplash.com/photo-1603780813360-3c24b07e323e?w=1200&h=800&fit=crop&q=80"
    "placeholders/kilimanjaro.jpg" = "https://images.unsplash.com/photo-1621252179027-94459d27d36c?w=1200&h=800&fit=crop&q=80"
    "destinations/tarangire.jpg" = "https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&h=800&fit=crop&q=80"
}

$successCount = 0
$failCount = 0

foreach ($relativePath in $alternativeImages.Keys) {
    $url = $alternativeImages[$relativePath]
    $fullPath = Join-Path $outputDir $relativePath
    
    Write-Host "`nDownloading: $relativePath" -ForegroundColor Yellow
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $fullPath -UseBasicParsing
        
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

Write-Host "`n=== Alternative Download Complete ===" -ForegroundColor Cyan
Write-Host "Successful: $successCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
