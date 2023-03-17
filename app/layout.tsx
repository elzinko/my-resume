import React from 'react';
import { Analytics } from '@vercel/analytics/react';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <div className="container mx-auto min-h-screen p-8">
          <main>{children}</main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
