import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // React Compiler disabled to prevent infinite render loops
  // reactCompiler: true,

  // Allow network devices to access dev server for cross-device testing
  allowedDevOrigins: ['192.168.1.104', 'localhost'],

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'framer-motion'],
    // Enable faster builds
    webpackBuildWorker: true,
    // Optimize CSS
    optimizeCss: true,
  },

  // Compression for faster page loads
  compress: true,

  // Optimize production builds
  poweredByHeader: false,

  // Headers for better caching (production only)
  async headers() {
    // Only apply custom Cache-Control in production
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/images/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/_next/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          // Optimize Next.js image optimization cache
          source: '/_next/image',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=604800, immutable', // 7 days for optimized images
            },
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
    }

    // Development: only security headers, no Cache-Control
    return [
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
    ],
    // Optimize image loading
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable lazy loading
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    // Optimize loading strategy
    minimumCacheTTL: 604800, // 7 days for optimized images
  },
};

export default nextConfig;
