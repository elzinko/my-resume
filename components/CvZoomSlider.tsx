'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'cv-zoom';
const MIN = 0.5;
const MAX = 1.8;
const STEP = 0.02;

const clamp = (z: number) => Math.min(MAX, Math.max(MIN, z));

/**
 * Curseur de zoom MANUEL du CV (écran uniquement) — pour caler la taille à l'œil
 * et comparer avec le PDF « taille réelle ». Pilote la variable CSS `--cv-zoom`
 * (consommée par `.cv-short-page { zoom: var(--cv-zoom, 1) }`). Persisté en
 * localStorage. Masqué à l'impression (`print:hidden`) et neutralisé en `@media
 * print` (`zoom: 1`) → le PDF n'est JAMAIS affecté. Le curseur est rendu HORS du
 * document zoomé → il ne se zoome pas lui-même.
 */
export default function CvZoomSlider() {
  const [zoom, setZoom] = useState(1);

  const apply = useCallback((z: number, persist = true) => {
    const v = clamp(z);
    setZoom(v);
    document.documentElement.style.setProperty('--cv-zoom', String(v));
    if (persist) localStorage.setItem(STORAGE_KEY, String(v));
  }, []);

  useEffect(() => {
    const saved = parseFloat(localStorage.getItem(STORAGE_KEY) || '1');
    apply(Number.isFinite(saved) ? saved : 1, false);
  }, [apply]);

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
        onClick={() => apply(1)}
        className="w-9 select-none text-right tabular-nums hover:text-slate-900"
        title="Réinitialiser à 100 %"
      >
        {Math.round(zoom * 100)}%
      </button>
    </div>
  );
}
