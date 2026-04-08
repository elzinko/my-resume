'use client';

import TechMatchDisplay from '@/components/TechMatchDisplay';
import { useShortOfferMatchData } from '@/lib/use-short-offer-match-data';
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
  const data = useShortOfferMatchData(lang, defaultOfferId);
  if (!data) return null;
  return <TechMatchDisplay data={data} lang={lang as 'fr' | 'en'} />;
}
