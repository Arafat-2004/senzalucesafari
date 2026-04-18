# 🚀 Quick Start: Update Placeholder Tour Images

## Current Status

You have **2 tour packages** using placeholder images (`default.jpg`):

1. **5 Day Family Adventure** - Currently shows generic image
2. **5 Day Budget Safari** - Currently shows generic image

---

## Option 1: Automated Update (Recommended) ⭐

### **Step 1: Upload Your Images**

Place these 2 files in the correct folder:

```
senzalucesafaris/public/images/safaris/family-safari.jpg
senzalucesafaris/public/images/safaris/camping-safari.jpg
```

**Image Requirements:**
- Dimensions: 1920×1080px (or similar 16:9 ratio)
- Format: JPG or WebP
- Max size: 300KB
- Quality: Professional safari photography

**Suggested Content:**
- **family-safari.jpg**: Happy family in safari vehicle, kids smiling, wildlife visible
- **camping-safari.jpg**: Authentic tented camp under stars, bush camping setup

---

### **Step 2: Run the Update Script**

Open PowerShell in the project folder and run:

```powershell
cd senzalucesafaris
.\update-tour-images.ps1
```

**What it does:**
- ✅ Checks if your images exist
- ✅ Automatically updates `tours.ts` file
- ✅ Replaces `default.jpg` references with your new images
- ✅ Shows success/error messages

**Expected Output:**
```
========================================
  Senza Luce Safaris - Image Updater
========================================

Checking for uploaded images...

[OK] family-safari.jpg found!
[OK] camping-safari.jpg found!

Reading tours.ts...
[UPDATED] 5 Day Family Adventure -> family-safari.jpg
[UPDATED] 5 Day Budget Safari -> camping-safari.jpg

Saving changes to tours.ts...
[SUCCESS] File updated!

Changes made: 2

Next steps:
1. Restart your dev server if it's running
2. Visit the tour pages to verify images load
3. Check browser console for any errors (F12)

========================================
  Update Complete!
========================================
```

---

### **Step 3: Verify**

1. **Restart dev server** (if running):
   ```powershell
   # Press Ctrl+C to stop current server
   npm run dev
   ```

2. **Visit the tour pages:**
   - http://localhost:3000/safaris-tours/5-day-family-adventure
   - http://localhost:3000/safaris-tours/5-day-budget-safari

3. **Check that images load correctly**

4. **Test on mobile** - Open browser DevTools (F12) > Toggle device toolbar

---

## Option 2: Manual Update

If you prefer to do it manually:

### **Step 1: Upload Images**
Same as above - place files in `public/images/safaris/`

### **Step 2: Edit tours.ts**

Open: `senzalucesafaris/src/data/tours.ts`

**Find the Family Adventure tour** (around line ~420):
```typescript
{
    id: "5-day-family-adventure",
    name: "5 Days Family Adventure Safari - Kid-Friendly Wildlife Experience",
    // ... other fields
    imageUrl: "/images/safaris/default.jpg",  // ← CHANGE THIS LINE
    destinations: ["tarangire", "ngorongoro", "serengeti"]
},
```

**Change to:**
```typescript
imageUrl: "/images/safaris/family-safari.jpg",  // ← Updated!
```

**Find the Budget Safari tour** (around line ~620):
```typescript
{
    id: "5-day-budget-safari",
    name: "5 Days Budget Camping Safari - Affordable Wilderness Experience",
    // ... other fields
    imageUrl: "/images/safaris/default.jpg",  // ← CHANGE THIS LINE
    destinations: ["tarangire", "lake-manyara", "serengeti"]
},
```

**Change to:**
```typescript
imageUrl: "/images/safaris/camping-safari.jpg",  // ← Updated!
```

### **Step 3: Save & Test**
Save the file and refresh your browser.

---

## Troubleshooting

### **Problem: Script says "MISSING" for images**

**Solution:**
- Verify filenames are EXACTLY: `family-safari.jpg` and `camping-safari.jpg`
- Check they're in the right folder: `senzalucesafaris/public/images/safaris/`
- Use this command to verify:
  ```powershell
  Test-Path "public\images\safaris\family-safari.jpg"
  Test-Path "public\images\safaris\camping-safari.jpg"
  ```
  Should return: `True` for both

---

### **Problem: Images don't load after update**

**Solution:**
1. Hard refresh browser: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Check browser console (F12) for errors
4. Verify file exists:
   ```powershell
   Get-ChildItem "public\images\safaris\" | Select-Object Name
   ```

---

### **Problem: Script won't run (execution policy error)**

**Solution:**
Run this command first to allow script execution:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\update-tour-images.ps1
```

Or run with bypass flag:
```powershell
PowerShell -ExecutionPolicy Bypass -File .\update-tour-images.ps1
```

---

## What Happens After Update?

✅ **Before:** Tours show generic `default.jpg` placeholder  
✅ **After:** Tours show your custom `family-safari.jpg` and `camping-safari.jpg`

**Result:**
- More professional appearance
- Better matches tour theme
- Improved conversion rates
- Unique branding (not generic stock photo)

---

## Need Help Choosing Images?

### **For Family Safari:**
Look for photos showing:
- 👨‍👩‍👧‍👦 Families with children in safari vehicles
- 😊 Smiling faces, excited expressions
- 🦁 Wildlife visible in background (lions, elephants, giraffes)
- 🚙 Modern safari vehicle (Land Cruiser or similar)
- ☀️ Good lighting, golden hour preferred

**Search terms:**
- "family safari Tanzania"
- "kids wildlife safari Africa"
- "family game drive Serengeti"

---

### **For Camping Safari:**
Look for photos showing:
- ⛺ Tented camp setup (authentic bush camping)
- 🌟 Night sky with stars (if possible)
- 🔥 Campfire or lanterns
- 🏕️ Multiple tents arranged nicely
- 🌅 Sunset or sunrise lighting

**Search terms:**
- "luxury camping safari Tanzania"
- "tented camp Serengeti"
- "bush camping Africa"
- "mobile camping safari"

---

## Free Image Sources

If you need to find images:

### **Unsplash** (Free, high quality)
- https://unsplash.com/s/photos/family-safari
- https://unsplash.com/s/photos/camping-safari-africa

### **Pexels** (Free, good variety)
- https://pexels.com/search/family%20safari/
- https://pexels.com/search/african%20camping/

### **Pixabay** (Free, large library)
- https://pixabay.com/images/search/safari%20family/
- https://pixabay.com/images/search/camping%20africa/

**⚠️ Important:** Always check license terms. Most free sites allow commercial use, but verify before using.

---

## Pro Tips

💡 **Best Practices:**
1. **Use consistent style** - Both images should match your brand aesthetic
2. **Show authentic experiences** - Real Tanzania/Africa, not generic African photos
3. **High resolution originals** - Start with 3000px+ wide, then optimize down
4. **Optimize before uploading** - Use tools from IMAGE_OPTIMIZATION_GUIDE.md
5. **Test on multiple devices** - Ensure images look good on phone, tablet, desktop

💡 **Conversion Optimization:**
- Images with people convert better than wildlife-only shots
- Show the EXPERIENCE, not just the location
- Emotional connection (smiles, excitement) drives bookings
- Authenticity beats perfection

---

## Next Steps After Update

Once you've updated these 2 images:

1. ✅ **Your website is 100% complete** - All tours have unique images!
2. 📊 **Monitor performance** - Check Google Analytics for engagement
3. 🔄 **Regular updates** - Consider seasonal image rotations
4. 📸 **Professional shoot** - Plan a photo shoot for even better content
5. 🎯 **A/B testing** - Test different images to see what converts best

---

## Questions?

Refer to:
- 📖 **IMAGE_OPTIMIZATION_GUIDE.md** - Complete optimization instructions
- 📖 **README.md** - General project documentation
- 💻 **Browser Console (F12)** - Check for any errors

---

**🎉 Ready to make your safari website perfect!**

*Just upload 2 images and run the script - that's it!*
