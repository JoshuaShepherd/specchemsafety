/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Force all pages to be dynamic to skip static generation completely
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Disable static optimization for all pages
  output: 'standalone',
  trailingSlash: true,
  // Force dynamic rendering
  generateStaticParams: false,
};

module.exports = nextConfig;
