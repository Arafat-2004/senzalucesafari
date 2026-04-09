import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

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

  // Headers for better caching
  async headers() {
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

export default withNextIntl(nextConfig);
