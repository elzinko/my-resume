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
  let enableAnalitycs = true;
  if (process.env.STATIC_DEPLOYMENT) {
    if (process.env.STATIC_DEPLOYMENT === 'true') {
      enableAnalitycs = false;
    }
  }
  console.log('Analytics = ' + enableAnalitycs);
  return (
    <html lang="fr">
      <body>
        <div className="container mx-auto min-h-screen p-8">
          <main>{children}</main>
        </div>
        {enableAnalitycs ? <Analytics /> : ''}
      </body>
    </html>
  );
}
