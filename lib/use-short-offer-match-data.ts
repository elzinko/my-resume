'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { computeShortUrlMatchData } from '@/lib/short-offer-match';
import type { MatchDisplayData } from '@/lib/match-display-types';
import type { Locale } from 'i18n-config';

/**
 * Resolution d'offre dynamique (query params) pour le bloc "Adequation" du CV court.
 */
export function useShortOfferMatchData(
  lang: Locale,
): MatchDisplayData | null {
  const searchParams = useSearchParams();
  const queryKey = searchParams.toString();

  return useMemo(() => {
    const sp = new URLSearchParams(queryKey);
    return computeShortUrlMatchData(lang, sp);
  }, [lang, queryKey]);
}
