import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds to complete even if there are ESLint errors
    ignoreDuringBuilds: true
  },
  typescript: {
    // Allow production builds to complete even if there are type errors (for demo purposes)
    ignoreBuildErrors: true
  },
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif']
  }
};

export default nextConfig;
