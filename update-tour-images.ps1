# PowerShell Script to Update Tour Images
# Run this AFTER uploading family-safari.jpg and camping-safari.jpg

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Senza Luce Safaris - Image Updater" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if files exist
$familyImage = "public\images\safaris\family-safari.jpg"
$campingImage = "public\images\safaris\camping-safari.jpg"

Write-Host "Checking for uploaded images..." -ForegroundColor Yellow
Write-Host ""

$familyExists = Test-Path $familyImage
$campingExists = Test-Path $campingImage

if ($familyExists) {
    Write-Host "[OK] family-safari.jpg found!" -ForegroundColor Green
} else {
    Write-Host "[MISSING] family-safari.jpg not found" -ForegroundColor Red
    Write-Host "        Expected location: $familyImage" -ForegroundColor Gray
}

if ($campingExists) {
    Write-Host "[OK] camping-safari.jpg found!" -ForegroundColor Green
} else {
    Write-Host "[MISSING] camping-safari.jpg not found" -ForegroundColor Red
    Write-Host "        Expected location: $campingImage" -ForegroundColor Gray
}

Write-Host ""

if (-not $familyExists -and -not $campingExists) {
    Write-Host "ERROR: Neither image file found. Please upload them first!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Upload instructions:" -ForegroundColor Yellow
    Write-Host "1. Place family-safari.jpg in: public\images\safaris\" -ForegroundColor Gray
    Write-Host "2. Place camping-safari.jpg in: public\images\safaris\" -ForegroundColor Gray
    Write-Host "3. Run this script again" -ForegroundColor Gray
    exit 1
}

# Read the tours.ts file
$toursFile = "src\data\tours.ts"
Write-Host "Reading tours.ts..." -ForegroundColor Yellow

if (-not (Test-Path $toursFile)) {
    Write-Host "ERROR: tours.ts not found at $toursFile" -ForegroundColor Red
    exit 1
}

$content = Get-Content $toursFile -Raw

# Track changes
$changesMade = 0

# Update family safari image if file exists
if ($familyExists) {
    $oldPattern = 'imageUrl: "/images/safaris/default\.jpg"'
    # We need to be more specific - find the family adventure tour section
    
    # Better approach: use line-by-line replacement
    $lines = Get-Content $toursFile
    $updated = $false
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        # Look for the family adventure tour ID, then find its imageUrl
        if ($lines[$i] -match 'id:\s*"5-day-family-adventure"') {
            # Search forward for imageUrl within next 20 lines
            for ($j = $i; $j -lt [Math]::Min($i + 20, $lines.Count); $j++) {
                if ($lines[$j] -match 'imageUrl:\s*"/images/safaris/default\.jpg"') {
                    $lines[$j] = '        imageUrl: "/images/safaris/family-safari.jpg",'
                    Write-Host "[UPDATED] 5 Day Family Adventure -> family-safari.jpg" -ForegroundColor Green
                    $changesMade++
                    $updated = $true
                    break
                }
            }
            if ($updated) { break }
        }
    }
    
    if (-not $updated) {
        Write-Host "[WARNING] Could not update family-safari.jpg reference" -ForegroundColor Yellow
    }
}

# Update camping safari image if file exists
if ($campingExists) {
    $lines = Get-Content $toursFile
    $updated = $false
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        # Look for the budget/camping safari tour ID
        if ($lines[$i] -match 'id:\s*"5-day-budget-safari"') {
            # Search forward for imageUrl within next 20 lines
            for ($j = $i; $j -lt [Math]::Min($i + 20, $lines.Count); $j++) {
                if ($lines[$j] -match 'imageUrl:\s*"/images/safaris/default\.jpg"') {
                    $lines[$j] = '        imageUrl: "/images/safaris/camping-safari.jpg",'
                    Write-Host "[UPDATED] 5 Day Budget Safari -> camping-safari.jpg" -ForegroundColor Green
                    $changesMade++
                    $updated = $true
                    break
                }
            }
            if ($updated) { break }
        }
    }
    
    if (-not $updated) {
        Write-Host "[WARNING] Could not update camping-safari.jpg reference" -ForegroundColor Yellow
    }
}

# Save the file if changes were made
if ($changesMade -gt 0) {
    Write-Host ""
    Write-Host "Saving changes to tours.ts..." -ForegroundColor Yellow
    $lines | Set-Content $toursFile -NoNewline
    Write-Host "[SUCCESS] File updated!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Changes made: $changesMade" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Restart your dev server if it's running" -ForegroundColor Gray
    Write-Host "2. Visit the tour pages to verify images load" -ForegroundColor Gray
    Write-Host "3. Check browser console for any errors (F12)" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "[INFO] No changes needed - images may already be updated" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Update Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
