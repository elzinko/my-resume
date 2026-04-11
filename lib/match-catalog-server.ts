import 'server-only';

import bundleJson from '@/data/cv/bundle.json';
import { buildMatchCatalogFromBundle } from '@/lib/match-catalog-from-bundle';
import type { CvSliceForMatchCatalog } from '@/lib/match-catalog-from-bundle';
import type { MatchCatalog } from '@/lib/match-catalog-schema';

let cachedCatalog: MatchCatalog | null = null;

/** Catalogue de match dérivé de `data/cv/bundle.json` (mémoïsé par process). */
export function getMatchCatalog(): MatchCatalog {
  if (!cachedCatalog) {
    const b = bundleJson as {
      fr?: CvSliceForMatchCatalog;
      en?: CvSliceForMatchCatalog;
    };
    if (!b.fr || !b.en) {
      throw new Error(
        'data/cv/bundle.json doit contenir les clés "fr" et "en"',
      );
    }
    cachedCatalog = buildMatchCatalogFromBundle({ fr: b.fr, en: b.en });
  }
  return cachedCatalog;
}
