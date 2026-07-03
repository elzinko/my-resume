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
  // Hors production : barre de nav dev EN HAUT (pleine largeur, desktop) → on réserve
  // la hauteur en haut du contenu pour ne pas la recouvrir (mobile : barre en bas).
  const isDev = process.env.VERCEL_ENV !== 'production';
  return (
    <>
      {process.env.NODE_ENV === 'development' ? (
        <Suspense fallback={null}>
          <CvMobilePreviewOverlay />
        </Suspense>
      ) : null}
      {/* Réserve la hauteur de la barre dev (desktop) → le contenu démarre dessous.
          Écran uniquement : masqué en impression ET en aperçu `?print` (barre cachée
          là), donc AUCUN impact sur le PDF / l'aperçu. Mobile : barre dev en bas. */}
      {isDev ? (
        <div
          aria-hidden
          className="hidden h-4 shrink-0 print-preview:hidden print:hidden md:block"
        />
      ) : null}
      <div className="container mx-auto min-h-screen p-8 print:min-h-0 print:px-8 print:py-0 max-md:px-4 max-md:pb-8 max-md:pt-3">
        <main>{children}</main>
      </div>
      {/* Nav dev vers les pages internes — hors production uniquement (absente du
          DOM en prod, même gating que le middleware qui 404 les /dev/* en prod). */}
      {isDev && <DevNav lang={lang} />}
      {enableAnalitycs ? <Analytics /> : ''}
    </>
  );
}
