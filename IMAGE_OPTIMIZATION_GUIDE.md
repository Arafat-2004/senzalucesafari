# 📸 Senza Luce Safaris - Image Optimization Guide

## 🎯 **Quick Reference**

### **Image Specifications by Type**

| Image Type | Dimensions | Format | Max Size | Quality | Location |
|------------|-----------|--------|----------|---------|----------|
| **Hero Images** (Tours/Destinations) | 1920×1080px (16:9) | WebP | <300KB | 80-85% | `/public/images/safaris/` or `/destinations/` |
| **Gallery Images** | 1200×800px (3:2) | WebP | <200KB | 75-80% | `/public/images/destinations/` |
| **Blog Featured Images** | 1200×675px (16:9) | JPG/WebP | <250KB | 80% | `/public/images/blog/` |
| **Vehicle Images** | 1200×800px (3:2) | JPG | <200KB | 80% | `/public/images/vehicles/` |
| **Homepage/Lodge Images** | 1200×800px (3:2) | JPG | <200KB | 80% | `/public/images/general/` |

---

## 🛠️ **Step-by-Step Optimization Process**

### **Method 1: Online Tools (Easiest)**

#### **Option A: TinyPNG/TinyJPG** (Recommended for beginners)
1. Go to https://tinypng.com/
2. Drag and drop your image(s)
3. Download optimized version
4. Rename to match required filename
5. Place in correct folder

**Pros:** Super easy, batch processing, maintains quality  
**Cons:** Limited to 20 images/month free, outputs PNG/JPG (not WebP)

#### **Option B: Squoosh** (Best for WebP conversion)
1. Go to https://squoosh.app/
2. Upload your image
3. Choose WebP format
4. Adjust quality slider (aim for 80-85%)
5. Check file size (should be under limit)
6. Download optimized WebP

**Pros:** Free, unlimited, converts to WebP, real-time preview  
**Cons:** One image at a time

---

### **Method 2: Desktop Software**

#### **Adobe Photoshop**
1. Open image in Photoshop
2. `File > Export > Save for Web (Legacy)`
3. Choose format:
   - **WebP**: Select "WebP" from dropdown (requires plugin)
   - **JPG**: Select "JPEG", Quality: 80
4. Set dimensions: Image Size > Width: 1920px (height auto-adjusts)
5. Check file size (bottom left corner)
6. Save

**WebP Plugin Installation:**
- Download from: https://github.com/nickstewart/photo-shop-webp-plugin
- Install following instructions

#### **Affinity Photo** (One-time purchase, no subscription)
1. Open image
2. `File > Export`
3. Choose WebP or JPEG
4. Adjust quality slider
5. Export

---

### **Method 3: Command Line (For Developers)**

#### **Using ImageMagick**
```bash
# Install ImageMagick first: https://imagemagick.org/

# Convert JPG to WebP
magick input.jpg -quality 80 output.webp

# Resize and convert
magick input.jpg -resize 1920x1080 -quality 80 output.webp

# Batch convert all JPGs in folder
magick mogrify -format webp -quality 80 *.jpg
```

#### **Using cwebp (Google's WebP tool)**
```bash
# Install: https://developers.google.com/speed/webp/download

# Basic conversion
cwebp -q 80 input.jpg -o output.webp

# With resizing
cwebp -resize 1920 1080 -q 80 input.jpg -o output.webp

# Batch script (PowerShell)
Get-ChildItem *.jpg | ForEach-Object {
    cwebp -q 80 $_.FullName -o "$($_.BaseName).webp"
}
```

#### **Using Sharp (Node.js)**
```javascript
// Install: npm install sharp
const sharp = require('sharp');

// Single image
sharp('input.jpg')
  .resize(1920, 1080)
  .webp({ quality: 80 })
  .toFile('output.webp');

// Batch process
const fs = require('fs');
const path = require('path');

const inputDir = './images';
const outputDir = './optimized';

fs.readdirSync(inputDir).forEach(file => {
  if (file.endsWith('.jpg') || file.endsWith('.png')) {
    sharp(path.join(inputDir, file))
      .resize(1920, 1080, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, file.replace(/\.(jpg|png)$/, '.webp')));
  }
});
```

---

## ✅ **Quality Checklist**

Before uploading any image, verify:

### **Technical Requirements**
- [ ] Correct dimensions (check with right-click > Properties)
- [ ] File format matches requirement (WebP or JPG)
- [ ] File size under limit (check Properties > Size)
- [ ] Filename uses lowercase with hyphens (e.g., `family-safari.jpg`)
- [ ] No spaces or special characters in filename

### **Visual Quality**
- [ ] Image is sharp and clear (not pixelated)
- [ ] Colors look natural (not oversaturated)
- [ ] Subject is well-framed and centered
- [ ] Lighting is good (avoid harsh shadows or overexposure)
- [ ] No watermarks or copyright text

### **Content Relevance**
- [ ] Image matches the tour/destination theme
- [ ] Shows authentic Tanzania/African safari experience
- [ ] Professional appearance (no blurry or amateur shots)
- [ ] Appropriate for luxury safari brand (high-end feel)

---

## 📁 **File Organization**

### **Correct Folder Structure**
```
senzalucesafaris/public/images/
├── safaris/           ← Tour package hero images
│   ├── 5-days-wildlife.jpg
│   ├── northern-circuit.webp
│   └── family-safari.jpg  ← Upload here
│
├── destinations/      ← Destination pages (main + gallery)
│   ├── serengeti.jpg
│   ├── serengeti-lions.jpg
│   └── ngorongoro-rhino.jpg
│
├── blog/             ← Blog article featured images
│   ├── great-migration.jpg
│   └── luxury-lodges.jpg
│
├── vehicles/         ← Vehicle showcase images
│   ├── safari-minivan.jpg
│   └── land-cruiser-vx.jpg
│
├── general/          ← Homepage/lodge images
│   ├── luxury-lodge.jpg
│   └── planning-safari.jpg
│
└── footer/           ← Footer background
    └── footer-bg.jpg
```

### **Naming Convention**
✅ **Good:**
- `family-safari.jpg`
- `northern-circuit.webp`
- `serengeti-lions.jpg`
- `zanzibar-beach-holiday.webp`

❌ **Bad:**
- `Family Safari.jpg` (spaces, capitals)
- `IMG_1234.JPG` (generic name)
- `safari_image_final_v2.jpg` (underscores, version numbers)
- `photo (1).jpg` (parentheses, spaces)

---

## 🚀 **Upload Process**

### **Step 1: Prepare Your Image**
1. Optimize using one of the methods above
2. Verify it meets specifications
3. Name it correctly (lowercase, hyphens)

### **Step 2: Place in Correct Folder**
Copy/move the file to the appropriate folder:
```
Example: family-safari.jpg → senzalucesafaris/public/images/safaris/
```

### **Step 3: Update Code (If Needed)**
If this is replacing a placeholder or adding a new image:

**For Tours:** Edit `senzalucesafaris/src/data/tours.ts`
```typescript
// Find the tour and update imageUrl:
{
    id: "5-day-family-adventure",
    // ... other fields
    imageUrl: "/images/safaris/family-safari.jpg",  // ← Update this line
}
```

**For Destinations:** Edit `senzalucesafaris/src/data/destinations.ts`
```typescript
// Add to gallery array:
gallery: [
    "/images/destinations/serengeti.jpg",
    "/images/destinations/serengeti-lions.jpg",  // ← New image
    // ... more images
]
```

### **Step 4: Test**
1. Restart dev server: `npm run dev`
2. Visit the page in browser
3. Check browser console for errors (F12 > Console tab)
4. Verify image loads correctly on mobile and desktop

---

## 🔧 **Troubleshooting**

### **Problem: Image shows as broken/not loading**

**Check:**
1. ✅ File exists in correct folder
2. ✅ Filename matches exactly (case-sensitive!)
3. ✅ Path in code is correct
4. ✅ File isn't corrupted (try opening locally)

**Fix:**
```bash
# Verify file exists
Test-Path "public/images/safaris/family-safari.jpg"

# Should return: True
```

---

### **Problem: Image loads but looks blurry/pixelated**

**Cause:** Image dimensions too small

**Fix:**
- Ensure minimum 1920px width for hero images
- Don't upscale small images (find higher resolution original)
- Use AI upscaling tools if needed: https://letsenhance.io/

---

### **Problem: File size too large (>300KB)**

**Fix:**
1. Reduce quality setting (try 75% instead of 85%)
2. Resize to smaller dimensions
3. Use WebP instead of JPG (30% smaller typically)
4. Run through TinyPNG again

---

### **Problem: Colors look wrong/dull after optimization**

**Cause:** Color profile issue

**Fix:**
- Ensure sRGB color profile when saving
- In Photoshop: `Edit > Convert to Profile > sRGB IEC61966-2.1`
- Avoid Adobe RGB or ProPhoto RGB for web

---

## 💡 **Pro Tips**

### **For Best Results:**

1. **Start with high-quality originals**
   - Minimum 3000px wide for best results after compression
   - Shoot in RAW if possible, then export to JPG

2. **Use consistent color grading**
   - Warm tones (oranges, golds) match African safari theme
   - Slightly increase saturation for vibrancy
   - Maintain consistency across all images

3. **Crop strategically**
   - Hero images: Wide landscape (16:9 ratio)
   - Gallery images: Standard photo (3:2 ratio)
   - Keep main subject off-center (rule of thirds)

4. **Optimize for mobile**
   - Next.js automatically creates responsive versions
   - But ensure main image looks good when scaled down
   - Test on actual mobile device

5. **Batch process efficiently**
   - Optimize all images for one section at once
   - Use same settings for consistency
   - Create templates/presets in your software

---

## 📊 **Performance Impact**

### **Why Optimization Matters:**

| Metric | Unoptimized | Optimized | Improvement |
|--------|-------------|-----------|-------------|
| **File Size** | 2-5 MB | 150-300 KB | **90% smaller** |
| **Page Load Time** | 8-12 seconds | 2-3 seconds | **75% faster** |
| **Mobile Data Usage** | 15-20 MB/page | 3-5 MB/page | **80% less data** |
| **SEO Score** | 60/100 | 95/100 | **+35 points** |
| **Bounce Rate** | 45% | 25% | **-44%** |

**Bottom line:** Optimized images = happier visitors + better Google rankings!

---

## 🎨 **Image Sourcing Recommendations**

### **Free Stock Photo Sites:**
- **Unsplash** - https://unsplash.com (High quality, free)
- **Pexels** - https://pexels.com (Great variety, free)
- **Pixabay** - https://pixabay.com (Large library, free)

**Search Terms:**
- "Tanzania safari"
- "African wildlife"
- "Serengeti migration"
- "Safari vehicle game drive"
- "Luxury tented camp Africa"
- "Zanzibar beach"
- "Ngorongoro crater"

### **Paid Stock Photo Sites:**
- **Shutterstock** - https://shutterstock.com (Largest library)
- **Adobe Stock** - https://stock.adobe.com (High quality)
- **Getty Images** - https://gettyimages.com (Premium, expensive)

### **Professional Photography:**
**Best option for unique, branded content**

**Recommended photographers in Tanzania:**
- Contact local safari lodges - they often have photographers
- Hire freelance wildlife photographer on location
- Partner with tour guides who take professional photos

**Cost:** $500-2000 for full day shoot  
**Benefit:** Exclusive rights, perfect branding match

---

## 🔄 **Maintenance Schedule**

### **Monthly:**
- [ ] Review website performance (Google PageSpeed Insights)
- [ ] Check for any broken images
- [ ] Optimize any new images added

### **Quarterly:**
- [ ] Audit all images for consistency
- [ ] Replace any low-quality images
- [ ] Update seasonal images if needed

### **Annually:**
- [ ] Full image library review
- [ ] Consider professional photo shoot for fresh content
- [ ] Update any outdated imagery

---

## 📞 **Need Help?**

### **Quick Reference Commands:**

```powershell
# Check if file exists
Test-Path "public/images/safaris/filename.jpg"

# List all images in folder
Get-ChildItem "public/images/safaris/" | Select-Object Name, Length

# Find large files (>500KB)
Get-ChildItem "public/images/" -Recurse | Where-Object {$_.Length -gt 500KB} | Select-Object FullName, @{Name="Size(KB)";Expression={[math]::Round($_.Length/1KB,2)}}
```

```bash
# Convert all JPGs to WebP (using ImageMagick)
magick mogrify -format webp -quality 80 public/images/safaris/*.jpg

# Check file sizes
ls -lh public/images/safaris/
```

---

## ✨ **Final Checklist Before Launch**

Before going live with new images:

- [ ] All images optimized (correct size, format, quality)
- [ ] Filenames follow convention (lowercase, hyphens)
- [ ] Images placed in correct folders
- [ ] Code references updated (tours.ts or destinations.ts)
- [ ] Tested on desktop browser
- [ ] Tested on mobile device
- [ ] No console errors (F12 > Console)
- [ ] PageSpeed score >90 (https://pagespeed.web.dev/)
- [ ] All images have proper alt text in code
- [ ] Backup original high-res files stored safely

---

**🎉 You're now ready to add stunning images to your safari website!**

*Last updated: April 2026*
