import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./image-styles.css";
import { PublicChrome } from '@/components/layout/public-chrome';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { SearchModal } from '@/components/ui/search-modal';
import { TooltipProvider } from '@/components/ui/tooltip';

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://senzalucesafaris.com'),
  title: {
    default: "Senza Luce Safaris - Explore Tanzania Like Never Before",
    template: "%s | Senza Luce Safaris",
  },
  description: "Comfortable, authentic, and unforgettable safari experiences across Tanzania. Discover Serengeti, Ngorongoro, Tarangire, and Zanzibar with expert local guides.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Senza Safaris',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Senza Luce Safaris',
    title: 'Senza Luce Safaris - Explore Tanzania Like Never Before',
    description: 'Comfortable, authentic, and unforgettable safari experiences across Tanzania. Discover Serengeti, Ngorongoro, Tarangire, and Zanzibar with expert local guides.',
    images: [
      {
        url: '/images/og/home.jpg',
        width: 1200,
        height: 630,
        alt: 'Senza Luce Safaris - Tanzania Safari Experiences',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Senza Luce Safaris - Explore Tanzania Like Never Before',
    description: 'Comfortable, authentic, and unforgettable safari experiences across Tanzania.',
    images: ['/images/og/home.jpg'],
  },
  // Resource hints for better performance
  other: {
    'theme-color': '#1a5632',
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
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        
        {/* Favicon - Multiple sizes for different devices */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-72x72.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-72x72.png" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delay={300}>
            <ErrorBoundary>
              {/* Skip Link for Keyboard Users */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
              >
                Skip to main content
              </a>

              <PublicChrome>
                {children}
              </PublicChrome>
              {/* Performance Monitoring */}
              <SpeedInsights />
              <Analytics />
              {/* Toast Notification System */}
              <Toaster />
              {/* Command Palette Search */}
              <SearchModal />
            </ErrorBoundary>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
