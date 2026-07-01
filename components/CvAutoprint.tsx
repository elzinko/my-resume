'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { safePrint } from '@/lib/safe-print';

/**
 * Sur n'importe quelle route CV avec `?autoprint=1` (complet `/[lang]` ou court
 * `/[lang]/short`), ouvre la boîte d'impression une fois le rendu prêt — utilisé
 * quand un onglet est ouvert pour imprimer (ex. sélecteur d'impression mobile).
 * Attente polices + paint déléguée à `safePrint` (même garde-fou que le bouton).
 *
 * `autoprint` est un ordre ONE-SHOT : une fois l'impression lancée, on le retire
 * de l'URL. Sinon il reste dans les query params et TOUTE navigation qui les
 * préserve (œil aperçu, bascule court/complet, langue) relancerait l'impression.
 */
export default function CvAutoprint() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams.get('autoprint') !== '1') return;
    return safePrint(() => {
      const sp = new URLSearchParams(searchParams.toString());
      sp.delete('autoprint');
      const q = sp.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    });
  }, [searchParams, router, pathname]);

  return null;
}
