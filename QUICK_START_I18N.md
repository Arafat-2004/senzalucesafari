# 🚀 Quick Start: Complete Multi-Language Integration

This guide will help you finish implementing multi-language support in **under 2 hours**.

---

## ⚡ Fast Track (Essential Steps Only)

### Step 1: Create Locale Folder Structure (15 minutes)

Run these commands in your terminal:

```powershell
# Navigate to project
cd c:\Users\arafa\Desktop\safarisSenza\senzalucesafaris

# Create locale folder
New-Item -ItemType Directory -Path "src/app/[locale]" -Force

# Move all existing pages into [locale]
Move-Item -Path "src/app/page.tsx" -Destination "src/app/[locale]/page.tsx" -Force
Move-Item -Path "src/app/about" -Destination "src/app/[locale]/about" -Force
Move-Item -Path "src/app/contact" -Destination "src/app/[locale]/contact" -Force
Move-Item -Path "src/app/destinations" -Destination "src/app/[locale]/destinations" -Force
Move-Item -Path "src/app/safaris-tours" -Destination "src/app/[locale]/safaris-tours" -Force
```

### Step 2: Create Locale Layout (10 minutes)

Create file: `src/app/[locale]/layout.tsx`

```tsx
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { locales } from '../../../i18n/config';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import type { Metadata } from 'next';

export async function generateMetadata({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}): Promise<Metadata> {
  return {
    title: "Senza Luce Safaris - Explore Tanzania Like Never Before",
    description: "Comfortable, authentic, and unforgettable safari experiences across Tanzania.",
  };
}

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
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
```

### Step 3: Update Root Layout (5 minutes)

Edit `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  description: "Comfortable, authentic, and unforgettable safari experiences across Tanzania. Discover Serengeti, Ngorongoro, Tarangire, and Zanzibar with expert local guides.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
```

### Step 4: Add Language Switcher to Header (10 minutes)

Edit `src/components/layout/header.tsx`:

Add import at top:
```tsx
import { LanguageSwitcher } from '@/components/ui/language-switcher';
```

Find the navigation section and add the switcher:
```tsx
// Around line 60-70, find where nav items are rendered
<div className="hidden md:flex items-center gap-6">
  {/* ... existing nav links ... */}
  
  {/* ADD THIS */}
  <LanguageSwitcher />
</div>
```

Also update mobile menu to include language switcher.

### Step 5: Test It Works! (5 minutes)

```bash
npm run dev
```

Visit:
- http://localhost:3000/en → English
- http://localhost:3000/sw → Swahili
- http://localhost:3000/fr → French

**If you see the website working**, the infrastructure is correct! ✅

---

## 📝 Translate Your First Component (Example)

Let's translate the Header component as an example:

### Edit `src/components/layout/header.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useTranslations } from 'next-intl';  // ADD THIS
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from '@/components/ui/language-switcher';

export function Header() {
  const pathname = usePathname();
  const t = useTranslations('navigation');  // ADD THIS
  
  const navItems = [
    { href: "/", label: t('home') },      // CHANGE THESE
    { href: "/destinations", label: t('destinations') },
    { href: "/safaris-tours", label: t('safaris') },
    { href: "/about", label: t('about') },
    { href: "/contact", label: t('contact') },
  ];
  
  // ... rest of component stays the same
}
```

That's it! Now the header will display in the selected language. 🎉

---

## 🔄 Repeat for Other Components

Use the same pattern for each component:

1. Import `useTranslations`
2. Call it with the namespace: `const t = useTranslations('section_name')`
3. Replace hardcoded text with `t('key')`

### Components to Update:
- ✅ `header.tsx` - Navigation (example above)
- ⏳ `footer.tsx` - Footer text
- ⏳ All home page sections in `src/components/home/`
- ⏳ `contact/page.tsx` - Contact form
- ⏳ `about/page.tsx` - About page

---

## 🧪 Testing Checklist

After completing the steps above:

- [ ] Website loads at http://localhost:3000
- [ ] Can visit /en, /sw, /fr URLs
- [ ] Language switcher appears in header
- [ ] Clicking language changes URL and content
- [ ] Navigation menu translates
- [ ] Footer translates (after updating)
- [ ] No console errors
- [ ] Build succeeds: `npm run build`

---

## 🎯 What You'll Have After This

✅ 5 supported languages (EN, SW, FR, DE, ES)  
✅ Automatic browser language detection  
✅ Manual language switcher in header  
✅ SEO-friendly URLs (/en, /sw, /fr, etc.)  
✅ Type-safe translations  
✅ Professional international website  

---

## 💡 Pro Tips

1. **Start Small**: Translate header and footer first, then expand
2. **Test Often**: Check each language after updating components
3. **Use Translation Keys Consistently**: `navigation.home`, `footer.contact`, etc.
4. **Place Names Stay Original**: "Serengeti" doesn't get translated
5. **Build Frequently**: Run `npm run build` to catch errors early

---

## 🆘 Troubleshooting

### Error: "Couldn't find next-intl config file"
✅ Already fixed - `next-intl.config.ts` exists

### Error: "Module not found" for i18n/config
✅ Check file paths - should be `../../../i18n/config` from `[locale]/layout.tsx`

### Language switcher not appearing
✅ Make sure you imported and added `<LanguageSwitcher />` in header

### Translations not showing
✅ Verify JSON files exist in `messages/` folder
✅ Check translation keys match exactly (case-sensitive)

### Build fails
✅ Read error message carefully
✅ Ensure all pages are inside `[locale]` folder
✅ Check imports use correct relative paths

---

## 📚 Need More Help?

- **Full Guide**: See `I18N_IMPLEMENTATION_GUIDE.md`
- **Status Report**: See `MULTILANGUAGE_STATUS.md`
- **next-intl Docs**: https://next-intl.dev

---

## ✨ You're Almost There!

The hard part (infrastructure) is **100% complete**. 

Just follow the 5 steps above and you'll have a fully functional multi-language website!

**Estimated Time**: 1-2 hours  
**Difficulty**: Easy-Medium  
**Result**: Professional international safari website 🌍

Good luck! 🚀
