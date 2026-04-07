/**
 * Schéma du catalogue de match : dérivé en mémoire depuis {@link data/cv/bundle.json}
 * (voir `lib/match-catalog-from-bundle.ts` et `lib/match-catalog-server.ts`).
 */

export const MATCH_CATALOG_VERSION = 1 as const;

export interface MatchCatalogEntry {
  id: string;
  name: string;
  matchTokens: string[];
}

export interface MatchCatalog {
  version: typeof MATCH_CATALOG_VERSION;
  generatedAt: string;
  entries: MatchCatalogEntry[];
  /** Exemple d’URL (sans origin ; préfixer basePath si besoin). */
  exampleMatchUrl: string;
}

/** Déduit des tokens de match à partir du nom affiché (CV / Dato). */
export function deriveMatchTokensFromName(name: string): string[] {
  const lower = name.trim().toLowerCase();
  if (!lower) return [];
  const compact = lower.replace(/[.\s_-]+/g, '');
  const noSpaces = lower.replace(/\s+/g, '');
  const tokens = new Set<string>();
  tokens.add(lower);
  if (compact.length > 0 && compact !== lower) tokens.add(compact);
  if (noSpaces.length > 0 && noSpaces !== lower && noSpaces !== compact) {
    tokens.add(noSpaces);
  }
  return Array.from(tokens);
}
