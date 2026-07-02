'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { isCvPrintPreviewQuery } from '@/lib/cv-print-preview';

const DOC_WIDTH = 800; // largeur naturelle du document court (px)
/** Zoom de l'APERÇU print (`?print=1`) : affiche le CV court à ~21cm (A4 réelle) sur
 *  l'écran de l'auteur. Calibré empiriquement → propre à cet écran (le navigateur ne
 *  connaît PAS la résolution physique) ; le curseur (et le bouton %) ajustent ailleurs. */
const SCREEN_A4_ZOOM = 0.82;
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
 *  - aperçu `?print=1`       → **~21cm (A4 réelle)** sur l'écran de l'auteur (SCREEN_A4_ZOOM).
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
    // Réappliqué à CHAQUE changement de `?print` (printMode en dépendance) → le clic
    // sur l'œil rebascule la taille sans recharger. Pas de localStorage.
    //  - MOBILE (< md), vue normale → zoom 1 : le CV court se rend en vue responsive
    //    lisible (pas un document A4 réduit). `fitToWidth` viserait l'A4 (800px) → ~0.5
    //    sur téléphone = illisible (« affichage trop petit » quand on ouvre un lien
    //    /short sur mobile). La typo A4 est neutralisée en parallèle (globals.css,
    //    garde-fou `min-width: 768px`). Le curseur reste `md:flex` (masqué mobile).
    //  - aperçu ?print=1 → SCREEN_A4_ZOOM (≈ 21cm A4 réelle sur l'écran de l'auteur) ;
    //  - vue normale desktop → plein écran (ajusté à la largeur dispo).
    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 767px)').matches;
    if (isMobile && !printMode) {
      apply(1);
      return;
    }
    apply(printMode ? SCREEN_A4_ZOOM : fitToWidth());
  }, [apply, fitToWidth, printMode]);

  return (
    <div
      className="fixed bottom-4 right-4 z-[200] hidden items-center gap-2 rounded-full border border-slate-300/70 bg-white/90 px-3 py-1.5 text-xs text-slate-600 shadow-md backdrop-blur supports-[backdrop-filter]:bg-white/70 print:hidden md:flex"
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
