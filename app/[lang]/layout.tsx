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
  console.log('NEXT_PUBLIC_VERCEL_ENV = ' + process.env.NEXT_PUBLIC_VERCEL_ENV);
  console.log('NEXT_PUBLIC_EXPORT = ' + process.env.NEXT_PUBLIC_EXPORT);
  let debug = true;
  if (
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
    process.env.NEXT_PUBLIC_EXPORT !== ''
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
