import type { JobOffer } from '@/data/offers/types';
import type { MatchCatalog } from '@/lib/match-catalog-schema';

const MAX_KEYWORDS_EXPANDED = 24;

export function catalogIdSet(catalog: MatchCatalog): Set<string> {
  return new Set(catalog.entries.map((e) => e.id));
}

/**
 * Étend les mots-clés avec les matchTokens du catalogue lorsque le segment est un id connu
 * (référence explicite `@id` ou id nu égal à une entrée).
 */
export function expandKeywordsForMatch(
  keywords: string[],
  catalog: MatchCatalog,
  max = MAX_KEYWORDS_EXPANDED,
): string[] {
  const byId = new Map(catalog.entries.map((e) => [e.id, e]));
  const out: string[] = [];
  const seen = new Set<string>();
  for (const kw of keywords) {
    if (!kw) continue;
    const entry = byId.get(kw);
    if (entry) {
      if (!seen.has(kw)) {
        out.push(kw);
        seen.add(kw);
      }
      for (const t of entry.matchTokens) {
        if (!seen.has(t)) {
          out.push(t);
          seen.add(t);
        }
      }
    } else if (!seen.has(kw)) {
      out.push(kw);
      seen.add(kw);
    }
    if (out.length >= max) break;
  }
  return out.slice(0, max);
}

export function enrichJobOfferRequirements(
  offer: JobOffer,
  catalog: MatchCatalog,
): JobOffer {
  return {
    ...offer,
    requirements: offer.requirements.map((r) => ({
      ...r,
      keywords: expandKeywordsForMatch(r.keywords, catalog),
    })),
  };
}
