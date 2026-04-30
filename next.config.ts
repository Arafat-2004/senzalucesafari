import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow network devices to access dev server for cross-device testing
  allowedDevOrigins: ['192.168.1.104', 'localhost'],

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
    localPatterns: [
      { pathname: 'images/**' },
      { pathname: 'icons/**' },
      { pathname: '**/*.jpg' },
      { pathname: '**/*.jpeg' },
      { pathname: '**/*.png' },
      { pathname: '**/*.webp' },
      { pathname: '**/*.gif' },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Mobile-specific optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
    esmExternals: true,
    optimizeCss: true,
  },

  // Bundle size optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'recharts': 'recharts/es6',
        'framer-motion': 'framer-motion/dist/framer-motion.es.js',
      };
    }
    return config;
  },

  turbopack: {},
};

export default nextConfig;
