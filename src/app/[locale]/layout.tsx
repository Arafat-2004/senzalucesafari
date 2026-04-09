import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import "./globals.css";
import "./image-styles.css";
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileCTABar } from '@/components/ui/mobile-cta-bar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PWARegistration } from '@/components/PWARegistration';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false, // Only load if needed
});

export const metadata: Metadata = {
  title: "Senza Luce Safaris - Explore Tanzania Like Never Before",
  description: "Comfortable, authentic, and unforgettable safari experiences across Tanzania. Discover Serengeti, Ngorongoro, Tarangire, and Zanzibar with expert local guides.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Senza Safaris',
  },
  // Resource hints for better performance
  other: {
    'link': [
      '<https://fonts.googleapis.com>; rel=preconnect',
      '<https://fonts.gstatic.com>; rel=preconnect crossorigin',
      '<https://images.unsplash.com>; rel=preconnect',
    ]
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <NextIntlClientProvider messages={messages}>
            {/* Skip Link for Keyboard Users */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
            >
              Skip to main content
            </a>

            <div className="min-h-screen flex flex-col pb-20 lg:pb-0">
              <Header />
              <main id="main-content" className="flex-1">
                {/* Only use animations in client-side navigation, not initial load */}
                {children}
              </main>
              <Footer />
              <MobileCTABar />
            </div>
            {/* Performance Monitoring */}
            <SpeedInsights />
            <Analytics />
            <PWARegistration />
            {/* WhatsApp Floating Button - Removed */}
            {/* <WhatsAppButton /> */}
          </NextIntlClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
