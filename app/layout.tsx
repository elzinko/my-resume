import type { ReactNode } from 'react';

/**
 * Layout racine requis par Next.js (html/body).
 * Le contenu métier et les analytics restent dans `app/[lang]/layout.tsx`.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
