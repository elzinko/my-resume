import type { MatchDisplayData } from '@/lib/match-display-types';
import experienceJson from '@/data/cv/experience.json';
import localeFrJson from '@/data/cv/locales/fr.json';
import localeEnJson from '@/data/cv/locales/en.json';
import profileJson from '@/data/cv/profile.json';
import techCatalogJson from '@/data/cv/tech-catalog.json';
import { composeCvSnapshot } from '@/lib/cv-compose';
import type {
  Experience,
  LocaleBundle,
  Profile,
  TechCatalog,
} from '@/lib/cv-compose';
import {
  buildMatchCatalogFromBundle,
  type CvSliceForMatchCatalog,
} from '@/lib/match-catalog-from-bundle';
import { resolveOfferFromUrlParams } from '@/lib/query-offer-params';
import { buildMatchEntries, type JobForMatching } from '@/lib/tech-match-core';
import type { Locale } from '../i18n-config';

type CvSlice = CvSliceForMatchCatalog & { allJobsModels?: JobForMatching[] };

let cachedSlices: { fr: CvSlice; en: CvSlice } | null = null;
function getSlices(): { fr: CvSlice; en: CvSlice } {
  if (!cachedSlices) {
    const base = {
      profile: profileJson as Profile,
      techCatalog: techCatalogJson as TechCatalog,
      experience: experienceJson as Experience,
    };
    cachedSlices = {
      fr: composeCvSnapshot('fr', {
        ...base,
        locale: localeFrJson as LocaleBundle,
      }) as unknown as CvSlice,
      en: composeCvSnapshot('en', {
        ...base,
        locale: localeEnJson as LocaleBundle,
      }) as unknown as CvSlice,
    };
  }
  return cachedSlices;
}

let catalogCache: ReturnType<typeof buildMatchCatalogFromBundle> | null = null;

function matchCatalog(): ReturnType<typeof buildMatchCatalogFromBundle> {
  if (!catalogCache) {
    const { fr, en } = getSlices();
    catalogCache = buildMatchCatalogFromBundle({ fr, en });
  }
  return catalogCache;
}

/** CV court : au plus N lignes (offre catalogue ou paramètres GET). */
export const SHORT_PROFILE_MATCH_MAX = 3;

/**
 * Exigences par défaut (sans offre) : Java + JavaScript — utilisées
 * par le bloc « Adéquation poste » quand aucun `?offer` / `?requirement` n'est fourni.
 */
const DEFAULT_REQUIREMENTS: import('@/data/offers/types').MatchRequirement[] = [
  { label: 'Java', keywords: ['java'] },
  {
    label: 'JavaScript',
    keywords: [
      'typescript',
      'javascript',
      'node.js',
      'vue.js',
      'react',
      'next.js',
      'angular',
    ],
  },
];

/**
 * Entrées par défaut (Java, JavaScript) calculées depuis les missions du bundle.
 */
export function computeDefaultMatchData(locale: Locale): MatchDisplayData {
  const { fr, en } = getSlices();
  const slice = locale === 'fr' ? fr : en;
  const jobs: JobForMatching[] = (slice.allJobsModels ||
    []) as JobForMatching[];
  const entries = buildMatchEntries(DEFAULT_REQUIREMENTS, jobs);
  return { entries };
}

function hasReadableMatchParams(sp: URLSearchParams): boolean {
  const hasSpec = Boolean(sp.get('spec')?.trim());
  const hasCompany = Boolean(sp.get('company')?.trim());
  const hasReq =
    sp.getAll('requirement').length > 0 || sp.getAll('req').length > 0;
  return hasSpec || (hasCompany && hasReq);
}

/**
 * Même résolution que les pages offre (spec / company + requirement), données bundle — pour `/short?company=…`.
 */
export function computeShortUrlMatchData(
  locale: Locale,
  sp: URLSearchParams,
): MatchDisplayData | null {
  if (!hasReadableMatchParams(sp)) return null;

  const offer = resolveOfferFromUrlParams(sp, matchCatalog());
  if (!offer) return null;

  const { fr, en } = getSlices();
  const slice = locale === 'fr' ? fr : en;
  const jobs: JobForMatching[] = (slice.allJobsModels ||
    []) as JobForMatching[];

  const entries = buildMatchEntries(offer.requirements, jobs);

  return { entries };
}
