const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['www.datocms-assets.com','vitals.vercel-insights.com'],
  },
  experimental: {
    appDir: true,
  },
    // Optional: Add a trailing slash to all paths `/about` -> `/about/`
    // trailingSlash: true,
    // Optional: Change the output directory `out` -> `dist`
    // distDir: 'dist',
    // Add basePath
}

// Vérifiez si la variable d'environnement OUTPUT_PATH existe
if (process.env.NEXT_PUBLIC_EXPORT) {
  nextConfig.output = process.env.NEXT_PUBLIC_EXPORT;
}

if (process.env.NEXT_PUBLIC_BASE_PATH) {
  nextConfig.basePath = process.env.NEXT_PUBLIC_BASE_PATH;
}

module.exports = nextConfig
