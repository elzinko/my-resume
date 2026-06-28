'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'cv-zoom';
const DOC_WIDTH = 800; // largeur naturelle du document court (px)
const MIN = 0.5;
const MAX = 2.5;
const STEP = 0.02;

const clamp = (z: number) => Math.min(MAX, Math.max(MIN, z));

function isPrintPreviewUrl(): boolean {
  const sp = new URLSearchParams(window.location.search);
  return sp.has('print') && ['', '1', 'true'].includes(sp.get('print') ?? '');
}

/**
 * Zoom du CV court (écran uniquement). Pilote `--cv-zoom` → `.cv-short-page { zoom }`.
 *
 *  - Vue normale (`/fr/short`) : curseur visible. Défaut = **ajusté à la largeur**
 *    de l'écran (plein écran) ; valeur ajustée persistée (localStorage).
 *  - Aperçu (`?print=1`) : **taille réelle** (zoom 1), curseur masqué — c'est la
 *    feuille A4 à sa taille. (Le PDF lui-même n'est JAMAIS affecté : `@media print`
 *    remet `zoom: 1`, et le curseur est `print:hidden`.)
 *
 * Le curseur est rendu HORS du document zoomé → il ne se zoome pas lui-même.
 */
export default function CvZoomSlider() {
  const [zoom, setZoom] = useState(1);
  const [preview, setPreview] = useState(false);

  const apply = useCallback((z: number, persist = true) => {
    const v = clamp(z);
    setZoom(v);
    document.documentElement.style.setProperty('--cv-zoom', String(v));
    if (persist) localStorage.setItem(STORAGE_KEY, String(v));
  }, []);

  const fitToWidth = useCallback(() => {
    const doc = document.querySelector('.cv-short-page');
    const avail = doc?.parentElement?.clientWidth ?? window.innerWidth;
    return avail / DOC_WIDTH;
  }, []);

  useEffect(() => {
    if (isPrintPreviewUrl()) {
      setPreview(true);
      apply(1, false); // aperçu = taille réelle
      return;
    }
    setPreview(false);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw != null && Number.isFinite(parseFloat(raw))) {
      apply(parseFloat(raw), false); // valeur calée par l'utilisateur
    } else {
      apply(fitToWidth(), false); // défaut = plein largeur
    }
  }, [apply, fitToWidth]);

  if (preview) return null;

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
