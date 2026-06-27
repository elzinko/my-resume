'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { isCvPrintPreviewQuery } from '@/lib/cv-print-preview';

/** Largeur A4 à 96 dpi : 210mm ≈ 794px. Le document est rendu à CETTE largeur fixe. */
const A4_WIDTH = 794;

/**
 * Document à largeur A4 FIXE (794px) mis à l'ÉCHELLE pour l'écran — ADR-0004
 * Option B (WYSIWYG « vectoriel »).
 *
 *  - défaut (`print=0`)  : `scale` pour REMPLIR la largeur dispo (le doc suit la
 *    largeur de la fenêtre, proportions inchangées) ;
 *  - `?print=1`          : `scale(1)` → taille RÉELLE (21 cm), centré (feuille A4).
 *
 * Le rendu ne change jamais : SEUL le zoom change. À l'impression, aucune
 * transformation (reset `@media print`) → Puppeteer rend l'A4 brut (PDF intact).
 * Sur mobile (< 768px) : pas de scale, la vue reflow écran reste prioritaire.
 */
export default function ScaledA4({ children }: { children: React.ReactNode }) {
  const sp = useSearchParams();
  const realSize = isCvPrintPreviewQuery(new URLSearchParams(sp.toString()));
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [outerH, setOuterH] = useState<number | undefined>(undefined);
  const [enabled, setEnabled] = useState(false);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const compute = () => {
      const desktop = window.matchMedia('(min-width: 768px)').matches;
      setEnabled(desktop);
      if (!desktop) {
        setScale(1);
        setOuterH(undefined);
        return;
      }
      const avail = outer.clientWidth;
      const s = realSize ? 1 : avail / A4_WIDTH;
      setScale(s);
      setOuterH(inner.offsetHeight * s);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(outer);
    ro.observe(inner);
    const mq = window.matchMedia('(min-width: 768px)');
    mq.addEventListener('change', compute);
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', compute);
    };
  }, [realSize]);

  return (
    <div
      ref={outerRef}
      className="cv-a4-scale-outer"
      style={enabled ? { height: outerH } : undefined}
    >
      <div
        ref={innerRef}
        className={`cv-a4-scale-inner${enabled ? ' cv-a4-scaled' : ''}`}
        style={
          enabled
            ? {
                width: A4_WIDTH,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                marginInline: realSize ? 'auto' : undefined,
              }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
