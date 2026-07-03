'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { isCvPrintPreviewQuery } from '@/lib/cv-print-preview';

/**
 * Calibration ÉCRAN → A4 réelle.
 *
 * Le document court fait 800px CSS de large (≈ A4 = 210mm = 794px CSS, car le
 * navigateur mappe TOUJOURS les unités physiques à 96px/pouce, quelle que soit la
 * dalle). Mais 1 px CSS n'a PAS la même taille physique sur tous les écrans : le
 * navigateur ne connaît pas la résolution réelle du moniteur. Sur l'écran de l'auteur
 * (mesuré à la règle : ~79 px/pouce), il faut donc appliquer `zoom: 79/96 ≈ 0.82`
 * pour que le document mesure physiquement 21cm (A4 réelle).
 *
 * → `A4_SCREEN_CAL` = zoom CSS qui rend le CV court à sa TAILLE D'IMPRESSION réelle
 *   (A4) sur CET écran. C'est notre référence « 100 % ». Empirique et propre à l'écran
 *   (à re-mesurer si on change de moniteur). Le PDF, lui, est toujours en A4 exacte
 *   (unités physiques réelles côté imprimante) → il n'a pas besoin de cette calibration.
 */
const A4_SCREEN_CAL = 0.82;

/** Facteur affiché : 1 = 100 % = taille d'impression réelle (A4). Bornes 75 %–150 %. */
const DEFAULT_PCT = 1;
const MIN_PCT = 0.75;
const MAX_PCT = 1.5;
const STEP = 0.05; // pas de 5 % → 75 / 100 / 150 % tombent pile sur un cran

const clamp = (p: number) => Math.min(MAX_PCT, Math.max(MIN_PCT, p));

/**
 * Curseur de zoom du CV court (écran uniquement). Pilote `--cv-zoom` →
 * `.cv-short-page { zoom }`. Visible sur la vue normale ET l'aperçu `?print=1`.
 *
 * **Le pourcentage affiché = fraction de la TAILLE RÉELLE (A4)**, pas un zoom CSS brut :
 *  - **100 %** = le CV court à sa taille d'impression réelle (21cm de large sur l'écran
 *    de l'auteur) → CSS `zoom = A4_SCREEN_CAL`. C'est le défaut, vue normale ET aperçu.
 *  - 75 % … 150 % = fraction de cette taille réelle (CSS `zoom = pct × A4_SCREEN_CAL`).
 *  - **Mobile** (< md, hors aperçu) : pas de mise à l'échelle A4 (le CV se rend en vue
 *    responsive lisible) → `--cv-zoom: 1`. Le curseur est masqué (`md:flex`).
 *
 * Aucune valeur persistée. Le PDF n'est JAMAIS affecté : `@media print` remet `zoom: 1`
 * (A4 réelle imprimée) et le curseur est `print:hidden`.
 */
export default function CvZoomSlider() {
  const [pct, setPct] = useState(DEFAULT_PCT);
  const searchParams = useSearchParams();
  const printMode = isCvPrintPreviewQuery(
    new URLSearchParams(searchParams.toString()),
  );

  /** Applique un pourcentage de taille réelle → CSS `zoom = pct × calibration`. */
  const apply = useCallback((p: number) => {
    const v = clamp(p);
    setPct(v);
    document.documentElement.style.setProperty(
      '--cv-zoom',
      String(v * A4_SCREEN_CAL),
    );
  }, []);

  useEffect(() => {
    // Réappliqué à chaque changement de `?print` (clic sur l'œil = navigation soft).
    // MOBILE hors aperçu → vue responsive (pas de document A4 réduit) : `--cv-zoom: 1`.
    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 767px)').matches;
    if (isMobile && !printMode) {
      setPct(DEFAULT_PCT);
      document.documentElement.style.setProperty('--cv-zoom', '1');
      return;
    }
    // Desktop (vue normale + aperçu) : 100 % = taille réelle A4.
    apply(DEFAULT_PCT);
  }, [apply, printMode]);

  return (
    <div
      className="fixed right-3 top-1.5 z-[120] hidden items-center gap-2 rounded-full border border-slate-300/70 bg-white/90 px-3 py-1.5 text-xs text-slate-600 shadow-md backdrop-blur supports-[backdrop-filter]:bg-white/70 print:hidden md:flex"
      data-testid="cv-zoom-slider"
    >
      <span className="select-none font-medium">Zoom</span>
      <input
        type="range"
        min={MIN_PCT}
        max={MAX_PCT}
        step={STEP}
        value={pct}
        onChange={(e) => apply(parseFloat(e.target.value))}
        className="h-1 w-28 cursor-pointer accent-blue-500"
        aria-label="Zoom du CV (100 % = taille A4 réelle, écran uniquement)"
      />
      <button
        type="button"
        onClick={() => apply(DEFAULT_PCT)}
        className="w-10 select-none text-right tabular-nums hover:text-slate-900"
        title="Revenir à 100 % (taille A4 réelle)"
      >
        {Math.round(pct * 100)}%
      </button>
    </div>
  );
}
