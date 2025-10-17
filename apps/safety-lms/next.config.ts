import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Enable TypeScript checking during build
    ignoreBuildErrors: false,
  },
  eslint: {
    // Enable ESLint checking during build
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
