'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import MatchClientPill from './MatchClientPill';
import { maxFitCountOneRow } from '@/lib/flex-wrap-one-row-fit';

const MD_MIN = 768;

export interface MatchClientRef {
  client: string;
}

interface MatchClientsOverflowRowProps {
  clients: MatchClientRef[];
  expandAriaLabel: string;
  collapseAriaLabel: string;
}

/**
 * Pastilles client : une seule ligne ; pastille « … » + dépliage seulement si tout ne tient pas
 * (mobile et desktop). À l’impression, tout est visible.
 */
export default function MatchClientsOverflowRow({
  clients,
  expandAriaLabel,
  collapseAriaLabel,
}: MatchClientsOverflowRowProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(() => clients.length);

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

      if (expanded || printing || clients.length === 0) {
        setVisibleCount(clients.length);
        return;
      }

      const outer = outerRef.current;
      const measure = measureRef.current;
      if (!outer || !measure) {
        setVisibleCount(clients.length);
        return;
      }

      const cw = outer.clientWidth;
      if (cw < 1) {
        setVisibleCount(clients.length);
        return;
      }

      const gapPx = window.innerWidth >= MD_MIN ? 8 : 6;

      const widths: number[] = [];
      let maxH = 0;

      for (let i = 0; i < clients.length; i += 1) {
        const el = measure.querySelector(
          `[data-client-measure="${i}"]`,
        ) as HTMLElement | null;
        if (!el) {
          setVisibleCount(clients.length);
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
        setVisibleCount(clients.length);
        return;
      }

      const maxTotalHeightPx = maxH;

      const k = maxFitCountOneRow(widths, moreW, cw, maxH, gapPx, maxTotalHeightPx);
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
  }, [clients, expanded, printing]);

  if (clients.length === 0) return null;

  const showCollapse =
    !expanded &&
    !printing &&
    visibleCount < clients.length;

  const visibleClients = showCollapse
    ? clients.slice(0, visibleCount)
    : clients;

  const showLess = expanded && !printing && clients.length > 0;

  return (
    <div className="relative w-full">
      <div ref={outerRef} className="relative w-full">
        <div
          ref={measureRef}
          className="pointer-events-none absolute left-0 right-0 top-0 z-0 flex flex-wrap gap-1.5 opacity-0 md:gap-2"
          aria-hidden
        >
          {clients.map((c, i) => (
            <span key={c.client} data-client-measure={i}>
              <MatchClientPill client={c.client} />
            </span>
          ))}
          <span data-more-measure>
            <span className="cv-pill-match inline-flex min-w-[1.5rem] items-center justify-center whitespace-nowrap px-1.5 py-0.5 text-[10px] font-medium max-md:min-w-[1.35rem] max-md:px-1 max-md:py-0.5 max-md:text-[9px]">
              …
            </span>
          </span>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-1.5 print:flex print:gap-1 md:gap-2">
          {visibleClients.map((match) => (
            <MatchClientPill key={match.client} client={match.client} />
          ))}
          {showCollapse ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex rounded print:hidden outline-none ring-orange-300/40 focus-visible:ring-2"
              aria-expanded={false}
              aria-label={expandAriaLabel}
            >
              <span className="cv-pill-match inline-flex min-w-[1.5rem] items-center justify-center whitespace-nowrap px-1.5 py-0.5 text-[10px] font-medium max-md:min-w-[1.35rem] max-md:px-1 max-md:py-0.5 max-md:text-[9px]">
                …
              </span>
            </button>
          ) : null}
          {showLess ? (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="inline-flex rounded print:hidden outline-none ring-orange-300/40 focus-visible:ring-2"
              aria-expanded
              aria-label={collapseAriaLabel}
            >
              <span className="cv-pill-match inline-flex min-w-[1.5rem] items-center justify-center whitespace-nowrap px-1.5 py-0.5 text-[10px] font-medium max-md:min-w-[1.35rem] max-md:px-1 max-md:py-0.5 max-md:text-[9px]">
                −
              </span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
