# Multi-Language Quick Start Guide

## 🚀 Quick Implementation (5 Steps)

### Step 1: Create i18n Configuration

**File: `src/i18n/navigation.ts`**
```typescript
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'it', 'de', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

**File: `src/i18n/request.ts`**
```typescript
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './navigation';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

### Step 2: Create Middleware

**File: `src/middleware.ts`**
```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/navigation';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)', '/(en|it|de|fr)/:path*']
};
```

### Step 3: Update next.config.ts

```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // your config
};

export default withNextIntl(nextConfig);
```

### Step 4: Update Layout

**File: `src/app/layout.tsx`**
```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Step 5: Create Translation Files

**File: `messages/en.json`**
```json
{
  "navigation": {
    "home": "Home",
    "about": "About Us",
    "safarisTours": "Safari & Tours",
    "destinations": "Destinations",
    "contact": "Contact Us"
  },
  "home": {
    "hero": {
      "title": "Experience the Magic of Tanzania",
      "subtitle": "Discover breathtaking wildlife and unforgettable safari adventures",
      "cta": "Inquire Now"
    }
  }
}
```

**File: `messages/it.json`**
```json
{
  "navigation": {
    "home": "Home",
    "about": "Chi Siamo",
    "safarisTours": "Safari & Tour",
    "destinations": "Destinazioni",
    "contact": "Contattaci"
  },
  "home": {
    "hero": {
      "title": "Vivi la Magia della Tanzania",
      "subtitle": "Scopri una fauna mozzafiato e indimenticabili avventure safari",
      "cta": "Richiedi Informazioni"
    }
  }
}
```

## 📖 Usage

### In Client Components
```typescript
"use client";
import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('home.hero');
  
  return (
    <section>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <button>{t('cta')}</button>
    </section>
  );
}
```

### In Server Components
```typescript
import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const t = await getTranslations('navigation');
  
  return (
    <nav>
      <a href="/about">{t('about')}</a>
      <a href="/contact">{t('contact')}</a>
    </nav>
  );
}
```

### Language Switcher
```typescript
"use client";
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <select value={locale} onChange={(e) => switchLanguage(e.target.value)}>
      <option value="en">🇬🇧 English</option>
      <option value="it">🇮🇹 Italiano</option>
      <option value="de">🇩🇪 Deutsch</option>
      <option value="fr">🇫🇷 Français</option>
    </select>
  );
}
```

## 🌐 URLs After Implementation

- `/` → Redirects to `/en` or browser locale
- `/en/safaris-tours` → English
- `/it/safaris-tours` → Italian
- `/de/safaris-tours` → German
- `/fr/safaris-tours` → French

## ✅ Checklist

- [ ] Install next-intl (already done: v4.9.0)
- [ ] Create `src/i18n/navigation.ts`
- [ ] Create `src/i18n/request.ts`
- [ ] Create `src/middleware.ts`
- [ ] Update `next.config.ts`
- [ ] Update `src/app/layout.tsx`
- [ ] Create `messages/en.json`
- [ ] Create `messages/it.json`
- [ ] Create `messages/de.json`
- [ ] Create `messages/fr.json`
- [ ] Create language switcher component
- [ ] Update all components to use translations
- [ ] Test all languages
- [ ] Deploy

## 📚 Full Documentation

See `MULTILANGUAGE_SUPPORT_GUIDE.md` for complete documentation including:
- Detailed configuration
- All translation files
- SEO optimization
- Performance tips
- Troubleshooting guide
- Best practices

---

**Time to Implement:** ~2-3 hours for basic setup
**Languages:** English, Italian, German, French (expandable)
**Package:** next-intl v4.9.0 (already installed)
