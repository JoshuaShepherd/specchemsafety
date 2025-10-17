/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable TypeScript and ESLint checks during build (IMPORTANT for production)
  typescript: {
    // Only ignore build errors in development if absolutely necessary
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    // Only ignore linting in development if absolutely necessary
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  // Server Actions configuration
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Enable SWC minification for better performance
  swcMinify: true,
  // Standalone output for Docker/Vercel deployment
  output: 'standalone',
  // Trailing slash configuration
  trailingSlash: true,
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'radbukphijxenmgiljtu.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
  // Disable static params generation for fully dynamic routes
  generateStaticParams: false,
  // Environment variables validation
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

module.exports = nextConfig;
