'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { getOffer } from '@/data/offers';
import {
  computeShortOfferMatchData,
  computeShortUrlMatchData,
} from '@/lib/short-offer-match';
import type { MatchDisplayData } from '@/components/TechMatchDisplay';
import type { Locale } from 'i18n-config';

/**
 * Même résolution d’offre / query que le bloc « Adéquation » du CV court.
 */
export function useShortOfferMatchData(
  lang: Locale,
  defaultOfferId: string | null,
): MatchDisplayData | null {
  const searchParams = useSearchParams();
  const fromQuery = searchParams.get('offer')?.trim() || null;
  const offerId = fromQuery || defaultOfferId;
  const queryKey = searchParams.toString();

  return useMemo(() => {
    if (offerId && getOffer(offerId)) {
      return computeShortOfferMatchData(lang, offerId);
    }
    const sp = new URLSearchParams(queryKey);
    return computeShortUrlMatchData(lang, sp);
  }, [lang, offerId, queryKey]);
}
