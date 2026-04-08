import type { JobOffer } from '@/data/offers/types';

const LOOSE_MIN_LEN = 2;

function normalizeCompact(s: string): string {
  return s.toLowerCase().replace(/[.\s_-]+/g, '');
}

function frameworkMatchesToken(
  fw: { id: string; name: string },
  token: string,
): boolean {
  if (!token) return false;
  if (fw.id === token) return true;
  const name = fw.name.toLowerCase();
  const t = token.toLowerCase();
  if (name === t) return true;
  if (t.length >= LOOSE_MIN_LEN && (name.includes(t) || t.includes(name))) {
    return true;
  }
  const ncName = normalizeCompact(fw.name);
  const ncTok = normalizeCompact(token);
  if (
    ncTok.length >= LOOSE_MIN_LEN &&
    (ncName.includes(ncTok) || ncTok.includes(ncName))
  ) {
    return true;
  }
  return false;
}

function minPriorityIndex(
  fw: { id: string; name: string },
  priorityTokens: string[],
): number {
  for (let i = 0; i < priorityTokens.length; i += 1) {
    if (frameworkMatchesToken(fw, priorityTokens[i]!)) return i;
  }
  return 1_000_000;
}

/**
 * Mots-clés / ids catalogue dans l’ordre d’importance (ordre des exigences, puis ordre des mots-clés),
 * sans doublon.
 */
export function flattenRequirementKeywordsForDisplay(offer: JobOffer): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const r of offer.requirements) {
    for (const kw of r.keywords) {
      if (!kw || seen.has(kw)) continue;
      seen.add(kw);
      out.push(kw);
    }
  }
  return out;
}

/**
 * Tri stable : d’abord les technos qui matchent l’offre (ordre des tokens), puis le reste dans l’ordre d’origine.
 */
export function sortJobFrameworksForDisplay<T extends { id: string; name: string }>(
  frameworks: T[],
  priorityTokens: string[],
): T[] {
  if (!priorityTokens.length) return [...frameworks];
  const indexed = frameworks.map((fw, i) => ({ fw, i }));
  indexed.sort((a, b) => {
    const ra = minPriorityIndex(a.fw, priorityTokens);
    const rb = minPriorityIndex(b.fw, priorityTokens);
    if (ra !== rb) return ra - rb;
    return a.i - b.i;
  });
  return indexed.map((x) => x.fw);
}
