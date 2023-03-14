/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
      domains: ['www.datocms-assets.com','www.kindacode.com'],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
