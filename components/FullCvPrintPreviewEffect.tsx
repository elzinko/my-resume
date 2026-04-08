'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { isFullCvRootPathname } from '@/lib/cv-print-routes';

function isPrintPreviewSearch(sp: URLSearchParams): boolean {
  if (!sp.has('print')) return false;
  const v = sp.get('print');
  return v === null || v === '' || v === '1' || v === 'true';
}

/**
 * Active `html.cv-print-preview` quand le CV long est visité avec `?print` ou `?print=1`
 * (aperçu une colonne comme à l’impression).
 */
export default function FullCvPrintPreviewEffect() {
  const pathname = usePathname();
  const sp = useSearchParams();

  const active =
    isFullCvRootPathname(pathname) &&
    isPrintPreviewSearch(new URLSearchParams(sp.toString()));

  useEffect(() => {
    document.documentElement.classList.toggle('cv-print-preview', active);
    return () => document.documentElement.classList.remove('cv-print-preview');
  }, [active]);

  return null;
}
