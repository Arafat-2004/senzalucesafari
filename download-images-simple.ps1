# Simple Image Download Script
$base = "C:\Users\arafa\Desktop\safarisSenza\senzalucesafaris\public\images"

$images = @(
    # Serengeti
    @{Url="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=85"; Path="$base\destinations\serengeti.jpg"; Name="Serengeti landscape"},
    @{Url="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=85"; Path="$base\destinations\serengeti-lions.jpg"; Name="Serengeti lions"},
    @{Url="https://images.unsplash.com/photo-1534177616064-26c1014be040?w=1920&q=85"; Path="$base\destinations\serengeti-migration.jpg"; Name="Serengeti migration"},
    @{Url="https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=1920&q=85"; Path="$base\destinations\serengeti-sunset.jpg"; Name="Serengeti sunset"},
    @{Url="https://images.unsplash.com/photo-1557296387-5358ad7997bb?w=1920&q=85"; Path="$base\destinations\serengeti-elephants.jpg"; Name="Serengeti elephants"},
    
    # Ngorongoro
    @{Url="https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=1920&q=85"; Path="$base\destinations\ngorongoro.jpg"; Name="Ngorongoro crater"},
    @{Url="https://images.unsplash.com/photo-1575550959106-5a3884bd2d6a?w=1920&q=85"; Path="$base\destinations\ngorongoro-rhino.jpg"; Name="Ngorongoro rhino"},
    @{Url="https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=1920&q=85"; Path="$base\destinations\ngorongoro-lions.jpg"; Name="Ngorongoro lions"},
    @{Url="https://images.unsplash.com/photo-1563207153-f403bf289096?w=1920&q=85"; Path="$base\destinations\ngorongoro-flamingos.jpg"; Name="Ngorongoro flamingos"},
    
    # Tarangire
    @{Url="https://images.unsplash.com/photo-1549366021-9f761d450615?w=1920&q=85"; Path="$base\destinations\tarangire.jpg"; Name="Tarangire baobabs"},
    @{Url="https://images.unsplash.com/photo-1564760055278-8d5fd4964215?w=1920&q=85"; Path="$base\destinations\tarangire-elephants.jpg"; Name="Tarangire elephants"},
    @{Url="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=85"; Path="$base\destinations\tarangire-baobabs.jpg"; Name="Tarangire ancient baobabs"},
    
    # Lake Manyara
    @{Url="https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=1920&q=85"; Path="$base\destinations\lake-manyara.jpg"; Name="Lake Manyara"},
    @{Url="https://images.unsplash.com/photo-1563207153-f403bf289096?w=1920&q=85"; Path="$base\destinations\lake-manyara-flamingos.jpg"; Name="Lake Manyara flamingos"},
    
    # Zanzibar
    @{Url="https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1920&q=85"; Path="$base\destinations\zanzibar.jpg"; Name="Zanzibar beach aerial"},
    @{Url="https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1920&q=85"; Path="$base\destinations\zanzibar-beach.jpg"; Name="Zanzibar turquoise beach"},
    @{Url="https://images.unsplash.com/photo-1580745294857-df39cee37c88?w=1920&q=85"; Path="$base\destinations\zanzibar-stone-town.jpg"; Name="Zanzibar Stone Town"},
    @{Url="https://images.unsplash.com/photo-1596436889106-be35e843f974?w=1920&q=85"; Path="$base\destinations\zanzibar-spices.jpg"; Name="Zanzibar spices"},
    @{Url="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=85"; Path="$base\destinations\zanzibar-dhow.jpg"; Name="Zanzibar dhow boat"},
    
    # Kilimanjaro
    @{Url="https://images.unsplash.com/photo-1626010560045-ae0e573197e4?w=1920&q=85"; Path="$base\placeholders\kilimanjaro.jpg"; Name="Kilimanjaro peak"},
    
    # Lodges
    @{Url="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=85"; Path="$base\placeholders\luxury-lodge.jpg"; Name="Luxury lodge"},
    @{Url="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=85"; Path="$base\placeholders\midrange-lodge.jpg"; Name="Midrange lodge"},
    @{Url="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=85"; Path="$base\placeholders\budget-lodge.jpg"; Name="Budget lodge"},
    
    # Placeholders/Hero
    @{Url="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=85"; Path="$base\placeholders\serengeti-migration.jpg"; Name="Hero migration"},
    @{Url="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=85"; Path="$base\placeholders\experience-hero.jpg"; Name="Experience hero"},
    @{Url="https://images.unsplash.com/photo-1562569633-66637f54cc32?w=1920&q=85"; Path="$base\placeholders\big-five.jpg"; Name="Big five"},
    @{Url="https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1920&q=85"; Path="$base\placeholders\zanzibar-beach.jpg"; Name="Zanzibar beach placeholder"},
    @{Url="https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1920&q=85"; Path="$base\placeholders\zanzibar-beach-holiday.jpg"; Name="Zanzibar beach holiday"},
    @{Url="https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=1920&q=85"; Path="$base\placeholders\stone-town.jpg"; Name="Stone Town placeholder"},
    @{Url="https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=1920&q=85"; Path="$base\placeholders\northern-circuit.jpg"; Name="Northern circuit"},
    @{Url="https://images.unsplash.com/photo-1549366021-9f761d450615?w=1920&q=85"; Path="$base\placeholders\bush-beach-combo.jpg"; Name="Bush beach combo"},
    
    # Footer & General
    @{Url="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=85"; Path="$base\footer\footer-bg.jpg"; Name="Footer background"},
    @{Url="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=85"; Path="$base\general\planning-safari.jpg"; Name="Planning safari"}
)

$success = 0
$failed = 0
$skipped = 0

foreach ($img in $images) {
    if (Test-Path $img.Path) {
        Write-Host "✓ Skipped (exists): $($img.Name)" -ForegroundColor Yellow
        $skipped++
        continue
    }
    
    $dir = Split-Path $img.Path -Parent
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    
    try {
        Invoke-WebRequest -Uri $img.Url -OutFile $img.Path -UseBasicParsing
        Write-Host "✓ Downloaded: $($img.Name)" -ForegroundColor Green
        $success++
    }
    catch {
        Write-Host "✗ Failed: $($img.Name)" -ForegroundColor Red
        $failed++
    }
}

Write-Host "`n=== Download Summary ===" -ForegroundColor Cyan
Write-Host "Successfully downloaded: $success" -ForegroundColor Green
Write-Host "Already existed (skipped): $skipped" -ForegroundColor Yellow
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host "Total: $($images.Count)" -ForegroundColor Cyan
