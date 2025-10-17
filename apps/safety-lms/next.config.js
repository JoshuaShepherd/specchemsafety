/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable Turbo completely
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    turbo: {
      rules: {},
    },
  },
  // Force Next.js 14 behavior
  swcMinify: true,
  // Disable static optimization for all pages
  output: 'standalone',
  trailingSlash: true,
  // Force dynamic rendering
  generateStaticParams: false,
};

module.exports = nextConfig;
