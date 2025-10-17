import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  distDir: '.next',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
