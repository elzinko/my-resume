import React, { Suspense } from 'react';
import { i18n } from '../../i18n-config';
import { Analytics } from '@vercel/analytics/react';
import CvMobilePreviewOverlay from '@/components/CvMobilePreviewOverlay';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let enableAnalitycs = true;
  if (process.env.STATIC_DEPLOYMENT) {
    if (process.env.STATIC_DEPLOYMENT === 'true') {
      enableAnalitycs = false;
    }
  }
  return (
    <>
      {process.env.NODE_ENV === 'development' ? (
        <Suspense fallback={null}>
          <CvMobilePreviewOverlay />
        </Suspense>
      ) : null}
      <div className="container mx-auto min-h-screen p-8 print:min-h-0 print:p-8 max-md:px-8 max-md:pb-8 max-md:pt-3">
        <main>{children}</main>
      </div>
      {enableAnalitycs ? <Analytics /> : ''}
    </>
  );
}
