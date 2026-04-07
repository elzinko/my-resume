import type { MatchDisplayData } from '@/components/TechMatchDisplay';
import bundleJson from '@/data/cv/bundle.json';
import { getOffer } from '@/data/offers';
import { enrichJobOfferRequirements } from '@/lib/match-catalog';
import {
  buildMatchCatalogFromBundle,
  type CvSliceForMatchCatalog,
} from '@/lib/match-catalog-from-bundle';
import { buildMatchEntries, type JobForMatching } from '@/lib/tech-match-core';
import type { Locale } from '../i18n-config';

const b = bundleJson as {
  fr: CvSliceForMatchCatalog & { allJobsModels?: JobForMatching[] };
  en: CvSliceForMatchCatalog & { allJobsModels?: JobForMatching[] };
};

let catalogCache: ReturnType<typeof buildMatchCatalogFromBundle> | null = null;

function matchCatalog(): ReturnType<typeof buildMatchCatalogFromBundle> {
  if (!catalogCache) {
    catalogCache = buildMatchCatalogFromBundle({ fr: b.fr, en: b.en });
  }
  return catalogCache;
}

/** Même logique que `TechMatch` (RSC) mais synchrone — pour le CV court en export statique / hydratation client. */
export function computeShortOfferMatchData(
  locale: Locale,
  offerId: string,
): MatchDisplayData | null {
  const offer = getOffer(offerId);
  if (!offer) return null;

  const slice = locale === 'fr' ? b.fr : b.en;
  const jobs: JobForMatching[] = (slice.allJobsModels || []) as JobForMatching[];

  const entries = buildMatchEntries(
    enrichJobOfferRequirements(offer, matchCatalog()).requirements,
    jobs,
  );

  return { entries };
}
