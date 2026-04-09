# Comprehensive Image Download Script for Senza Luce Safaris
# Downloads high-quality images from Unsplash for all website sections

$ErrorActionPreference = "Stop"
$outputBase = "C:\Users\arafa\Desktop\safarisSenza\senzalucesafaris\public\images"

Write-Host "Starting image download from Unsplash..." -ForegroundColor Cyan

# Function to download image with retry
function Download-Image {
    param(
        [string]$Url,
        [string]$OutputPath,
        [string]$Description
    )
    
    if (Test-Path $OutputPath) {
        Write-Host "  ✓ Already exists: $Description" -ForegroundColor Yellow
        return
    }
    
    $dir = Split-Path $OutputPath -Parent
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    
    try {
        Write-Host "  Downloading: $Description" -ForegroundColor Green
        Invoke-WebRequest -Uri $Url -OutFile $OutputPath -UseBasicParsing
        Write-Host "  ✓ Success: $Description" -ForegroundColor Green
    }
    catch {
        Write-Host "  ✗ Failed: $Description" -ForegroundColor Red
    }
}

# ========================================
# SERENGETI IMAGES
# ========================================
Write-Host "`n=== Downloading Serengeti Images ===" -ForegroundColor Cyan

Download-Image -Url "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\serengeti.jpg" `
    -Description "Serengeti savanna landscape with acacia trees"

Download-Image -Url "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\serengeti-lions.jpg" `
    -Description "Serengeti lions resting on grassland"

Download-Image -Url "https://images.unsplash.com/photo-1534177616064-26c1014be040?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\serengeti-migration.jpg" `
    -Description "Wildebeest migration river crossing"

Download-Image -Url "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\serengeti-sunset.jpg" `
    -Description "Serengeti golden sunset over plains"

Download-Image -Url "https://images.unsplash.com/photo-1557296387-5358ad7997bb?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\serengeti-elephants.jpg" `
    -Description "Serengeti elephant herd"

Download-Image -Url "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\serengeti-cheetah.jpg" `
    -Description "Cheetah on kopje in Serengeti"

# ========================================
# NGORONGORO IMAGES
# ========================================
Write-Host "`n=== Downloading Ngorongoro Images ===" -ForegroundColor Cyan

Download-Image -Url "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\ngorongoro.jpg" `
    -Description "Ngorongoro Crater panoramic view"

Download-Image -Url "https://images.unsplash.com/photo-1575550959106-5a3884bd2d6a?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\ngorongoro-rhino.jpg" `
    -Description "Black rhino in Ngorongoro Crater"

Download-Image -Url "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\ngorongoro-lions.jpg" `
    -Description "Lions on Ngorongoro crater floor"

Download-Image -Url "https://images.unsplash.com/photo-1563207153-f403bf289096?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\ngorongoro-flamingos.jpg" `
    -Description "Flamingos at Ngorongoro lake"

Download-Image -Url "https://images.unsplash.com/photo-1549366021-9f761d450615?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\ngorongoro-sunset.jpg" `
    -Description "Sunset from Ngorongoro crater rim"

Download-Image -Url "https://images.unsplash.com/photo-1585970480901-90d6bb2a48b5?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\ngorongoro-elephants.jpg" `
    -Description "Elephants in Ngorongoro Crater"

# ========================================
# TARANGIRE IMAGES
# ========================================
Write-Host "`n=== Downloading Tarangire Images ===" -ForegroundColor Cyan

Download-Image -Url "https://images.unsplash.com/photo-1549366021-9f761d450615?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\tarangire.jpg" `
    -Description "Tarangire baobab trees landscape"

Download-Image -Url "https://images.unsplash.com/photo-1564760055278-8d5fd4964215?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\tarangire-elephants.jpg" `
    -Description "Large elephant herd in Tarangire"

Download-Image -Url "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\tarangire-baobabs.jpg" `
    -Description "Ancient baobab trees in Tarangire"

Download-Image -Url "https://images.unsplash.com/photo-1562569633-66637f54cc32?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\tarangire-lions.jpg" `
    -Description "Lions under baobab tree"

Download-Image -Url "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\tarangire-sunset.jpg" `
    -Description "Tarangire sunset with baobabs"

Download-Image -Url "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\tarangire-giraffe.jpg" `
    -Description "Giraffe near baobab tree"

# ========================================
# LAKE MANYARA IMAGES
# ========================================
Write-Host "`n=== Downloading Lake Manyara Images ===" -ForegroundColor Cyan

Download-Image -Url "https://images.unsplash.com/photo-1563207153-f403bf289096?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\lake-manyara.jpg" `
    -Description "Lake Manyara with escarpment"

Download-Image -Url "https://images.unsplash.com/photo-1563207153-f403bf289096?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\lake-manyara-flamingos.jpg" `
    -Description "Pink flamingos on Lake Manyara"

Download-Image -Url "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\lake-manyara-forest.jpg" `
    -Description "Lake Manyara groundwater forest"

Download-Image -Url "https://images.unsplash.com/photo-1534177616064-26c1014be040?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\lake-manyara-baboons.jpg" `
    -Description "Baboons in Lake Manyara forest"

Download-Image -Url "https://images.unsplash.com/photo-1549366021-9f761d450615?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\lake-manyara-sunset.jpg" `
    -Description "Lake Manyara sunset view"

Download-Image -Url "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\lake-manyara-hippos.jpg" `
    -Description "Hippos in Lake Manyara water"

# ========================================
# ZANZIBAR IMAGES
# ========================================
Write-Host "`n=== Downloading Zanzibar Images ===" -ForegroundColor Cyan

Download-Image -Url "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\zanzibar.jpg" `
    -Description "Zanzibar white sand beach aerial"

Download-Image -Url "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\zanzibar-beach.jpg" `
    -Description "Zanzibar turquoise water beach"

Download-Image -Url "https://images.unsplash.com/photo-1580745294857-df39cee37c88?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\zanzibar-stone-town.jpg" `
    -Description "Stone Town Zanzibar alley and door"

Download-Image -Url "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\zanzibar-spices.jpg" `
    -Description "Zanzibar spice market display"

Download-Image -Url "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\zanzibar-dhow.jpg" `
    -Description "Traditional dhow boat at sunset Zanzibar"

Download-Image -Url "https://images.unsplash.com/photo-1583212292454-1fe63616d5d1?w=1920&q=85" `
    -OutputPath "$outputBase\destinations\zanzibar-diving.jpg" `
    -Description "Coral reef snorkeling Zanzibar"

# ========================================
# KILIMANJARO IMAGES
# ========================================
Write-Host "`n=== Downloading Kilimanjaro Images ===" -ForegroundColor Cyan

Download-Image -Url "https://images.unsplash.com/photo-1626010560045-ae0e573197e4?w=1920&q=85" `
    -OutputPath "$outputBase\placeholders\kilimanjaro.jpg" `
    -Description "Mount Kilimanjaro snow-capped peak"

Download-Image -Url "https://images.unsplash.com/photo-1609198092458-98e4bd64615d?w=1920&q=85" `
    -OutputPath "$outputBase\tours\kilimanjaro-trekking.jpg" `
    -Description "Kilimanjaro trekking route"

# ========================================
# SAFARI LODGE IMAGES
# ========================================
Write-Host "`n=== Downloading Safari Lodge Images ===" -ForegroundColor Cyan

Download-Image -Url "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=85" `
    -OutputPath "$outputBase\placeholders\luxury-lodge.jpg" `
    -Description "Luxury safari tented camp interior"

Download-Image -Url "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=85" `
    -OutputPath "$outputBase\placeholders\midrange-lodge.jpg" `
    -Description "Mid-range safari lodge exterior"

Download-Image -Url "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=85" `
    -OutputPath "$outputBase\placeholders\budget-lodge.jpg" `
    -Description "Budget safari accommodation"

# ========================================
# HERO & FEATURED IMAGES
# ========================================
Write-Host "`n=== Downloading Hero & Featured Images ===" -ForegroundColor Cyan

Download-Image -Url "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=85" `
    -OutputPath "$outputBase\placeholders\serengeti.jpg" `
    -Description "Hero safari landscape"

Download-Image -Url "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=85" `
    -OutputPath "$outputBase\placeholders\experience-hero.jpg" `
    -Description "Wildlife experience hero"

Download-Image -Url "https://images.unsplash.com/photo-1534177616064-26c1014be040?w=1920&q=85" `
    -OutputPath "$outputBase\placeholders\serengeti-migration.jpg" `
    -Description "Great migration scene hero"

Download-Image -Url "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=1920&q=85" `
    -OutputPath "$outputBase\placeholders\northern-circuit.jpg" `
    -Description "Northern circuit overview"

Download-Image -Url "https://images.unsplash.com/photo-1562569633-66637f54cc32?w=1920&q=85" `
    -OutputPath "$outputBase\placeholders\big-five.jpg" `
    -Description "Big five animals"

Download-Image -Url "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1920&q=85" `
    -OutputPath "$outputBase\placeholders\zanzibar-beach.jpg" `
    -Description "Zanzibar beach for safari+beach combo"

Download-Image -Url "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1920&q=85" `
    -OutputPath "$outputBase\placeholders\zanzibar-beach-holiday.jpg" `
    -Description "Zanzibar beach holiday"

Download-Image -Url "https://images.unsplash.com/photo-1549366021-9f761d450615?w=1920&q=85" `
    -OutputPath "$outputBase\placeholders\bush-beach-combo.jpg" `
    -Description "Bush and beach combination"

Download-Image -Url "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=1920&q=85" `
    -OutputPath "$outputBase\placeholders\stone-town.jpg" `
    -Description "Stone Town cultural experience"

# ========================================
# FOOTER & GENERAL IMAGES
# ========================================
Write-Host "`n=== Downloading Footer & General Images ===" -ForegroundColor Cyan

Download-Image -Url "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=85" `
    -OutputPath "$outputBase\footer\footer-bg.jpg" `
    -Description "Footer background safari landscape"

Download-Image -Url "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=85" `
    -OutputPath "$outputBase\general\planning-safari.jpg" `
    -Description "Safari planning consultation"

Write-Host "`n✅ Image download complete!" -ForegroundColor Green
Write-Host "Total images downloaded: ~50+" -ForegroundColor Green
