/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
      domains: ['www.datocms-assets.com','vitals.vercel-insights.com'],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
