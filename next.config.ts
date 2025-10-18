import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  experimental: {
    // Next.js 16 experimental features
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-pulse',
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  },
  // Next.js 16 optimizations
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
};

export default nextConfig;
