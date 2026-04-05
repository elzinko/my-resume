'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import Pill from './Pill';

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

/** Hauteur totale autorisée (2 lignes de pastilles), en rem — aligné sur les anciennes classes max-h. */
const MAX_H_REM = { compact: 2.65, default: 3.1 } as const;

/** Gaps flex (gap-1 / gap-1.5) en px pour coller au layout Tailwind mobile. */
const GAP_PX = { compact: 4, default: 6 } as const;

function layoutHeightPx(
  itemWidths: number[],
  moreWidth: number | null,
  containerWidth: number,
  itemHeight: number,
  gap: number,
): number {
  const items =
    moreWidth != null ? [...itemWidths, moreWidth] : itemWidths;
  if (items.length === 0) return 0;

  let rowWidth = 0;
  let rows = 1;

  for (const w of items) {
    const gapSpace = rowWidth > 0 ? gap : 0;
    if (rowWidth + gapSpace + w > containerWidth && rowWidth > 0) {
      rows += 1;
      rowWidth = w;
    } else if (rowWidth + gapSpace + w > containerWidth && rowWidth === 0) {
      rowWidth = w;
    } else {
      rowWidth += gapSpace + w;
    }
  }

  return rows * itemHeight + (rows - 1) * gap;
}

/** Nombre de technos affichées avant la pastille « … » (mobile replié uniquement). */
function maxFitCount(
  widths: number[],
  moreW: number,
  cw: number,
  H: number,
  gap: number,
  maxH: number,
): number {
  const n = widths.length;
  const epsilon = 2;

  if (layoutHeightPx(widths, null, cw, H, gap) <= maxH + epsilon) {
    return n;
  }

  for (let k = n - 1; k >= 0; k -= 1) {
    if (layoutHeightPx(widths.slice(0, k), moreW, cw, H, gap) <= maxH + epsilon) {
      return k;
    }
  }

  return 0;
}

/**
 * Pastilles techno : sur viewport &lt; md, ~2 lignes + dernière pastille « … » (même composant `Pill` que les autres) ;
 * clic développe tout. À partir de md, tout visible.
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
  const rem = MAX_H_REM[compact ? 'compact' : 'default'];
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

      if (
        window.innerWidth >= MD_MIN ||
        expanded ||
        printing ||
        frameworks.length === 0
      ) {
        setVisibleCount(frameworks.length);
        return;
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
      const maxHPx = rem * rootFont;

      const k = maxFitCount(widths, moreW, cw, maxH, gapPx, maxHPx);
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
    typeof window !== 'undefined' &&
    window.innerWidth < MD_MIN &&
    !expanded &&
    !printing &&
    visibleCount < frameworks.length;

  const visibleFrameworks =
    showCollapse ? frameworks.slice(0, visibleCount) : frameworks;

  const showLess =
    expanded &&
    isBelowMd &&
    !printing &&
    frameworks.length > 0;

  return (
    <div
      className={`relative w-full ${compact ? 'mt-1.5' : 'py-2'} ${className}`.trim()}
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
          className={`relative z-10 flex flex-wrap ${gapClass} print:flex print:max-h-none print:overflow-visible`}
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
