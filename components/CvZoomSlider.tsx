'use client';

import { useCallback, useEffect, useState } from 'react';

/** Zoom par défaut du CV court à l'ÉCRAN : 100 % (1:1 CSS px), identique en vue
 *  normale ET en aperçu print. Le curseur ajuste ; le bouton % réinitialise à 100 %.
 *  Plancher volontairement à 75 %. (Plus de « plein écran » auto : on veut la taille
 *  réelle par défaut, pas un zoom dépendant de la largeur d'écran.) */
const DEFAULT_ZOOM = 1;
const MIN = 0.75;
const MAX = 2.5;
const STEP = 0.02;

const clamp = (z: number) => Math.min(MAX, Math.max(MIN, z));

/**
 * Curseur de zoom du CV court (écran uniquement). Pilote `--cv-zoom` →
 * `.cv-short-page { zoom }`. Visible sur DESKTOP (≥ md) uniquement — masqué sur mobile.
 *
 * Défaut = **100 %** (1:1), identique vue normale et aperçu print. Le curseur permet
 * un ajustement ponctuel ; le bouton % réinitialise à 100 %. Aucune valeur persistée.
 *
 * Le PDF n'est JAMAIS affecté : `@media print` remet `zoom: 1`, et le curseur est
 * `print:hidden`. Rendu HORS du document zoomé → il ne se zoome pas lui-même.
 */
export default function CvZoomSlider() {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const apply = useCallback((z: number) => {
    const v = clamp(z);
    setZoom(v);
    document.documentElement.style.setProperty('--cv-zoom', String(v));
  }, []);

  useEffect(() => {
    // Défaut 100 % au montage (écran). Pas de dépendance au mode ni à la largeur.
    apply(DEFAULT_ZOOM);
  }, [apply]);

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
        onClick={() => apply(DEFAULT_ZOOM)}
        className="w-10 select-none text-right tabular-nums hover:text-slate-900"
        title="Réinitialiser le zoom à 100 %"
      >
        {Math.round(zoom * 100)}%
      </button>
    </div>
  );
}
