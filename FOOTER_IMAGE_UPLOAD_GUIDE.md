# Footer Background Image - Upload Guide 📤

## 📁 **Your Dedicated Footer Image Folder**

I've created a special folder just for your footer background image:

```
senzalucesafaris/public/images/footer/
```

---

## 🎯 **How to Upload Your Image**

### **Step 1: Prepare Your Image**

**Recommended Specifications:**
- **Format:** JPG or PNG
- **Dimensions:** At least 1920px wide (for desktop)
- **File Size:** Under 2MB (for fast loading)
- **Aspect Ratio:** Landscape (16:9 works great)
- **Quality:** High resolution but optimized

**Example filenames:**
- `footer-bg.jpg`
- `footer-background.png`
- `my-footer-image.jpg`

---

### **Step 2: Copy Your Image**

Copy your image file to this location:

```
C:\Users\arafa\Desktop\safarisSenza\senzalucesafaris\public\images\footer\
```

**The footer is currently configured to look for:**
```
footer-bg.jpg
```

So name your file `footer-bg.jpg` OR tell me the exact filename you use, and I'll update the code.

---

### **Step 3: Verify It Works**

After copying your image:

1. **Start/restart the dev server:**
   ```bash
   npm run dev
   ```

2. **Open your browser** and navigate to any page

3. **Scroll to the bottom** - you should see your custom footer background!

---

## 🖼️ **Current Configuration**

**Footer Component:** `src/components/layout/footer.tsx`  
**Image Path:** `/images/footer/footer-bg.jpg`  
**Overlay:** Dark gradient (75%-95% black) for text readability  
**Behavior:** Fixed - same image on all pages

---

## 💡 **Tips for Best Results**

### ✅ **Good Footer Backgrounds:**
- Safari landscapes (savanna, mountains, sunset)
- Wildlife silhouettes
- African textures or patterns
- Subtle nature scenes
- Dark or moody images (work better with overlay)

### ❌ **Avoid:**
- Very bright images (may reduce text contrast)
- Busy/cluttered patterns (distracting)
- Low resolution images (will look pixelated)
- Portrait orientation (footer is wide)

---

## 🔧 **If You Use a Different Filename**

If you name your image something other than `footer-bg.jpg`, just tell me the exact filename and I'll update the footer component.

**Example:**
- You upload: `sunset-safari.jpg`
- I'll update the code to use: `/images/footer/sunset-safari.jpg`

---

## 🎨 **Adjusting the Overlay (Optional)**

If your image needs more or less darkness for better text visibility, I can adjust the overlay opacity.

**Current overlay:**
```css
bg-gradient-to-t from-black/95 via-black/85 to-black/75
```

**Options:**
- **Darker:** `from-black/98 via-black/92 to-black/85`
- **Lighter:** `from-black/85 via-black/75 to-black/65`

Just let me know if you want it adjusted!

---

## 📋 **Quick Checklist**

- [ ] Image prepared (JPG/PNG, 1920px+ wide, <2MB)
- [ ] Image copied to: `public/images/footer/`
- [ ] Image named: `footer-bg.jpg` (or tell me the name)
- [ ] Dev server restarted
- [ ] Footer displays correctly on all pages
- [ ] Text is readable over the background

---

## 🆘 **Need Help?**

If you have any issues:
1. Tell me the exact filename of your image
2. Describe any problems you're seeing
3. I'll help troubleshoot and fix it!

---

**Ready when you are!** Just copy your image to the folder and let me know the filename. 🚀
