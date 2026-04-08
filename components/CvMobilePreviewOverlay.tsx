'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  buildCvMobilePreviewIframeSrc,
  CV_VIEWPORT_PARAM,
  CV_VIEWPORT_MOBILE_VALUE,
  isCvViewportMobileQuery,
  searchParamsWithoutCvViewport,
} from '@/lib/cv-viewport-mobile';

/**
 * Mode dev : `?cvViewport=mobile` ouvre une couche plein écran avec iframe ~390px
 * (vrais breakpoints Tailwind `max-md`), l’URL reste sur la même page avec paramètre visible.
 */
export default function CvMobilePreviewOverlay() {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const router = useRouter();
  const [iframeSrc, setIframeSrc] = useState('');

  const active = useMemo(
    () => isCvViewportMobileQuery(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const close = useCallback(() => {
    const next = searchParamsWithoutCvViewport(searchParams.toString());
    router.replace(next ? `${pathname}?${next}` : pathname);
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (!active || typeof window === 'undefined') {
      setIframeSrc('');
      return;
    }
    setIframeSrc(
      buildCvMobilePreviewIframeSrc(pathname, new URLSearchParams(searchParams.toString())),
    );
  }, [active, pathname, searchParams]);

  useEffect(() => {
    if (!active) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, close]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-slate-900/50 print:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Aperçu mobile du CV"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-600/80 bg-slate-900 px-3 py-2 text-white">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Aperçu mobile</p>
          <p className="truncate font-mono text-[10px] text-slate-400">
            {CV_VIEWPORT_PARAM}={CV_VIEWPORT_MOBILE_VALUE}
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          onClick={close}
        >
          Fermer
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center p-3">
        {iframeSrc ? (
          <iframe
            title="CV — largeur mobile"
            src={iframeSrc}
            className="h-[min(844px,calc(100vh-5.5rem))] w-[390px] max-w-full rounded-xl border border-slate-500/60 bg-white shadow-2xl"
          />
        ) : (
          <div className="text-sm text-white/80">Chargement…</div>
        )}
      </div>
    </div>
  );
}
