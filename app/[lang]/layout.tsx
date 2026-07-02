import React, { Suspense } from 'react';
import { i18n, type Locale } from '../../i18n-config';
import { Analytics } from '@vercel/analytics/react';
import CvMobilePreviewOverlay from '@/components/CvMobilePreviewOverlay';
import DevNav from '@/components/DevNav';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
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
      <div className="container mx-auto min-h-screen p-8 print:min-h-0 print:px-8 print:py-0 max-md:px-4 max-md:pb-8 max-md:pt-3">
        <main>{children}</main>
      </div>
      {/* Nav dev vers les pages internes — hors production uniquement (absente du
          DOM en prod, même gating que le middleware qui 404 les /dev/* en prod). */}
      {process.env.VERCEL_ENV !== 'production' && <DevNav lang={lang} />}
      {enableAnalitycs ? <Analytics /> : ''}
    </>
  );
}
