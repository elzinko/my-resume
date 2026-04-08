'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { isCvPrintPreviewPathname } from '@/lib/cv-print-routes';
import { isCvPrintPreviewQuery } from '@/lib/cv-print-preview';

/**
 * Active `html.cv-print-preview` sur le CV long ou le CV court (les query params d'offre s'appliquent à la racine).
 */
export default function FullCvPrintPreviewEffect() {
  const pathname = usePathname();
  const sp = useSearchParams();

  const active =
    isCvPrintPreviewPathname(pathname) &&
    isCvPrintPreviewQuery(new URLSearchParams(sp.toString()));

  useEffect(() => {
    document.documentElement.classList.toggle('cv-print-preview', active);
    return () => document.documentElement.classList.remove('cv-print-preview');
  }, [active]);

  return null;
}
