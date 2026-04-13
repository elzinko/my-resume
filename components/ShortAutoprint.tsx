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

    let cancelled = false;
    let printed = false;

    const doPrint = () => {
      if (cancelled || printed) return;
      printed = true;
      window.print();
    };

    // Wait for fonts, then wait for a paint cycle
    document.fonts.ready.then(() => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(doPrint);
      });
    });

    // Safety net in case fonts.ready is slow
    const fallback = window.setTimeout(doPrint, 2000);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, [searchParams]);

  return null;
}
