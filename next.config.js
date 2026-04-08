const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['vitals.vercel-insights.com'],
  },
  /**
   * En dev, le cache disque Webpack peut laisser des références vers d’anciens chunks
   * (`Cannot find module './329.js'`, `vendor-chunks/...`) après sauvegardes rapides / HMR,
   * surtout avec pnpm. Désactiver le cache évite cette boucle d’erreurs jusqu’à `rm -rf .next`.
   */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  // Optional: Add a trailing slash to all paths `/about` -> `/about/`
  // trailingSlash: true,
  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
};

// Vérifiez si la variable d'environnement OUTPUT_PATH existe
if (process.env.NEXT_PUBLIC_EXPORT) {
  nextConfig.output = process.env.NEXT_PUBLIC_EXPORT;
}

if (process.env.NEXT_PUBLIC_BASE_PATH) {
  nextConfig.basePath = process.env.NEXT_PUBLIC_BASE_PATH;
}

module.exports = nextConfig;
