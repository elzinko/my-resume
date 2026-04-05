import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import { getOffer } from '@/data/offers';
import TechMatchDisplay from '@/components/TechMatchDisplay';
import type { MatchDisplayData } from '@/components/TechMatchDisplay';
import {
  buildMatchEntries,
  type JobForMatching,
} from '@/lib/tech-match-core';

interface TechMatchProps {
  locale: Locale;
  offerId: string;
}

export default async function TechMatch({ locale, offerId }: TechMatchProps) {
  const offer = getOffer(offerId);
  if (!offer) return null;

  const data: any = await getCvData(locale);
  const jobs: JobForMatching[] = data?.allJobsModels || [];

  const entries = buildMatchEntries(offer.requirements, jobs);

  const matchData: MatchDisplayData = {
    entries,
  };

  return <TechMatchDisplay data={matchData} lang={locale as 'fr' | 'en'} />;
}
