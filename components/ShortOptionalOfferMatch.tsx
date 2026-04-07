'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import TechMatchDisplay from '@/components/TechMatchDisplay';
import { getOffer } from '@/data/offers';
import {
  computeShortOfferMatchData,
  computeShortUrlMatchData,
} from '@/lib/short-offer-match';
import type { Locale } from 'i18n-config';

interface ShortOptionalOfferMatchProps {
  lang: Locale;
  /** Build-time (`SHORT_CV_OFFER_ID`) — export statique GitHub Pages sans query. */
  defaultOfferId: string | null;
}

export default function ShortOptionalOfferMatch({
  lang,
  defaultOfferId,
}: ShortOptionalOfferMatchProps) {
  const searchParams = useSearchParams();
  const fromQuery = searchParams.get('offer')?.trim() || null;
  const offerId = fromQuery || defaultOfferId;
  const queryKey = searchParams.toString();

  const data = useMemo(() => {
    if (offerId && getOffer(offerId)) {
      return computeShortOfferMatchData(lang, offerId);
    }
    const sp = new URLSearchParams(queryKey);
    return computeShortUrlMatchData(lang, sp);
  }, [lang, offerId, queryKey]);

  if (!data) return null;
  return (
    <TechMatchDisplay
      data={data}
      lang={lang as 'fr' | 'en'}
      variant="compact"
    />
  );
}
