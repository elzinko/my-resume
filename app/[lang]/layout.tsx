import React from 'react';
import { i18n } from '../../i18n-config';
import { Analytics } from '@vercel/analytics/react';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let debug = true;
  if (
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
    process.env.NEXT_PUBLIC_EXPORT != ''
  ) {
    debug = false;
  }
  console.log('Analytics debug = ' + debug);
  return (
    <html lang="fr">
      <body>
        <div className="container mx-auto min-h-screen p-8">
          <main>{children}</main>
        </div>
        {/* if debug is true, then add Analytics */}
        if (debug) {<Analytics debug={debug} />}
      </body>
    </html>
  );
}
