'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { safePrint } from '@/lib/safe-print';

/**
 * Sur n'importe quelle route CV avec `?autoprint=1` (complet `/[lang]` ou court
 * `/[lang]/short`), ouvre la boîte d'impression une fois le rendu prêt — utilisé
 * quand un onglet est ouvert pour imprimer (ex. sélecteur d'impression mobile).
 * Attente polices + paint déléguée à `safePrint` (même garde-fou que le bouton).
 */
export default function CvAutoprint() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('autoprint') !== '1') return;
    return safePrint();
  }, [searchParams]);

  return null;
}
