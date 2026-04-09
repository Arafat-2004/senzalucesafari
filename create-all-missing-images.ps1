# COMPREHENSIVE IMAGE AUDIT & PLACEHOLDER GENERATOR
# This script finds ALL missing images and creates placeholders

$basePath = "C:\Users\arafa\Desktop\safarisSenza\senzalucesafaris\public\images"

# Define ALL missing images with their locations and suggested sizes
$missingImages = @(
    # General images
    @{Path="$basePath\general"; Name="luxury-lodge.jpg"; Size="800x600"; UsedIn="Blog posts, related posts"},
    @{Path="$basePath\general"; Name="planning-safari.jpg"; Size="800x600"; UsedIn="Safari tours page CTA"},
    
    # Safari images (used in vehicles data and old backup)
    @{Path="$basePath\safaris"; Name="serengeti-migration.jpg"; Size="800x600"; UsedIn="Vehicles page, tour backgrounds"},
    @{Path="$basePath\safaris"; Name="kilimanjaro.jpg"; Size="800x600"; UsedIn="Vehicles page, about page"},
    
    # Destination images
    @{Path="$basePath\destinations"; Name="tarangire.jpg"; Size="800x600"; UsedIn="Vehicles page"},
    @{Path="$basePath\destinations"; Name="ngorongoro.jpg"; Size="800x600"; UsedIn="Vehicles page"},
    @{Path="$basePath\destinations"; Name="lake-manyara.jpg"; Size="800x600"; UsedIn="Vehicles page"},
    @{Path="$basePath\destinations"; Name="manyara.jpg"; Size="800x600"; UsedIn="Vehicles page (old backup)"},
    
    # Home/testimonials - Check if needed
    @{Path="$basePath\home\testimonials"; Name="testimonial-1.jpg"; Size="400x400"; UsedIn="Homepage testimonials (if used)"},
    @{Path="$basePath\home\testimonials"; Name="testimonial-2.jpg"; Size="400x400"; UsedIn="Homepage testimonials (if used)"},
    @{Path="$basePath\home\testimonials"; Name="testimonial-3.jpg"; Size="400x400"; UsedIn="Homepage testimonials (if used)"},
    
    # Safari categories
    @{Path="$basePath\safaris-categories"; Name="wildlife-safari.jpg"; Size="800x600"; UsedIn="Safari categories section"},
    @{Path="$basePath\safaris-categories"; Name="kilimanjaro-climb.jpg"; Size="800x600"; UsedIn="Safari categories section"},
    @{Path="$basePath\safaris-categories"; Name="beach-holiday.jpg"; Size="800x600"; UsedIn="Safari categories section"},
    @{Path="$basePath\safaris-categories"; Name="cultural-tour.jpg"; Size="800x600"; UsedIn="Safari categories section"}
)

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  COMPREHENSIVE IMAGE AUDIT & PLACEHOLDER CREATION" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$created = 0
foreach ($img in $missingImages) {
    $folder = $img.Path
    $name = $img.Name
    $fullPath = Join-Path $folder $name
    
    # Create folder if it doesn't exist
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "✓ Created folder: $folder" -ForegroundColor Yellow
    }
    
    # Create placeholder file if it doesn't exist
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType File -Path $fullPath -Force | Out-Null
        Write-Host "✓ Created: $($name)`t($($img.Size)) - $($img.UsedIn)" -ForegroundColor Green
        $created++
    } else {
        Write-Host "  Exists: $($name)" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  SUMMARY" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Total placeholders created: $created" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Replace each placeholder with your real image" -ForegroundColor White
Write-Host "2. Use the exact same filename" -ForegroundColor White
Write-Host "3. Resize to the dimensions shown above" -ForegroundColor White
Write-Host "4. Refresh browser (Ctrl+F5)" -ForegroundColor White
Write-Host ""
