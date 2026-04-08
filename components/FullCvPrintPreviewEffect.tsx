'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { isFullCvRootPathname } from '@/lib/cv-print-routes';
import { isCvPrintPreviewQuery } from '@/lib/cv-print-preview';

/**
 * Active `html.cv-print-preview` quand le CV long est visité avec `?print` ou `?print=1`
 * (aperçu une colonne comme à l’impression).
 */
export default function FullCvPrintPreviewEffect() {
  const pathname = usePathname();
  const sp = useSearchParams();

  const active =
    isFullCvRootPathname(pathname) &&
    isCvPrintPreviewQuery(new URLSearchParams(sp.toString()));

  useEffect(() => {
    document.documentElement.classList.toggle('cv-print-preview', active);
    return () => document.documentElement.classList.remove('cv-print-preview');
  }, [active]);

  return null;
}
