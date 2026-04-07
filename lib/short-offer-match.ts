import type { MatchDisplayData } from '@/components/TechMatchDisplay';
import bundleJson from '@/data/cv/bundle.json';
import { getOffer } from '@/data/offers';
import { enrichJobOfferRequirements } from '@/lib/match-catalog';
import {
  buildMatchCatalogFromBundle,
  type CvSliceForMatchCatalog,
} from '@/lib/match-catalog-from-bundle';
import { resolveOfferFromUrlParams } from '@/lib/query-offer-params';
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

/** CV court : au plus N lignes (offre catalogue ou paramètres GET). */
export const SHORT_PROFILE_MATCH_MAX = 3;

function hasReadableMatchParams(sp: URLSearchParams): boolean {
  const hasSpec = Boolean(sp.get('spec')?.trim());
  const hasCompany = Boolean(sp.get('company')?.trim());
  const hasReq =
    sp.getAll('requirement').length > 0 || sp.getAll('req').length > 0;
  return hasSpec || (hasCompany && hasReq);
}

/**
 * Même résolution que `MatchOfferClient` (spec / company + requirement), données bundle — pour `/short?company=…`.
 */
export function computeShortUrlMatchData(
  locale: Locale,
  sp: URLSearchParams,
): MatchDisplayData | null {
  if (!hasReadableMatchParams(sp)) return null;

  const offer = resolveOfferFromUrlParams(sp, matchCatalog());
  if (!offer) return null;

  const slice = locale === 'fr' ? b.fr : b.en;
  const jobs: JobForMatching[] = (slice.allJobsModels || []) as JobForMatching[];

  const entries = buildMatchEntries(offer.requirements, jobs);

  return { entries: entries.slice(0, SHORT_PROFILE_MATCH_MAX) };
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

  return { entries: entries.slice(0, SHORT_PROFILE_MATCH_MAX) };
}
