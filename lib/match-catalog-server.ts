import 'server-only';

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
import { buildMatchCatalogFromBundle } from '@/lib/match-catalog-from-bundle';
import type { CvSliceForMatchCatalog } from '@/lib/match-catalog-from-bundle';
import type { MatchCatalog } from '@/lib/match-catalog-schema';

let cachedCatalog: MatchCatalog | null = null;

/** Catalogue de match dérivé des 4 fichiers `data/cv/*.json`, mémoïsé par process. */
export function getMatchCatalog(): MatchCatalog {
  if (!cachedCatalog) {
    const sources = {
      profile: profileJson as Profile,
      techCatalog: techCatalogJson as TechCatalog,
      experience: experienceJson as Experience,
    };
    const fr = composeCvSnapshot('fr', {
      ...sources,
      locale: localeFrJson as LocaleBundle,
    }) as unknown as CvSliceForMatchCatalog;
    const en = composeCvSnapshot('en', {
      ...sources,
      locale: localeEnJson as LocaleBundle,
    }) as unknown as CvSliceForMatchCatalog;
    cachedCatalog = buildMatchCatalogFromBundle({ fr, en });
  }
  return cachedCatalog;
}
