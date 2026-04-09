# Batch Update Tours.ts Images to Use Placeholders
# Run this script from: senzalucesafaris\ directory

$filePath = "src\data\tours.ts"
$content = Get-Content -Path $filePath -Raw

# Replace all Unsplash URLs with placeholder paths
$replacements = @{
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop' = '/images/placeholders/serengeti.jpg'
    'https://images.unsplash.com/photo-1586864387789-628af9feed72?w=800&h=600&fit=crop' = '/images/placeholders/zanzibar-beach.jpg'
    'https://images.unsplash.com/photo-1626017346486-4c9e81e40dc8?w=800&h=600&fit=crop' = '/images/placeholders/kilimanjaro.jpg'
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=600&fit=crop' = '/images/placeholders/northern-circuit.jpg'
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop' = '/images/placeholders/zanzibar-beach-holiday.jpg'
    'https://images.unsplash.com/photo-1534177616064-26c1014be040?w=800&h=600&fit=crop' = '/images/placeholders/serengeti-migration.jpg'
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop' = '/images/placeholders/luxury-lodge.jpg'
    'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=600&fit=crop' = '/images/placeholders/big-five.jpg'
}

foreach ($key in $replacements.Keys) {
    $content = $content -replace [regex]::Escape($key), $replacements[$key]
}

# Write updated content back to file
$content | Set-Content -Path $filePath -NoNewline

Write-Host "✅ Successfully updated all image URLs in tours.ts to use placeholders" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open generate-placeholders.html in your browser"
Write-Host "2. Click 'Generate All Placeholders'"
Write-Host "3. Download all placeholder images"
Write-Host "4. Save them to: public\images\placeholders\"
Write-Host "5. Replace placeholders with your real images"
