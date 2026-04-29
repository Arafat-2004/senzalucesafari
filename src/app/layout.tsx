import type { Metadata } from "next";
import localFont from 'next/font/local';
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

// Self-hosted fonts - no internet required at build time
const inter = localFont({
  src: [
    { path: '../../public/fonts/inter-regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/inter-medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/inter-semibold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/inter-bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = localFont({
  src: [
    { path: '../../public/fonts/poppins-semibold.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/poppins-bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://senzalucesafaris.com'),
  title: {
    default: "Senza Luce Safaris - Explore Tanzania Like Never Before",
    template: "%s | Senza Luce Safaris",
  },
  description: "Comfortable, authentic, and unforgettable safari experiences across Tanzania. Discover Serengeti, Ngorongoro, Tarangire, and Zanzibar with expert local guides.",
  keywords: ["Tanzania safari", "Serengeti", "Ngorongoro", "Zanzibar", "Kilimanjaro", "wildlife safari", "African safari", "safari tours", "Tanzania travel"],
  authors: [{ name: 'Senza Luce Safaris' }],
  creator: 'Senza Luce Safaris',
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  // Resource hints for better performance
  other: {
    'theme-color': '#1a5632',
    'link': [
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
      className={`${inter.variable} ${poppins.variable} font-sans`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Preconnect to external domains for faster resource loading */}
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
