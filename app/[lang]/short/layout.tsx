import React, { Suspense } from 'react';
import CvZoomSlider from '@/components/CvZoomSlider';

/**
 * Wrapper dédié au CV court : ciblage CSS print (`cv-short-page`, `@page short`)
 * pour tenir sur une page A4 sans impacter le CV complet.
 *
 * `max-w-[800px] mx-auto` : sur le WEB, le CV est rendu à sa largeur réelle (≈ A4,
 * 794px) et centré → aperçu fidèle du PDF (sinon il s'étire pleine largeur, la
 * photo file à l'extrême droite et paraît minuscule). En impression, la page fait
 * déjà < 800px : la contrainte ne mord pas, le rendu A4 est inchangé.
 */
export default function ShortCvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // `cv-print-preview` en PERMANENCE sur le court → la vue normale rend comme
    // l'aperçu `?print=1` (fidèle au PDF). Le zoom (CvZoomSlider) gère la taille.
    <div className="cv-print-preview">
      <div className="cv-short-page mx-auto max-w-[800px]">{children}</div>
      {/* Curseur de zoom (hors du document zoomé → ne se zoome pas lui-même).
          Suspense requis : CvZoomSlider lit useSearchParams (réagit à ?print). */}
      <Suspense fallback={null}>
        <CvZoomSlider />
      </Suspense>
    </div>
  );
}
