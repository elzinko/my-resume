'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { isCvPrintPreviewPathname } from '@/lib/cv-print-routes';
import { isCvPrintPreviewQuery } from '@/lib/cv-print-preview';

/**
 * Active `html.cv-print-preview` sur le CV long ou le CV court :
 * - en permanence si l'URL porte `?print` (aperçu écran) ;
 * - temporairement pendant un vrai `window.print()` (Cmd+P) via `beforeprint` /
 *   `afterprint`, pour que tout le CSS `.cv-print-preview …` (masquage du
 *   niveau de formation, Contact 3-col remplacé par le contact strip, ordre
 *   Studies après Jobs, projets en ligne, pas de saut de page avant Jobs,
 *   titres projets bleus…) s'applique aussi à l'impression navigateur.
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

  useEffect(() => {
    // Activer `.cv-print-preview` pendant Cmd+P sur le CV long ET le CV court.
    // Les règles `.cv-print-preview .cv-full-cv-print-root …` ne matchent que
    // le CV long (pas de `.cv-full-cv-print-root` dans le short). Le short
    // bénéficie de `.cv-print-preview .cv-layout-short …` (badge, etc.).
    if (!isCvPrintPreviewPathname(pathname)) return;
    const root = document.documentElement;
    const onBeforePrint = () => root.classList.add('cv-print-preview');
    const onAfterPrint = () => {
      if (!active) root.classList.remove('cv-print-preview');
    };
    window.addEventListener('beforeprint', onBeforePrint);
    window.addEventListener('afterprint', onAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', onBeforePrint);
      window.removeEventListener('afterprint', onAfterPrint);
    };
  }, [pathname, active]);

  return null;
}
