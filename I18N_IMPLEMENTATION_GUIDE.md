# Multi-Language Implementation Guide for Senza Luce Safaris

## ✅ What's Been Implemented

### 1. Core i18n Infrastructure
- ✅ **next-intl** library installed
- ✅ Configuration files created (`i18n.ts`, `i18n/config.ts`)
- ✅ Middleware for locale detection (`middleware.ts`)
- ✅ Translation files for English, Swahili, and French
- ✅ Language switcher component

### 2. Supported Languages
- 🇬🇧 **English (en)** - Default
- 🇹🇿 **Swahili (sw)** - Kiswahili
- 🇫🇷 **French (fr)** - Français
- 🇩🇪 **German (de)** - Deutsch (structure ready)
- 🇪🇸 **Spanish (es)** - Español (structure ready)

### 3. URL Structure
The website will use locale prefixes in URLs:
- `/` or `/en` → English
- `/sw` → Swahili  
- `/fr` → French
- `/de` → German
- `/es` → Spanish

## 📋 Steps to Complete Full Implementation

### Step 1: Update Root Layout for i18n

Create `[locale]` folder structure:
```
src/app/
├── [locale]/
│   ├── layout.tsx (new - wraps with NextIntlClientProvider)
│   ├── page.tsx (move current home page here)
│   ├── about/
│   ├── contact/
│   ├── destinations/
│   └── safaris-tours/
```

### Step 2: Create Locale-Aware Layout

File: `src/app/[locale]/layout.tsx`
```tsx
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { locales } from '../../../i18n/config';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) notFound();
  
  const messages = await getMessages();
  
  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

### Step 3: Update All Components to Use Translations

Example for Header component:
```tsx
import { useTranslations } from 'next-intl';

export function Header() {
  const t = useTranslations('navigation');
  
  return (
    <nav>
      <Link href="/">{t('home')}</Link>
      <Link href="/destinations">{t('destinations')}</Link>
      {/* ... */}
    </nav>
  );
}
```

### Step 4: Add Language Switcher to Header

In `src/components/layout/header.tsx`:
```tsx
import { LanguageSwitcher } from '@/components/ui/language-switcher';

// Add inside header navigation
<div className="flex items-center gap-4">
  <LanguageSwitcher />
  {/* ... other nav items */}
</div>
```

### Step 5: Update Contact Page (Already Has Structure)

The contact page needs translation hooks added:
```tsx
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('contact');
  
  return (
    <h1>{t('hero_title')}</h1>
    // ... rest of translated content
  );
}
```

### Step 6: Complete Remaining Translations

Create translation files for:
- `messages/de.json` - German
- `messages/es.json` - Spanish

### Step 7: Test All Pages

Visit each page with different locales:
- http://localhost:3000/en/contact
- http://localhost:3000/sw/contact
- http://localhost:3000/fr/contact

## 🎯 Benefits of This Implementation

1. **SEO Friendly**: Each language has its own URL
2. **Automatic Detection**: Middleware detects browser language
3. **Easy to Extend**: Add new languages by creating JSON file
4. **Type Safe**: TypeScript ensures translation keys exist
5. **Performance**: Only loads translations for current locale
6. **User Experience**: Language persists across navigation

## 🔧 Technical Details

### How It Works:
1. User visits site → Middleware detects/preferred language
2. Routes to appropriate locale prefix (`/sw`, `/fr`, etc.)
3. Loads corresponding JSON translation file
4. Components use `useTranslations()` hook to display text
5. Language switcher allows manual override

### Place Names Stay Original:
- "Serengeti National Park" stays as is (proper noun)
- "Ngorongoro Crater" stays as is
- Only UI elements get translated

## 📝 Quick Reference Commands

```bash
# Install dependencies (already done)
npm install next-intl

# Run development server
npm run dev

# Build for production
npm run build
```

## 🚀 Next Steps Priority

1. **HIGH**: Move pages into `[locale]` folder structure
2. **HIGH**: Add translations to all UI components  
3. **MEDIUM**: Create German and Spanish translation files
4. **MEDIUM**: Test all pages in all languages
5. **LOW**: Add language preference cookie/localStorage

## 💡 Pro Tips

- Use translation keys consistently (e.g., `navigation.home`)
- Keep translation files organized by section
- Test with real users who speak each language
- Consider RTL support if adding Arabic/Hebrew later
- Monitor which languages users actually select

---

**Status**: Infrastructure Complete - Ready for Component Integration
**Estimated Time to Full Implementation**: 4-6 hours
**Complexity**: Medium (requires systematic updates to all components)
