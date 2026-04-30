import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // React Compiler disabled to prevent infinite render loops
  // reactCompiler: true,

  // Allow network devices to access dev server for cross-device testing
  allowedDevOrigins: ['192.168.1.104', 'localhost'],

  // Fix: Explicitly set project root to avoid detecting parent directory lockfiles
  // turbopack config removed to reduce memory usage on Windows

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Disable source maps in production for faster builds and smaller bundles
  productionBrowserSourceMaps: false,

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // Compression for faster page loads
  compress: true,

  // Optimize production builds
  poweredByHeader: false,

  // Headers for better caching (production only)
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production';
    
    const securityHeaders = isProduction ? [
      // HSTS - Force HTTPS
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // CSP - Content Security Policy (stricter, no unsafe-inline/eval)
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: *.unsplash.com blob:",
              "connect-src 'self' https://*.supabase.co https://api.stripe.com wss://*.supabase.co",
              "frame-src 'self' https://js.stripe.com",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "base-uri 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
      // Cache control for static assets
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, immutable' },
        ],
      },
    ] : [
      // Development: only security headers, no Cache-Control
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];

    return securityHeaders;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/**',
      },
    ],
    // Allow local images from specific directories only
    localPatterns: [
      { pathname: 'images/**' },
      { pathname: 'icons/**' },
      { pathname: '**/*.jpg' },
      { pathname: '**/*.jpeg' },
      { pathname: '**/*.png' },
      { pathname: '**/*.webp' },
      { pathname: '**/*.gif' },
    ],
    // Optimize image loading
    formats: ['image/webp'],
    deviceSizes: [640, 1080, 1920],
    imageSizes: [32, 64, 128, 256],
    // Enable lazy loading
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    // Optimize loading strategy
    minimumCacheTTL: 31536000, // 1 year for optimized images (increased from 7 days)
  },
};

export default nextConfig;
