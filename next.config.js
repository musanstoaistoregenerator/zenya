/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Netlify
  output: process.env.NODE_ENV === 'production' && process.env.NETLIFY ? 'export' : undefined,
  
  // Disable image optimization for static export
  images: {
    unoptimized: process.env.NODE_ENV === 'production' && process.env.NETLIFY ? true : false,
    domains: [
      'via.placeholder.com',
      'images.unsplash.com',
      'cdn.shopify.com',
      'alicdn.com',
      'm.media-amazon.com'
    ]
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add any custom webpack configuration here
    return config;
  },
  
  // Redirects for API routes when deployed on Netlify
  async redirects() {
    if (process.env.NODE_ENV === 'production' && process.env.NETLIFY) {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://your-render-app.onrender.com'}/api/:path*`,
          permanent: false,
        },
      ];
    }
    return [];
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Experimental features
  experimental: {
    // Enable app directory if using Next.js 13+
    // appDir: true,
  },
  
  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Trailing slash configuration
  trailingSlash: false,
  
  // ESLint configuration
  eslint: {
    // Ignore ESLint during builds (handle separately)
    ignoreDuringBuilds: true,
  },
  
  // TypeScript configuration
  typescript: {
    // Ignore TypeScript errors during builds (handle separately)
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;