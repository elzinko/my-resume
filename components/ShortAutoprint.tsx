'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { safePrint } from '@/lib/safe-print';

/**
 * Sur `/[lang]/short?autoprint=1`, ouvre la boîte d’impression une fois le rendu prêt
 * (onglet ouvert depuis la page CV complète). Attente polices + paint déléguée à
 * `safePrint` (même garde-fou que le bouton imprimer de la toolbar).
 */
export default function ShortAutoprint() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('autoprint') !== '1') return;
    return safePrint();
  }, [searchParams]);

  return null;
}
