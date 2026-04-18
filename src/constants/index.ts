/**
 * Application-wide constants
 * 
 * Centralized configuration values used across the application.
 * Avoid magic numbers and strings — reference these constants instead.
 */

// ============================================
// Company Information
// ============================================

export const COMPANY = {
  name: 'Senza Luce Safaris',
  tagline: 'Explore Tanzania Like Never Before',
  email: 'info@senzalucesafaris.com',
  phone: '+255629123246',
  phoneDisplay: '+255 629 123 246',
  whatsapp: '255629123246',
  whatsappFull: '+255629123246',
  website: 'https://senzalucesafaris.com',
  location: 'Arusha, Tanzania',
} as const;

// ============================================
// Site Configuration
// ============================================

export const SITE_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://senzalucesafaris.com',
  locale: 'en',
  defaultCurrency: 'USD',
  maxTravelersPerBooking: 20,
  minTravelersPerBooking: 1,
} as const;

// ============================================
// Route Paths
// ============================================

export const ROUTES = {
  home: '/',
  about: '/about',
  contact: '/contact',
  destinations: '/destinations',
  safarisTours: '/safaris-tours',
  vehicles: '/vehicles',
  accommodations: '/accommodations',
  blog: '/blog',
  faq: '/faq',
  enquiry: '/enquiry',
  privacy: '/privacy',
  terms: '/terms',
  support: '/support',
} as const;

// ============================================
// API Routes
// ============================================

export const API_ROUTES = {
  newsletterSubscribe: '/api/newsletter/subscribe',
} as const;

// ============================================
// Breakpoints (matching Tailwind CSS)
// ============================================

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ============================================
// Animation
// ============================================

export const ANIMATION = {
  /** Default stagger delay between items (seconds) */
  staggerDelay: 0.1,
  /** Standard transition duration (seconds) */
  transitionDuration: 0.3,
  /** Viewport trigger threshold (0-1) */
  viewportThreshold: 0.3,
} as const;

// ============================================
// Image Configuration
// ============================================

export const IMAGE_CONFIG = {
  /** Quality for Next.js Image optimization */
  quality: 85,
  /** Blur placeholder data URL */
  placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4=',
} as const;
