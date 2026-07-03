'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import Pill from './Pill';
import {
  maxFitCountOneRow,
  maxFitCountSingleRowNoMore,
} from '@/lib/flex-wrap-one-row-fit';

const MD_MIN = 768;

export type JobFramework = { id: string; name: string; link?: string };

interface JobFrameworkPillsProps {
  frameworks: JobFramework[];
  /** Pastilles compactes (CV court / print). */
  compact?: boolean;
  /** Classe sur le conteneur relatif (marges, etc.). */
  className?: string;
  /** Libellé accessibilité du bouton « voir plus ». */
  expandAriaLabel: string;
  /** Libellé accessibilité du bouton « réduire » (mobile). */
  collapseAriaLabel: string;
}

/** CV long : ~2 lignes de pastilles (mobile). Le mode compact force une ligne via la hauteur mesurée. */
const MAX_H_REM = { default: 3.1 } as const;

/** Gaps flex (gap-1 / gap-1.5) en px pour coller au layout Tailwind mobile. */
const GAP_PX = { compact: 4, default: 6 } as const;

/** Nombre max de pastilles visibles À L'ÉCRAN sans « tout voir » (CV long : 1 ligne + « … »). */
const MAX_VISIBLE_WHEN_COLLAPSED = 10;

/**
 * Pastilles techno :
 * - **CV long à l'écran** : fit 1 ligne (desktop/tablette) ou ~2 lignes (mobile),
 *   plafonné à {@link MAX_VISIBLE_WHEN_COLLAPSED} + bouton « … » (déplier).
 * - **CV long à l'impression** (PDF ⌘P + aperçu `?print`) : TOUTES les pastilles
 *   (catalogue complet), sur plusieurs lignes — pas de troncature ni de « … ».
 * - **CV court (`compact`)** : une seule ligne mesurée à l'écran, plafonnée à 10 ;
 *   à l'impression aussi (le short doit tenir sur 1 page A4).
 */
export default function JobFrameworkPills({
  frameworks,
  compact = false,
  className = '',
  expandAriaLabel,
  collapseAriaLabel,
}: JobFrameworkPillsProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(MAX_VISIBLE_WHEN_COLLAPSED, frameworks.length),
  );
  /** Évite l’erreur d’hydratation : pas de `<button>` avant le premier layout (serveur ≠ client `window`). */
  const [layoutReady, setLayoutReady] = useState(false);

  const gapClass = compact ? 'gap-1' : 'gap-1.5 md:gap-2';
  const rem = MAX_H_REM.default;
  const gapPx = GAP_PX[compact ? 'compact' : 'default'];

  useLayoutEffect(() => {
    const onBeforePrint = () => setPrinting(true);
    const onAfterPrint = () => setPrinting(false);
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeprint', onBeforePrint);
      window.addEventListener('afterprint', onAfterPrint);
    }
    return () => {
      window.removeEventListener('beforeprint', onBeforePrint);
      window.removeEventListener('afterprint', onAfterPrint);
    };
  }, []);

  useLayoutEffect(() => {
    const compute = () => {
      if (typeof window === 'undefined') return;

      if (frameworks.length === 0) {
        setVisibleCount(0);
        return;
      }

      const cap = MAX_VISIBLE_WHEN_COLLAPSED;

      // Régime « impression » de l'APERÇU : `.cv-print-preview` sur <html> (posé par
      // `?print` ET pendant ⌘P). Le CV court /short l'a en permanence → on ne s'y fie
      // QUE pour le CV long (`!compact`), sinon on casserait le fit mesuré du short écran.
      const inPrintPreview =
        typeof document !== 'undefined' &&
        document.documentElement.classList.contains('cv-print-preview');

      /** CV LONG en impression (PDF via `printing` OU aperçu `.cv-print-preview`) :
          on affiche TOUTES les pastilles techno (catalogue complet), sur plusieurs
          lignes si besoin — le conteneur est `flex-wrap` (écran) / `print:max-h-none`. */
      if (!compact && (printing || inPrintPreview)) {
        setVisibleCount(frameworks.length);
        return;
      }

      /** CV COURT en impression (⌘P) : au plus `cap` (le short doit tenir sur 1 page A4). */
      if (printing) {
        setVisibleCount(Math.min(cap, frameworks.length));
        return;
      }

      /** CV court : une ligne mesurée, plafonnée à `cap`. */
      if (compact) {
        const outer = outerRef.current;
        const measure = measureRef.current;
        if (!outer || !measure) {
          setVisibleCount(Math.min(cap, frameworks.length));
          return;
        }
        const cw = outer.clientWidth;
        if (cw < 1) {
          setVisibleCount(Math.min(cap, frameworks.length));
          return;
        }
        const widths: number[] = [];
        let maxH = 0;
        for (let i = 0; i < frameworks.length; i += 1) {
          const el = measure.querySelector(
            `[data-fw-measure="${i}"]`,
          ) as HTMLElement | null;
          if (!el) {
            setVisibleCount(Math.min(cap, frameworks.length));
            return;
          }
          widths.push(el.offsetWidth);
          maxH = Math.max(maxH, el.offsetHeight);
        }
        const moreEl = measure.querySelector(
          '[data-more-measure]',
        ) as HTMLElement | null;
        const moreW = moreEl?.offsetWidth ?? 0;
        if (maxH < 1 || moreW < 1) {
          setVisibleCount(Math.min(cap, frameworks.length));
          return;
        }
        const rootFont = parseFloat(
          getComputedStyle(document.documentElement).fontSize || '16',
        );
        const maxHPx = maxH + 2;
        const k = maxFitCountSingleRowNoMore(widths, cw, maxH, gapPx, maxHPx);
        setVisibleCount(Math.min(cap, k));
        return;
      }

      /** CV long : tout voir si étendu. */
      if (expanded) {
        setVisibleCount(frameworks.length);
        return;
      }

      /** Desktop / tablette : UNE seule ligne, « … » garanti EN FIN DE 1re ligne.
          Mobile : ~2 lignes. Fit mesuré dynamiquement (« … » réservé), plafond `cap`. */
      const outer = outerRef.current;
      const measure = measureRef.current;
      if (!outer || !measure) {
        setVisibleCount(Math.min(cap, frameworks.length));
        return;
      }
      const cw = outer.clientWidth;
      if (cw < 1) {
        setVisibleCount(Math.min(cap, frameworks.length));
        return;
      }
      const widths: number[] = [];
      let maxH = 0;
      for (let i = 0; i < frameworks.length; i += 1) {
        const el = measure.querySelector(
          `[data-fw-measure="${i}"]`,
        ) as HTMLElement | null;
        if (!el) {
          setVisibleCount(Math.min(cap, frameworks.length));
          return;
        }
        widths.push(el.offsetWidth);
        maxH = Math.max(maxH, el.offsetHeight);
      }
      const moreEl = measure.querySelector(
        '[data-more-measure]',
      ) as HTMLElement | null;
      const moreW = moreEl?.offsetWidth ?? 0;
      if (maxH < 1 || moreW < 1) {
        setVisibleCount(Math.min(cap, frameworks.length));
        return;
      }
      const rootFont = parseFloat(
        getComputedStyle(document.documentElement).fontSize || '16',
      );
      // ≥768 (desktop/tablette) → 1 ligne (maxH+2) ; <768 (mobile) → ~2 lignes.
      const maxHPx = window.innerWidth >= MD_MIN ? maxH + 2 : rem * rootFont;
      // Gap RÉEL du conteneur (gap-1.5=6px mobile, md:gap-2=8px ≥768) : sinon le
      // calcul sous-estime et une pastille passe en 2e ligne au lieu du « … ».
      const rowGapPx = parseFloat(getComputedStyle(measure).columnGap) || gapPx;
      const k = maxFitCountOneRow(widths, moreW, cw, maxH, rowGapPx, maxHPx);
      setVisibleCount(Math.min(cap, k));
    };

    compute();

    const outer = outerRef.current;
    const ro = new ResizeObserver(compute);
    if (outer) ro.observe(outer);

    const onResize = () => compute();
    window.addEventListener('resize', onResize);

    // Aperçu impression : l'œil bascule `.cv-print-preview` sur <html> sans changer
    // les props → on recalcule quand cette classe apparaît/disparaît (CV long : tout
    // voir en aperçu, revenir au fit 1 ligne à la sortie).
    const classObserver = new MutationObserver(compute);
    if (typeof document !== 'undefined') {
      classObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    setLayoutReady(true);

    return () => {
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      classObserver.disconnect();
    };
  }, [frameworks, expanded, printing, compact, rem, gapPx]);

  if (frameworks.length === 0) return null;

  const showCollapse =
    layoutReady &&
    !compact &&
    !expanded &&
    !printing &&
    visibleCount < frameworks.length;

  const visibleFrameworks = frameworks.slice(0, visibleCount);

  const showLess =
    layoutReady && !compact && expanded && !printing && frameworks.length > 0;

  return (
    <div
      className={`relative w-full ${
        compact ? 'mt-1.5' : 'py-2'
      } ${className}`.trim()}
    >
      {/* Couche de mesure : même largeur que le bloc visible, hors flux. */}
      <div ref={outerRef} className="relative w-full">
        <div
          ref={measureRef}
          className={`pointer-events-none absolute left-0 right-0 top-0 z-0 flex flex-wrap ${gapClass} opacity-0`}
          aria-hidden
        >
          {frameworks.map((fw, i) => (
            <span key={fw.id} data-fw-measure={i}>
              <Pill color="jobs" compact={compact}>
                {fw.name.toLowerCase()}
              </Pill>
            </span>
          ))}
          <span data-more-measure>
            <Pill color="jobs" compact={compact}>
              …
            </Pill>
          </span>
        </div>

        <div
          className={
            compact
              ? `relative z-10 flex flex-nowrap overflow-hidden ${gapClass} print:flex-wrap print:overflow-visible`
              : `relative z-10 flex flex-wrap ${gapClass} print:flex print:max-h-none print:overflow-visible`
          }
        >
          {visibleFrameworks.map((fw) => (
            <Pill key={fw.id} color="jobs" compact={compact}>
              {fw.name.toLowerCase()}
            </Pill>
          ))}
          {showCollapse ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex rounded outline-none ring-cv-jobs/40 focus-visible:ring-2"
              aria-expanded={false}
              aria-label={expandAriaLabel}
            >
              <Pill color="jobs" compact={compact}>
                …
              </Pill>
            </button>
          ) : null}
          {showLess ? (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="inline-flex rounded outline-none ring-cv-jobs/40 focus-visible:ring-2"
              aria-expanded={true}
              aria-label={collapseAriaLabel}
            >
              <Pill color="jobs" compact={compact}>
                −
              </Pill>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
