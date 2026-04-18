# 🚀 Quick Reference Guide - Senza Luce Safaris

## **COLOR SYSTEM AT A GLANCE**

### **Primary Colors:**
- 🟢 **Green (Primary):** `oklch(0.6 0.18 145)` - Use for trust/actions
- 🟠 **Orange (Secondary):** `oklch(0.7 0.18 45)` - Use for energy/exploration
- 🟡 **Golden (Accent):** `oklch(0.72 0.17 50)` - Use for highlights

### **When to Use Which Color:**

| Action Type | Color | Example |
|------------|-------|---------|
| Main CTA (Book/Inquire) | 🟢 Green | "Plan Your Safari" button |
| Secondary CTA (Explore) | 🟠 Orange | "View Tours" button |
| Navigation Active | 🟢 Green | Current page link |
| Badges/Tags | 🟠 Orange | Price tags, "Popular" labels |
| Icons | 🟢 Green | Feature icons |
| Hover States | Darker shade | Button hover effects |

---

## **ACCESSING YOUR WEBSITE**

### **Development Server:**
```
http://localhost:3000
```

### **All Available Routes:**

**English (Default):**
- Home: `/` or `/en`
- About: `/about` or `/en/about`
- Contact: `/contact` or `/en/contact`
- Destinations: `/destinations` or `/en/destinations`
- Tours: `/safaris-tours` or `/en/safaris-tours`

**Other Languages:**
- Swahili: `/sw`, `/sw/about`, `/sw/contact`, etc.
- French: `/fr`, `/fr/about`, `/fr/contact`, etc.
- German: `/de`, `/de/about`, `/de/contact`, etc.
- Spanish: `/es`, `/es/about`, `/es/contact`, etc.

---

## **LANGUAGE SWITCHER USAGE**

### **How It Works:**
1. Click the globe icon 🌐 in the header
2. Select desired language from dropdown
3. Page automatically navigates to translated version
4. Checkmark ✓ shows current language

### **Example Flow:**
```
Current: /en/contact
Click "Swahili" → Navigate to: /sw/contact
Content changes to Swahili translation
URL updates automatically
```

---

## **BUTTON STYLES**

### **Primary Button (Green):**
```tsx
<Button className="bg-primary hover:bg-primary/90">
    Main Action
</Button>
```

### **Secondary Button (Orange):**
```tsx
<Button className="bg-secondary hover:bg-secondary/90">
    Secondary Action
</Button>
```

### **Outline Button:**
```tsx
<Button variant="outline">
    Tertiary Action
</Button>
```

---

## **COMMON TASKS**

### **Add a New Page:**
1. Create file: `src/app/[locale]/your-page/page.tsx`
2. Add metadata and content
3. Update navigation in `header.tsx`
4. Add translations to `messages/*.json` files

### **Change Colors:**
Edit `src/app/globals.css`:
```css
:root {
  --primary: oklch(0.6 0.18 145);    /* Change green */
  --secondary: oklch(0.7 0.18 45);   /* Change orange */
}
```

### **Add Translation:**
1. Open `messages/en.json` (or other locale)
2. Add key-value pair:
   ```json
   {
     "newKey": "New Text Here"
   }
   ```
3. Use in component:
   ```tsx
   const t = useTranslations('namespace');
   <p>{t('newKey')}</p>
   ```

---

## **TROUBLESHOOTING**

### **Page Shows 404:**
1. Check URL has locale prefix (`/en/...`)
2. Clear `.next` folder: `Remove-Item -Recurse -Force .next`
3. Restart dev server: `npm run dev`

### **Language Not Changing:**
1. Check console for errors
2. Verify middleware is running
3. Ensure i18n plugin in `next.config.ts`

### **Colors Not Updating:**
1. Hard refresh browser: `Ctrl + Shift + R`
2. Clear browser cache
3. Restart dev server

### **Build Errors:**
1. Run: `npm run build`
2. Fix any TypeScript errors shown
3. Run: `npm run lint` to check code quality

---

## **FILE LOCATIONS**

### **Key Files:**
```
📁 senzalucesafaris/
├── 📄 next.config.ts          # Next.js configuration
├── 📄 i18n.ts                 # Internationalization setup
├── 📄 middleware.ts           # Route middleware
│
├── 📁 src/app/
│   ├── 📄 globals.css         # Global styles & colors
│   └── 📁 [locale]/           # All pages with i18n
│       ├── 📄 layout.tsx      # Locale wrapper
│       ├── 📄 page.tsx        # Home page
│       ├── 📁 about/
│       ├── 📁 contact/
│       ├── 📁 destinations/
│       └── 📁 safaris-tours/
│
├── 📁 src/components/
│   ├── 📁 home/               # Home page sections
│   │   └── hero-section.tsx   # Video hero
│   ├── 📁 layout/             # Header, Footer
│   └── 📁 ui/                 # Reusable components
│       └── language-switcher.tsx
│
├── 📁 messages/               # Translation files
│   ├── en.json
│   ├── sw.json
│   ├── fr.json
│   ├── de.json
│   └── es.json
│
└── 📁 public/videos/          # Media assets
    └── hero-video.mp4         # Background video
```

---

## **PERFORMANCE TIPS**

### **Optimize Images:**
- Use WebP format when possible
- Compress images before upload
- Use Next.js `<Image />` component

### **Fast Loading:**
- Static pages pre-rendered at build time
- Dynamic routes use SSG
- Video is muted autoplay (browser-friendly)

### **SEO Best Practices:**
- Each page has unique metadata
- Proper heading hierarchy (H1, H2, H3)
- Alt text on all images
- Semantic HTML structure

---

## **DEPLOYMENT CHECKLIST**

Before going live:

- [ ] Set environment variables (if needed)
- [ ] Configure domain DNS
- [ ] Install SSL certificate (HTTPS)
- [ ] Connect contact form backend
- [ ] Add Google Analytics
- [ ] Test all forms submit correctly
- [ ] Verify all links work
- [ ] Test on multiple devices
- [ ] Check console for errors
- [ ] Run production build: `npm run build`

---

## **CONTACT & SUPPORT**

### **Documentation Files:**
1. `FINAL_SUMMARY_ALL_TASKS_COMPLETE.md` - Complete project overview
2. `COLOR_STRATEGY_AND_FIXES.md` - Color system details
3. `TRANSFORMATION_COMPLETE.md` - Design transformation report
4. `PAGES_LOADING_STATUS.md` - Page verification results
5. `QUICK_REFERENCE.md` - This file!

### **Common Commands:**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Clear cache and restart
Remove-Item -Recurse -Force .next; npm run dev
```

---

**Last Updated:** April 4, 2026  
**Status:** ✅ Production Ready  
**Website:** http://localhost:3000

---

## 💡 **PRO TIPS**

1. **Always test on mobile** - 60%+ of users browse on phones
2. **Use browser DevTools** - Inspect elements, check console
3. **Keep translations updated** - All 5 languages need maintenance
4. **Monitor performance** - Use Lighthouse audits regularly
5. **Backup before major changes** - Git commits are your friend!

**Happy coding! 🦁✨**
