'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Sur `/[lang]/short?autoprint=1`, ouvre la boîte d’impression une fois le rendu prêt
 * (onglet ouvert depuis la page CV complète).
 */
export default function ShortAutoprint() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('autoprint') !== '1') return;

    const t = window.setTimeout(() => {
      window.print();
    }, 400);

    return () => window.clearTimeout(t);
  }, [searchParams]);

  return null;
}
