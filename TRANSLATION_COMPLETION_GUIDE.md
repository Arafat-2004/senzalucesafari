# Senza Luce Safaris - Complete Translation Implementation Guide

## ✅ COMPLETED COMPONENTS (25+)

### Homepage (10 components)
- [x] Hero Section
- [x] Quick Info Cards
- [x] Stats Section
- [x] Experience Section
- [x] Final CTA Section
- [x] Safari Categories Section
- [x] Featured Tours Section
- [x] Destinations Section
- [x] Accommodations Section
- [x] FAQ Section

### Layout (2 components)
- [x] Header
- [x] Footer

### Pages (3 pages)
- [x] About Page
- [x] Contact Page
- [x] Homepage (page.tsx)

### Infrastructure
- [x] 5 Translation files (en, it, de, fr, es)
- [x] next-intl configuration
- [x] [locale] routing structure
- [x] Language switcher

---

## 📝 TRANSLATION PATTERN (Apply to ALL remaining components)

### Step 1: Add Imports
```typescript
import { useTranslations } from 'next-intl';
import { Link as I18nLink } from '@/i18n/navigation';
```

### Step 2: Initialize Translation Hook
```typescript
export function ComponentName() {
    const t = useTranslations();
    // ... rest of component
}
```

### Step 3: Replace Hardcoded Strings
```typescript
// BEFORE
<h2>Welcome to Safari</h2>
<Link href="/contact">Contact Us</Link>

// AFTER
<h2>{t('section.title')}</h2>
<I18nLink href="/contact">{t('common.contactUs')}</I18nLink>
```

### Step 4: Add Translation Keys to en.json
```json
{
  "section": {
    "title": "Welcome to Safari"
  }
}
```

### Step 5: Sync All Languages
```bash
python generate-translations.py
```

---

## 🎯 REMAINING COMPONENTS TO TRANSLATE

### Pages (Priority Order)
1. `/enquiry/page.tsx` - Enquiry form page
2. `/safaris-tours/page.tsx` - Tours listing
3. `/safaris-tours/[slug]/page.tsx` - Tour detail
4. `/destinations/page.tsx` - Destinations listing
5. `/destinations/[slug]/page.tsx` - Destination detail
6. `/vehicles/page.tsx` - Vehicles page
7. `/accommodations/page.tsx` - Accommodations page
8. `/blog/page.tsx` - Blog listing
9. `/blog/[slug]/page.tsx` - Blog detail
10. `/faq/page.tsx` - FAQ page
11. `/support/page.tsx` - Support page
12. `/privacy/page.tsx` - Privacy policy
13. `/terms/page.tsx` - Terms of service

### UI Components
1. `/components/ui/tour-card.tsx`
2. `/components/ui/destination-card.tsx`
3. `/components/ui/enquiry-form.tsx`
4. `/components/ui/hero-section.tsx`
5. `/components/ui/trust-badges.tsx`
6. `/components/ui/mobile-cta-bar.tsx`
7. `/components/ui/page-transition.tsx`
8. `/components/ui/smooth-scroll.tsx`
9. `/components/ui/scroll-animation.tsx`
10. All other UI components with hardcoded text

### Home Components
1. `/components/home/testimonials-section.tsx`
2. `/components/home/features-section.tsx`

---

## 🔑 TRANSLATION KEY STRUCTURE

```json
{
  "common": { ... },
  "navigation": { ... },
  "home": { ... },
  "about": { ... },
  "contact": { ... },
  "enquiry": { ... },
  "safarisTours": { ... },
  "destinations": { ... },
  "vehicles": { ... },
  "accommodations": { ... },
  "blog": { ... },
  "faq": { ... },
  "support": { ... },
  "privacy": { ... },
  "terms": { ... },
  "footer": { ... },
  "buttons": { ... },
  "forms": { ... }
}
```

---

## ⚡ QUICK COMMANDS

### Test Build
```bash
npm run build
```

### Run Dev Server
```bash
npm run dev
```

### Sync Translations
```bash
python generate-translations.py
```

### Test Specific Language
- English: http://localhost:3000/en
- Italian: http://localhost:3000/it
- German: http://localhost:3000/de
- French: http://localhost:3000/fr
- Spanish: http://localhost:3000/es

---

## 🎨 EXAMPLES

### Example 1: Simple Component
```typescript
// BEFORE
export function MyComponent() {
    return (
        <div>
            <h1>Hello World</h1>
            <p>This is a description</p>
        </div>
    );
}

// AFTER
import { useTranslations } from 'next-intl';

export function MyComponent() {
    const t = useTranslations();
    return (
        <div>
            <h1>{t('myComponent.title')}</h1>
            <p>{t('myComponent.description')}</p>
        </div>
    );
}
```

### Example 2: Component with Links
```typescript
// BEFORE
import Link from 'next/link';

export function MyComponent() {
    return (
        <Link href="/contact">Contact Us</Link>
    );
}

// AFTER
import { Link as I18nLink } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function MyComponent() {
    const t = useTranslations();
    return (
        <I18nLink href="/contact">{t('common.contactUs')}</I18nLink>
    );
}
```

### Example 3: Component with Dynamic Data
```typescript
// BEFORE
export function TourCard({ tour }) {
    return (
        <div>
            <h3>{tour.name}</h3>
            <p>{tour.description}</p>
            <button>Book Now</button>
        </div>
    );
}

// AFTER
import { useTranslations } from 'next-intl';
import { Link as I18nLink } from '@/i18n/navigation';

export function TourCard({ tour }) {
    const t = useTranslations();
    return (
        <div>
            <h3>{tour.name}</h3>
            <p>{tour.description}</p>
            <I18nLink href={`/safaris-tours/${tour.slug}`}>
                {t('buttons.bookNow')}
            </I18nLink>
        </div>
    );
}
```

---

## ✅ QUALITY CHECKLIST

For each component:
- [ ] Added `useTranslations` import
- [ ] Added `Link as I18nLink` import (if using links)
- [ ] Called `const t = useTranslations()`
- [ ] Replaced ALL hardcoded strings with `t('key.path')`
- [ ] Changed `Link` to `I18nLink` for internal navigation
- [ ] Added translation keys to `messages/en.json`
- [ ] Ran `python generate-translations.py` to sync
- [ ] Tested in browser with different languages
- [ ] No console errors
- [ ] Build passes (`npm run build`)

---

## 🚀 PRODUCTION DEPLOYMENT

1. Ensure all components are translated
2. Run final build: `npm run build`
3. Test all 5 languages
4. Verify SEO (hreflang tags, sitemap)
5. Deploy to production

---

## 📊 CURRENT STATUS

- ✅ Translation Infrastructure: 100% Complete
- ✅ Homepage: 100% Complete
- ✅ About Page: 100% Complete
- ✅ Contact Page: 100% Complete
- ✅ Header & Footer: 100% Complete
- ⏳ Remaining Pages: ~13 pages
- ⏳ Remaining Components: ~20 components
- ⏳ UI Components: ~10 components

**Overall Progress: ~40% Complete**

---

## 💡 TIPS FOR FAST COMPLETION

1. **Work in batches** - Translate all pages first, then components
2. **Use find & replace** - Replace `Link` with `I18nLink` globally
3. **Copy pattern** - Use completed components as templates
4. **Test frequently** - Build after every 3-5 components
5. **Sync translations** - Run generate-translations.py after updating en.json

---

**Generated:** 2025-04-06
**Status:** In Progress - Option A (Full Completion)
