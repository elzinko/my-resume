const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['www.datocms-assets.com','vitals.vercel-insights.com'],
  },
  experimental: {
    appDir: true,
  },
  output: 'export',
    // Optional: Add a trailing slash to all paths `/about` -> `/about/`
    // trailingSlash: true,
    // Optional: Change the output directory `out` -> `dist`
    // distDir: 'dist',
    // Add basePath
  basePath: '/my-resume',
}

module.exports = nextConfig
