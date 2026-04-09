# Multi-Language Support Implementation Guide

## Overview

This guide provides complete instructions for implementing multi-language support (i18n) in the Senza Luce Safaris website using `next-intl` (v4.9.0).

---

## 📋 Table of Contents

1. [Current Status](#current-status)
2. [Architecture Overview](#architecture-overview)
3. [Installation & Setup](#installation--setup)
4. [Configuration Files](#configuration-files)
5. [Message Files Structure](#message-files-structure)
6. [Implementation Steps](#implementation-steps)
7. [Language Switcher Component](#language-switcher-component)
8. [Usage Examples](#usage-examples)
9. [Dynamic Routes & SEO](#dynamic-routes--seo)
10. [Performance Optimization](#performance-optimization)
11. [Testing](#testing)
12. [Deployment](#deployment)
13. [Troubleshooting](#troubleshooting)
14. [Best Practices](#best-practices)

---

## 🎯 Current Status

**Installed Package:**
- ✅ `next-intl`: ^4.9.0 (already in package.json)

**Current State:**
- ❌ No i18n configuration files created
- ❌ No message/translation files
- ❌ No middleware for locale detection
- ❌ No language switcher component
- ❌ Website is English-only currently

**Target Languages:**
- 🇬🇧 English (en) - Default
- 🇮🇹 Italian (it) - Primary target (Senza Luce = Italian)
- 🇩🇪 German (de) - Safari tourists
- 🇫🇷 French (fr) - Safari tourists
- 🇪🇸 Spanish (es) - Optional

---

## 🏗️ Architecture Overview

### Routing Strategy: **Sub-path Routing**

```
Without locale:  /safaris-tours (redirects to default locale)
With locale:     /en/safaris-tours
                 /it/safaris-tours
                 /de/safaris-tours
                 /fr/safaris-tours
```

### Benefits:
- ✅ SEO-friendly (each locale has unique URLs)
- ✅ Easy to implement with Next.js App Router
- ✅ Clear language indication in URL
- ✅ Works well with static site generation

---

## 🚀 Installation & Setup

### Step 1: Verify Installation

The package is already installed. Verify it:

```bash
cd senzalucesafaris
npm list next-intl
```

Expected output: `next-intl@4.9.0`

### Step 2: Create Configuration Files

Create the following files in order:

1. `src/i18n/request.ts` - Request configuration
2. `src/i18n/navigation.ts` - Navigation helpers
3. `src/middleware.ts` - Locale detection middleware
4. `messages/en.json` - English translations
5. `messages/it.json` - Italian translations
6. `messages/de.json` - German translations
7. `messages/fr.json` - French translations

---

## ⚙️ Configuration Files

### 1. Create `src/i18n/request.ts`

```typescript
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './navigation';

export default getRequestConfig(async ({ requestLocale }) => {
  // Determine the requested locale
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

### 2. Create `src/i18n/navigation.ts`

```typescript
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // List of supported locales
  locales: ['en', 'it', 'de', 'fr', 'es'],
  
  // Default locale (English)
  defaultLocale: 'en',
  
  // Prefix the default locale (optional, set to 'always' to always show /en/)
  localePrefix: 'as-needed',
  
  // Fallback if locale detection fails
  localesPriority: ['en', 'it', 'de', 'fr', 'es']
});

// Lightweight wrappers around Next.js navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

### 3. Create `src/middleware.ts`

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/navigation';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized routes
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    
    // Enable redirects for all pages
    '/((?!api|_next|_vercel|.*\\..*).*)',
    
    // Enable redirects for static files
    '/(en|it|de|fr|es)/:path*'
  ]
};
```

### 4. Update `next.config.ts`

```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Your existing config
  images: {
    remotePatterns: [
      // Your existing image config
    ],
  },
};

export default withNextIntl(nextConfig);
```

---

## 📝 Message Files Structure

### Directory Structure

```
senzalucesafaris/
├── messages/
│   ├── en.json          # English (default)
│   ├── it.json          # Italian
│   ├── de.json          # German
│   ├── fr.json          # French
│   └── es.json          # Spanish (optional)
└── src/
    ├── i18n/
    │   ├── request.ts
    │   └── navigation.ts
    └── middleware.ts
```

### Message File Format

#### `messages/en.json` (English - Default)

```json
{
  "common": {
    "appName": "Senza Luce Safaris",
    "tagline": "Explore Tanzania Like Never Before",
    "language": "Language",
    "loading": "Loading...",
    "error": "Something went wrong",
    "backToHome": "Back to Home",
    "readMore": "Read More",
    "viewAll": "View All",
    "contactUs": "Contact Us",
    "bookNow": "Book Now",
    "inquireNow": "Inquire Now",
    "learnMore": "Learn More"
  },
  "navigation": {
    "home": "Home",
    "about": "About Us",
    "safarisTours": "Safari & Tours",
    "destinations": "Destinations",
    "blog": "Blog & News",
    "contact": "Contact Us",
    "vehicles": "Our Vehicles",
    "faq": "FAQ"
  },
  "home": {
    "hero": {
      "title": "Experience the Magic of Tanzania",
      "subtitle": "Discover breathtaking wildlife, pristine landscapes, and unforgettable safari adventures with expert local guides",
      "cta": "Inquire Now"
    },
    "featuredSafaris": "Featured Safaris",
    "curatedExperiences": "Curated Safari Experiences",
    "experienceDescription": "Discover our most sought-after safari experiences crafted for discerning travelers",
    "viewAllPackages": "View All Packages",
    "stats": {
      "happyTravelers": "Happy Travelers",
      "safariPackages": "Safari Packages",
      "destinations": "Destinations",
      "yearsExperience": "Years Experience"
    },
    "quickInfo": {
      "greatValue": {
        "title": "Great Value Deals",
        "description": "Best prices guaranteed"
      },
      "wildlife": {
        "title": "Wildlife Encounters",
        "description": "Big 5 & beyond"
      },
      "flexible": {
        "title": "Flexible Timing",
        "description": "Travel when you want"
      },
      "eco": {
        "title": "Eco & Ethical",
        "description": "Sustainable tourism"
      }
    }
  },
  "footer": {
    "description": "Comfortable, authentic, and unforgettable safari experiences across Tanzania.",
    "quickLinks": "Quick Links",
    "destinations": "Destinations",
    "contactInfo": "Contact Info",
    "newsletter": "Newsletter",
    "newsletterDescription": "Subscribe for safari updates and exclusive offers",
    "subscribe": "Subscribe",
    "copyright": "All rights reserved",
    "privacyPolicy": "Privacy Policy",
    "termsOfService": "Terms of Service"
  },
  "buttons": {
    "explorePackages": "Explore Packages",
    "startPlanning": "Start Planning",
    "sendEnquiry": "Send Enquiry",
    "viewDetails": "View Details",
    "bookThisSafari": "Book This Safari"
  },
  "forms": {
    "name": "Full Name",
    "email": "Email Address",
    "phone": "Phone Number",
    "message": "Your Message",
    "travelDates": "Travel Dates",
    "numberOfTravelers": "Number of Travelers",
    "submit": "Submit",
    "sending": "Sending...",
    "success": "Message sent successfully!",
    "error": "Failed to send message. Please try again."
  }
}
```

#### `messages/it.json` (Italian)

```json
{
  "common": {
    "appName": "Senza Luce Safaris",
    "tagline": "Esplora la Tanzania Come Mai Prima",
    "language": "Lingua",
    "loading": "Caricamento...",
    "error": "Qualcosa è andato storto",
    "backToHome": "Torna alla Home",
    "readMore": "Leggi di Più",
    "viewAll": "Vedi Tutto",
    "contactUs": "Contattaci",
    "bookNow": "Prenota Ora",
    "inquireNow": "Richiedi Informazioni",
    "learnMore": "Scopri di Più"
  },
  "navigation": {
    "home": "Home",
    "about": "Chi Siamo",
    "safarisTours": "Safari & Tour",
    "destinations": "Destinazioni",
    "blog": "Blog & Notizie",
    "contact": "Contattaci",
    "vehicles": "I Nostri Veicoli",
    "faq": "FAQ"
  },
  "home": {
    "hero": {
      "title": "Vivi la Magia della Tanzania",
      "subtitle": "Scopri una fauna mozzafiato, paesaggi incontaminati e indimenticabili avventure safari con guide locali esperte",
      "cta": "Richiedi Informazioni"
    },
    "featuredSafaris": "Safari in Evidenza",
    "curatedExperiences": "Esperienze Safari Curate",
    "experienceDescription": "Scopri le nostre esperienze safari più ricercate, create per viaggiatori esigenti",
    "viewAllPackages": "Vedi Tutti i Pacchetti",
    "stats": {
      "happyTravelers": "Viaggiatori Soddisfatti",
      "safariPackages": "Pacchetti Safari",
      "destinations": "Destinazioni",
      "yearsExperience": "Anni di Esperienza"
    },
    "quickInfo": {
      "greatValue": {
        "title": "Offerte di Grande Valore",
        "description": "Miglior prezzo garantito"
      },
      "wildlife": {
        "title": "Incontri con la Fauna Selvatica",
        "description": "Big 5 e oltre"
      },
      "flexible": {
        "title": "Tempistiche Flessibili",
        "description": "Viaggia quando vuoi"
      },
      "eco": {
        "title": "Eco & Etico",
        "description": "Turismo sostenibile"
      }
    }
  },
  "footer": {
    "description": "Esperienze safari confortevoli, autentiche e indimenticabili in tutta la Tanzania.",
    "quickLinks": "Link Rapidi",
    "destinations": "Destinazioni",
    "contactInfo": "Informazioni di Contatto",
    "newsletter": "Newsletter",
    "newsletterDescription": "Iscriviti per aggiornamenti safari e offerte esclusive",
    "subscribe": "Iscriviti",
    "copyright": "Tutti i diritti riservati",
    "privacyPolicy": "Privacy Policy",
    "termsOfService": "Termini di Servizio"
  },
  "buttons": {
    "explorePackages": "Esplora i Pacchetti",
    "startPlanning": "Inizia a Pianificare",
    "sendEnquiry": "Invia Richiesta",
    "viewDetails": "Vedi Dettagli",
    "bookThisSafari": "Prenota Questo Safari"
  },
  "forms": {
    "name": "Nome Completo",
    "email": "Indirizzo Email",
    "phone": "Numero di Telefono",
    "message": "Il Tuo Messaggio",
    "travelDates": "Date di Viaggio",
    "numberOfTravelers": "Numero di Viaggiatori",
    "submit": "Invia",
    "sending": "Invio in corso...",
    "success": "Messaggio inviato con successo!",
    "error": "Impossibile inviare il messaggio. Riprova."
  }
}
```

#### `messages/de.json` (German)

```json
{
  "common": {
    "appName": "Senza Luce Safaris",
    "tagline": "Entdecken Sie Tansania wie nie zuvor",
    "language": "Sprache",
    "loading": "Wird geladen...",
    "error": "Etwas ist schiefgelaufen",
    "backToHome": "Zurück zur Startseite",
    "readMore": "Mehr erfahren",
    "viewAll": "Alle anzeigen",
    "contactUs": "Kontaktieren Sie uns",
    "bookNow": "Jetzt buchen",
    "inquireNow": "Jetzt anfragen",
    "learnMore": "Mehr erfahren"
  },
  "navigation": {
    "home": "Startseite",
    "about": "Über uns",
    "safarisTours": "Safaris & Touren",
    "destinations": "Reiseziele",
    "blog": "Blog & Neuigkeiten",
    "contact": "Kontakt",
    "vehicles": "Unsere Fahrzeuge",
    "faq": "FAQ"
  },
  "home": {
    "hero": {
      "title": "Erleben Sie die Magie Tansanias",
      "subtitle": "Entdecken Sie atemberaubende Tierwelt, unberührte Landschaften und unvergessliche Safari-Abenteuer mit erfahrenen lokalen Guides",
      "cta": "Jetzt anfragen"
    },
    "featuredSafaris": "Empfohlene Safaris",
    "curatedExperiences": "Kuratierte Safari-Erlebnisse",
    "experienceDescription": "Entdecken Sie unsere gefragtesten Safari-Erlebnisse, crafted für anspruchsvolle Reisende",
    "viewAllPackages": "Alle Pakete anzeigen"
  }
}
```

#### `messages/fr.json` (French)

```json
{
  "common": {
    "appName": "Senza Luce Safaris",
    "tagline": "Explorez la Tanzanie comme jamais auparavant",
    "language": "Langue",
    "loading": "Chargement...",
    "error": "Une erreur est survenue",
    "backToHome": "Retour à l'accueil",
    "readMore": "Lire la suite",
    "viewAll": "Voir tout",
    "contactUs": "Contactez-nous",
    "bookNow": "Réserver maintenant",
    "inquireNow": "Demander des informations",
    "learnMore": "En savoir plus"
  },
  "navigation": {
    "home": "Accueil",
    "about": "À propos",
    "safarisTours": "Safaris & Circuits",
    "destinations": "Destinations",
    "blog": "Blog & Actualités",
    "contact": "Contact",
    "vehicles": "Nos Véhicules",
    "faq": "FAQ"
  },
  "home": {
    "hero": {
      "title": "Vivez la Magie de la Tanzanie",
      "subtitle": "Découvrez une faune époustouflante, des paysages vierges et des aventures safari inoubliables avec des guides locaux experts",
      "cta": "Demander des informations"
    },
    "featuredSafaris": "Safaris en Vedette",
    "curatedExperiences": "Expériences Safari Curées",
    "experienceDescription": "Découvrez nos expériences safari les plus recherchées, conçues pour les voyageurs exigeants",
    "viewAllPackages": "Voir Tous les Forfaits"
  }
}
```

---

## 🔧 Implementation Steps

### Step 1: Update Root Layout

**File:** `src/app/layout.tsx`

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AnimatePresence } from "framer-motion";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import "./globals.css";
import "./image-styles.css";
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileCTABar } from '@/components/ui/mobile-cta-bar';
import { PageTransition } from '@/components/ui/page-transition';
import { SmoothScrollProvider } from '@/components/ui/smooth-scroll';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Senza Luce Safaris - Explore Tanzania Like Never Before",
  description: "Comfortable, authentic, and unforgettable safari experiences across Tanzania.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          {/* Skip Link for Keyboard Users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
          >
            Skip to main content
          </a>

          <SmoothScrollProvider />

          <div className="min-h-screen flex flex-col pb-20 lg:pb-0">
            <Header />
            <main id="main-content" className="flex-1">
              <AnimatePresence mode="wait">
                <PageTransition>
                  {children}
                </PageTransition>
              </AnimatePresence>
            </main>
            <Footer />
            <MobileCTABar />
          </div>
          {/* Performance Monitoring */}
          <SpeedInsights />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Step 2: Create Language Switcher Component

**File:** `src/components/ui/language-switcher.tsx`

```typescript
"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter, Link } from '@/i18n/navigation';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px] h-8 border-border/50">
        <Globe className="w-4 h-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### Step 3: Add Language Switcher to Header

**File:** `src/components/layout/header.tsx`

Add the language switcher to your header:

```typescript
import { LanguageSwitcher } from '@/components/ui/language-switcher';

// In your header component, add:
<div className="flex items-center gap-4">
  <ThemeToggle />
  <LanguageSwitcher />
  <SearchTrigger />
  {/* ... rest of header */}
</div>
```

---

## 📖 Usage Examples

### Using Translations in Components

#### Example 1: Basic Translation

```typescript
"use client";

import { useTranslations } from 'next-intl';

export function HeroSection() {
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

#### Example 2: Navigation Component

```typescript
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Navigation() {
  const t = useTranslations('navigation');
  
  const navItems = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/safaris-tours', label: t('safarisTours') },
    { href: '/destinations', label: t('destinations') },
    { href: '/contact', label: t('contact') },
  ];
  
  return (
    <nav>
      {navItems.map(item => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
```

#### Example 3: Stats Section

```typescript
import { useTranslations } from 'next-intl';

export function StatsSection() {
  const t = useTranslations('home.stats');
  
  const stats = [
    { value: '500+', label: t('happyTravelers') },
    { value: '50+', label: t('safariPackages') },
    { value: '15+', label: t('destinations') },
    { value: '10+', label: t('yearsExperience') },
  ];
  
  return (
    <section>
      {stats.map((stat, index) => (
        <div key={index}>
          <div>{stat.value}</div>
          <div>{stat.label}</div>
        </div>
      ))}
    </section>
  );
}
```

#### Example 4: Server Component

```typescript
import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const t = await getTranslations('footer');
  
  return (
    <footer>
      <p>{t('description')}</p>
      <h3>{t('quickLinks')}</h3>
      <p>© {new Date().getFullYear()} {t('copyright')}</p>
    </footer>
  );
}
```

---

## 🌐 Dynamic Routes & SEO

### SEO Metadata with Translations

**File:** `src/app/[locale]/page.tsx`

```typescript
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/navigation';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'home' });
  
  return {
    title: `${t('hero.title')} - Senza Luce Safaris`,
    description: t('hero.subtitle'),
  };
}

export default function HomePage({ params }: { params: { locale: string } }) {
  unstable_setRequestLocale(params.locale);
  
  return <YourHomePage />;
}
```

### Sitemap with Multiple Languages

**File:** `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next';
import { routing } from '@/i18n/navigation';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/safaris-tours',
    '/destinations',
    '/contact',
    '/blog',
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  routing.locales.forEach((locale) => {
    routes.forEach((route) => {
      const url = locale === 'en' 
        ? `https://senzaluce-safaris.com${route}`
        : `https://senzaluce-safaris.com/${locale}${route}`;
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((loc) => [
              loc,
              loc === 'en'
                ? `https://senzaluce-safaris.com${route}`
                : `https://senzaluce-safaris.com/${loc}${route}`
            ])
          ),
        },
      });
    });
  });

  return sitemap;
}
```

---

## ⚡ Performance Optimization

### 1. Static Generation

Pre-generate all language versions:

```typescript
// In your page files
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
```

### 2. Message Loading Optimization

Only load messages for the current locale:

```typescript
// Already configured in src/i18n/request.ts
messages: (await import(`../../messages/${locale}.json`)).default
```

### 3. Client-Side Bundle Size

Use selective imports:

```typescript
// ✅ Good - Only imports what you need
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

// ❌ Bad - Imports everything
import * as NextIntl from 'next-intl';
```

### 4. Caching Strategy

Messages are automatically cached by Next.js. No additional configuration needed.

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Visit `/` - should redirect to `/en` or detected locale
- [ ] Visit `/it` - should show Italian version
- [ ] Visit `/de` - should show German version
- [ ] Visit `/fr` - should show French version
- [ ] Switch languages using LanguageSwitcher - all text should update
- [ ] Navigate between pages - locale should persist
- [ ] Check SEO metadata - should be in correct language
- [ ] Test on mobile - language switcher should work
- [ ] Test with browser language settings - should auto-detect

### Automated Testing

```typescript
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../messages/en.json';

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider messages={messages} locale="en">
      {ui}
    </NextIntlClientProvider>
  );
}

describe('HeroSection', () => {
  it('displays translated text', () => {
    renderWithIntl(<HeroSection />);
    expect(screen.getByText('Experience the Magic of Tanzania')).toBeInTheDocument();
  });
});
```

---

## 🚀 Deployment

### Vercel Deployment

No additional configuration needed. Vercel automatically handles:
- ✅ Environment variables
- ✅ Build process
- ✅ Middleware
- ✅ Static generation

### Environment Variables (Optional)

```env
# .env.local
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,it,de,fr,es
```

---

## 🔍 Troubleshooting

### Issue 1: Translations Not Showing

**Problem:** Components show translation keys instead of text

**Solution:**
```typescript
// Check that messages are loaded correctly
console.log('Messages:', messages);

// Verify namespace is correct
const t = useTranslations('home'); // Not 'home.hero'
const heroT = useTranslations('home.hero'); // For nested
```

### Issue 2: Language Switcher Not Working

**Problem:** Language doesn't change when selecting

**Solution:**
```typescript
// Ensure you're using the correct router
import { useRouter } from '@/i18n/navigation'; // Not 'next/navigation'

const router = useRouter();
router.push(pathname, { locale: newLocale });
```

### Issue 3: Middleware Conflicts

**Problem:** Redirects not working or infinite loops

**Solution:**
```typescript
// Check middleware matcher
export const config = {
  matcher: [
    '/',
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/(en|it|de|fr|es)/:path*'
  ]
};
```

### Issue 4: Static Generation Errors

**Problem:** Build fails with locale errors

**Solution:**
```typescript
// Add to all page files
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
```

---

## ✨ Best Practices

### 1. Organize Messages by Feature

```json
{
  "common": { "...": "..." },
  "navigation": { "...": "..." },
  "home": { "...": "..." },
  "about": { "...": "..." },
  "tours": { "...": "..." },
  "destinations": { "...": "..." },
  "contact": { "...": "..." },
  "footer": { "...": "..." }
}
```

### 2. Use Namespaces Effectively

```typescript
// ✅ Good - Specific namespace
const t = useTranslations('home.hero');
t('title');

// ❌ Bad - Too broad
const t = useTranslations('home');
t('hero.title');
```

### 3. Handle Missing Translations

```typescript
// next-intl shows the key if translation is missing
// This helps identify missing translations during development
const t = useTranslations('home');
t('missingKey'); // Shows "missingKey" in dev
```

### 4. Use ICU Message Format for Plurals

```json
{
  "tour": {
    "duration": "{count, plural, =1 {1 day} other {# days}}"
  }
}
```

```typescript
t('tour.duration', { count: 5 }); // "5 days"
t('tour.duration', { count: 1 }); // "1 day"
```

### 5. Format Dates and Numbers

```typescript
import { useFormatter } from 'next-intl';

const format = useFormatter();

format.dateTime(new Date(), { year: 'numeric', month: 'long' });
format.number(1000000); // "1,000,000" or locale-specific
```

---

## 📚 Additional Resources

### Official Documentation
- [next-intl Docs](https://next-intl-docs.vercel.app/)
- [Next.js i18n Guide](https://nextjs.org/docs/app/building-your-application/routing/internationalization)

### Tools
- [Google Translate API](https://cloud.google.com/translate) - For initial translations
- [POEditor](https://poeditor.com/) - Translation management
- [Lokalise](https://lokalise.com/) - Professional translation platform

### Browser Extensions
- [React Developer Tools](https://chrome.google.com/webstore) - Debug React components
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally) - VS Code extension for translations

---

## 🎯 Implementation Checklist

### Phase 1: Setup (Day 1)
- [ ] Create `src/i18n/request.ts`
- [ ] Create `src/i18n/navigation.ts`
- [ ] Create `src/middleware.ts`
- [ ] Update `next.config.ts`
- [ ] Update `src/app/layout.tsx`

### Phase 2: Translation Files (Day 2-3)
- [ ] Create `messages/en.json` (complete all sections)
- [ ] Create `messages/it.json` (translate all sections)
- [ ] Create `messages/de.json` (translate all sections)
- [ ] Create `messages/fr.json` (translate all sections)
- [ ] Create `messages/es.json` (optional)

### Phase 3: Components (Day 4-5)
- [ ] Create `src/components/ui/language-switcher.tsx`
- [ ] Add language switcher to header
- [ ] Update all navigation components
- [ ] Update homepage components
- [ ] Update footer component

### Phase 4: Pages (Day 6-7)
- [ ] Update all page metadata with translations
- [ ] Add `generateStaticParams` to all pages
- [ ] Test all routes with different locales
- [ ] Verify SEO metadata for each language

### Phase 5: Testing & Polish (Day 8)
- [ ] Test language switching
- [ ] Verify all translations are complete
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit
- [ ] Fix any issues

### Phase 6: Deployment (Day 9)
- [ ] Build project locally
- [ ] Test all languages in production mode
- [ ] Deploy to Vercel
- [ ] Verify production URLs
- [ ] Monitor for issues

---

## 🎉 Expected Results

After implementation:

### URLs:
- `/` → Redirects to `/en` or detected locale
- `/en/safaris-tours` → English version
- `/it/safaris-tours` → Italian version
- `/de/safaris-tours` → German version
- `/fr/safaris-tours` → French version

### Features:
- ✅ Automatic language detection from browser
- ✅ Manual language switching via dropdown
- ✅ Persistent language preference
- ✅ SEO-optimized URLs for each language
- ✅ Complete translations across all pages
- ✅ Smooth transitions between languages
- ✅ Server-side rendering for all locales
- ✅ Static generation for performance

### SEO Benefits:
- ✅ Each language has unique URLs
- ✅ Proper hreflang tags
- ✅ Localized metadata
- ✅ Multi-language sitemap
- ✅ Better search rankings in target countries

---

## 💡 Pro Tips

1. **Start with English and Italian** - Your primary markets
2. **Use professional translators** - Don't rely solely on Google Translate
3. **Test with native speakers** - Ensure cultural appropriateness
4. **Keep message keys consistent** - Use dot notation (e.g., `home.hero.title`)
5. **Version your translations** - Track changes in Git
6. **Monitor missing translations** - Use next-intl's built-in warnings
7. **Optimize for Safari tourists** - German, French, Spanish are key markets

---

## 📞 Support

For issues or questions:
- [next-intl GitHub Issues](https://github.com/amannn/next-intl/issues)
- [Next.js Discord](https://discord.com/invite/nextjs)
- [Stack Overflow - next-intl tag](https://stackoverflow.com/questions/tagged/next-intl)

---

**Last Updated:** 2025
**Version:** 1.0
**Status:** Ready for Implementation
