/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lexica-serve-encoded-images.sharif.workers.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
