/** @type {import('next').NextConfig} */
module.exports = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.demotechalphonic.tech',
      },
      {
        protocol: 'https',
        hostname: 'scholaracad.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/backend-api/:path*',
        destination: 'https://api.demotechalphonic.tech/:path*',
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
