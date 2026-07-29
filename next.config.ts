import type { NextConfig } from "next";
import os from "os";
import { resolveSiteUrl } from "./src/config/site";

// Dynamically auto-detect all local IPv4 network interfaces on the host machine
// to prevent 403 Forbidden & HMR WebSockets connection blocks during cross-device testing.
const getLocalIPs = (): string[] => {
  const interfaces = os.networkInterfaces();
  const ips = ["localhost", "127.0.0.1"];
  for (const key of Object.keys(interfaces)) {
    const netList = interfaces[key];
    if (netList) {
      for (const net of netList) {
        // Support IPv4 dev origins
        if (net.family === "IPv4" && !ips.includes(net.address)) {
          ips.push(net.address);
        }
      }
    }
  }
  return ips;
};

const publicSiteUrl = resolveSiteUrl();

const nextConfig: NextConfig = {
  // Next.js 16 uses Turbopack by default. The application does not require
  // custom Turbopack rules; this explicit config allows the legacy webpack
  // fallback below to coexist for troubleshooting.
  turbopack: {},
  // Allow network devices to access dev server for cross-device testing
  allowedDevOrigins: getLocalIPs(),

  // NEXT_PUBLIC_* values are frozen at build time. Never allow a stale local
  // URL to leak into production metadata, password-reset links, or emails.
  env: {
    NEXT_PUBLIC_SITE_URL: publicSiteUrl,
  },

  devIndicators: {
    position: 'bottom-right',
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

  // Reduce output file tracing to speed up builds
  outputFileTracingRoot: process.env.NODE_ENV === 'production' ? undefined : process.cwd(),

  // Exclude heavy packages from server component bundle
  serverExternalPackages: ['pg', 'prisma', '@prisma/client', '@prisma/adapter-pg'],

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
      // CSP - Content Security Policy (includes unsafe-inline for Next.js hydration)
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: *.unsplash.com *.googleapis.com blob:",
              "media-src 'self' https://*.supabase.co blob:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.vercel-analytics.com",
              "frame-src 'self'",
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
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/(.*)manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ] : [
      // Development: only security headers, no Cache-Control
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/(.*)manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
        ],
      },
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
        hostname: '**',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**',
      },
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
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
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

  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
    optimizePackageImports: ['lucide-react', 'recharts', '@supabase/supabase-js', 'date-fns'],
    esmExternals: true,
    optimizeCss: true,
    // Limit static page generation concurrency to avoid Supabase connection pool exhaustion (max 15)
    staticGenerationMaxConcurrency: 4,
  },

  // Bundle size optimizations
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'recharts': 'recharts/es6',
      };
    }

    // Fix Windows EPERM file lock errors during dev
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
      };
      config.infrastructureLogging = {
        level: 'error',
      };
    }

    // Reduce bundle size by tree-shaking unused code
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
      };
    }

    return config;
  },


};

export default nextConfig;
