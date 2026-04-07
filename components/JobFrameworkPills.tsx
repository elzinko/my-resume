'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import Pill from './Pill';
import {
  maxFitCountOneRow,
  maxFitCountSingleRowNoMore,
} from '@/lib/flex-wrap-one-row-fit';

const MD_MIN = 768;

function useIsBelowMd() {
  const [below, setBelow] = useState(false);
  useLayoutEffect(() => {
    const run = () => setBelow(window.innerWidth < MD_MIN);
    run();
    window.addEventListener('resize', run);
    return () => window.removeEventListener('resize', run);
  }, []);
  return below;
}

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

/**
 * Pastilles techno : sur viewport &lt; md (CV long), ~2 lignes + pastille « … », clic pour tout voir.
 * À partir de md (CV long), tout visible. **CV court (`compact`)** : une seule ligne, sans « … », le surplus est masqué.
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
  const [visibleCount, setVisibleCount] = useState(() => frameworks.length);
  const isBelowMd = useIsBelowMd();

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

      /** Impression : tout afficher (le mode compact coupe sinon avec overflow + une ligne). */
      if (printing) {
        setVisibleCount(frameworks.length);
        return;
      }

      /** CV court : toujours une ligne (y compris desktop), sans pastille « … ». */
      if (!compact) {
        if (
          window.innerWidth >= MD_MIN ||
          expanded ||
          printing
        ) {
          setVisibleCount(frameworks.length);
          return;
        }
      }

      const outer = outerRef.current;
      const measure = measureRef.current;
      if (!outer || !measure) {
        setVisibleCount(frameworks.length);
        return;
      }

      const cw = outer.clientWidth;
      if (cw < 1) {
        setVisibleCount(frameworks.length);
        return;
      }

      const widths: number[] = [];
      let maxH = 0;

      for (let i = 0; i < frameworks.length; i += 1) {
        const el = measure.querySelector(
          `[data-fw-measure="${i}"]`,
        ) as HTMLElement | null;
        if (!el) {
          setVisibleCount(frameworks.length);
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
        setVisibleCount(frameworks.length);
        return;
      }

      const rootFont = parseFloat(
        getComputedStyle(document.documentElement).fontSize || '16',
      );
      /** Une seule rangée de pastilles : budget hauteur = hauteur d’une pastille (+ marge). */
      const maxHPx = compact ? maxH + 2 : rem * rootFont;

      const k = compact
        ? maxFitCountSingleRowNoMore(widths, cw, maxH, gapPx, maxHPx)
        : maxFitCountOneRow(widths, moreW, cw, maxH, gapPx, maxHPx);

      setVisibleCount(k);
    };

    compute();

    const outer = outerRef.current;
    const ro = new ResizeObserver(compute);
    if (outer) ro.observe(outer);

    const onResize = () => compute();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [frameworks, expanded, printing, compact, rem, gapPx]);

  if (frameworks.length === 0) return null;

  const showCollapse =
    !compact &&
    typeof window !== 'undefined' &&
    window.innerWidth < MD_MIN &&
    !expanded &&
    !printing &&
    visibleCount < frameworks.length;

  const visibleFrameworks = frameworks.slice(0, visibleCount);

  const showLess =
    !compact &&
    expanded &&
    isBelowMd &&
    !printing &&
    frameworks.length > 0;

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
