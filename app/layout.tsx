import '../styles/globals.css';

import type { ReactNode } from 'react';

/**
 * Layout racine requis par Next.js (html/body). Charge `globals.css` pour TOUTES
 * les pages : les styles étaient importés page par page, et les pages qui
 * oubliaient l'import (ex. `/dev/renders`) rendaient la nav dev sans ses classes
 * Tailwind → barre invisible/cassée.
 * Le contenu métier et les analytics restent dans `app/[lang]/layout.tsx`.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
