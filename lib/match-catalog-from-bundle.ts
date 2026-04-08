import type { MatchCatalog, MatchCatalogEntry } from '@/lib/match-catalog-schema';
import {
  MATCH_CATALOG_VERSION,
  deriveMatchTokensFromName,
} from '@/lib/match-catalog-schema';

interface SkillLike {
  id?: string;
  name?: string;
}

interface JobLike {
  frameworks?: SkillLike[];
}

/** Sous-ensemble du snapshot CV nécessaire pour agréger le catalogue de match. */
export interface CvSliceForMatchCatalog {
  allSkillsModels?: SkillLike[];
  allJobsModels?: JobLike[];
}

function ingestCv(
  data: CvSliceForMatchCatalog,
  lang: 'fr' | 'en',
  byId: Map<string, { nameFr?: string; nameEn?: string }>,
) {
  const key = lang === 'fr' ? 'nameFr' : 'nameEn';
  for (const s of data.allSkillsModels || []) {
    const id = s.id?.trim();
    const name = s.name?.trim();
    if (!id || !name) continue;
    const cur = byId.get(id) || {};
    (cur as Record<string, string>)[key] = name;
    byId.set(id, cur);
  }
  for (const j of data.allJobsModels || []) {
    for (const f of j.frameworks || []) {
      const id = f.id?.trim();
      const name = f.name?.trim();
      if (!id || !name) continue;
      const cur = byId.get(id) || {};
      (cur as Record<string, string>)[key] = name;
      byId.set(id, cur);
    }
  }
}

function entryForId(
  id: string,
  names: { nameFr?: string; nameEn?: string },
): MatchCatalogEntry {
  const nameFr = names.nameFr?.trim();
  const nameEn = names.nameEn?.trim();
  const canonicalName = nameFr || nameEn || id;
  const tokenSet = new Set<string>();
  for (const t of deriveMatchTokensFromName(nameFr || canonicalName)) {
    tokenSet.add(t);
  }
  for (const t of deriveMatchTokensFromName(nameEn || canonicalName)) {
    tokenSet.add(t);
  }
  if (tokenSet.size === 0) {
    for (const t of deriveMatchTokensFromName(canonicalName)) tokenSet.add(t);
  }
  const matchTokens = Array.from(tokenSet).sort();
  return { id, name: canonicalName, matchTokens };
}

/**
 * Agrège skills + frameworks des deux locales du bundle en un catalogue de match
 * (même logique qu’anciennement `scripts/generate-match-catalog.ts`).
 */
export function buildMatchCatalogFromBundle(bundle: {
  fr: CvSliceForMatchCatalog;
  en: CvSliceForMatchCatalog;
}): MatchCatalog {
  const byId = new Map<string, { nameFr?: string; nameEn?: string }>();
  ingestCv(bundle.fr, 'fr', byId);
  ingestCv(bundle.en, 'en', byId);

  const entries: MatchCatalogEntry[] = [];
  for (const [id, names] of Array.from(byId.entries())) {
    entries.push(entryForId(id, names));
  }

  entries.sort((a, b) => a.name.localeCompare(b.name, 'fr'));

  return {
    version: MATCH_CATALOG_VERSION,
    generatedAt: new Date().toISOString(),
    entries,
    exampleMatchUrl:
      '/fr?company=Example&title=Engineer&requirement=React:@81821032&requirement=Node.js:nodejs,node.js',
  };
}
