/** @type {import('next').NextConfig} */
module.exports = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'knowledgeadmin.scholaracad.com',
      },
      {
        protocol: 'https',
        hostname: 'api.knowledgeadmin.scholaracad.com',
      },
      {
        protocol: 'https',
        hostname: 'api.demotechalphonic.tech',
      },
      {
        protocol: 'https',
        hostname: 'scholaracad.com',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  async rewrites() {
    const rawBackend = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000').trim().replace(/\/+$/, '');
    return [
      {
        source: '/backend-api/:path*',
        destination: `${rawBackend}/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.scholaracad.com',
          },
        ],
        destination: 'https://scholaracad.com/:path*',
        permanent: true,
      },
    ];
  },
};
