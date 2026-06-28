'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { isCvPrintPreviewQuery } from '@/lib/cv-print-preview';

const DOC_WIDTH = 800; // largeur naturelle du document court (px)
const MIN = 0.5;
const MAX = 2.5;
const STEP = 0.02;

const clamp = (z: number) => Math.min(MAX, Math.max(MIN, z));

/**
 * Curseur de zoom du CV court (écran uniquement). Pilote `--cv-zoom` →
 * `.cv-short-page { zoom }`. Visible sur la vue normale ET l'aperçu `?print=1`.
 *
 * Le MODE fixe la taille, réappliqué à CHAQUE changement de `?print` (le clic sur
 * l'œil fait une navigation soft → `useSearchParams` rerend, pas besoin de recharger) :
 *  - vue normale `/fr/short` → **plein écran** (ajusté à la largeur dispo) ;
 *  - aperçu `?print=1`       → **largeur réelle d'un CV** (zoom 1, ~800px = A4).
 * Aucune valeur persistée (pas de localStorage qui baverait d'un mode à l'autre).
 * Le curseur permet un ajustement ponctuel en cours de session. Le bouton % réajuste.
 *
 * Le PDF n'est JAMAIS affecté : `@media print` remet `zoom: 1`, et le curseur est
 * `print:hidden`. Rendu HORS du document zoomé → il ne se zoome pas lui-même.
 */
export default function CvZoomSlider() {
  const [zoom, setZoom] = useState(1);
  const searchParams = useSearchParams();
  const printMode = isCvPrintPreviewQuery(
    new URLSearchParams(searchParams.toString()),
  );

  const apply = useCallback((z: number) => {
    const v = clamp(z);
    setZoom(v);
    document.documentElement.style.setProperty('--cv-zoom', String(v));
  }, []);

  const fitToWidth = useCallback(() => {
    const doc = document.querySelector('.cv-short-page');
    const avail = doc?.parentElement?.clientWidth ?? window.innerWidth;
    return avail / DOC_WIDTH;
  }, []);

  useEffect(() => {
    // Réappliqué à CHAQUE changement de `?print` (printMode en dépendance) → le
    // clic sur l'œil rebascule la taille sans recharger. Pas de localStorage.
    apply(printMode ? 1 : fitToWidth());
  }, [apply, fitToWidth, printMode]);

  return (
    <div
      className="fixed bottom-4 right-4 z-[200] flex items-center gap-2 rounded-full border border-slate-300/70 bg-white/90 px-3 py-1.5 text-xs text-slate-600 shadow-md backdrop-blur supports-[backdrop-filter]:bg-white/70 print:hidden"
      data-testid="cv-zoom-slider"
    >
      <span className="select-none font-medium">Zoom</span>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={STEP}
        value={zoom}
        onChange={(e) => apply(parseFloat(e.target.value))}
        className="h-1 w-28 cursor-pointer accent-blue-500"
        aria-label="Zoom du CV (écran uniquement)"
      />
      <button
        type="button"
        onClick={() => apply(fitToWidth())}
        className="w-10 select-none text-right tabular-nums hover:text-slate-900"
        title="Ajuster à la largeur de l'écran"
      >
        {Math.round(zoom * 100)}%
      </button>
    </div>
  );
}
