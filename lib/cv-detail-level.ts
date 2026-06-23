/**
 * Niveau de détail des expériences sur le CV, piloté par le paramètre d'URL
 * `?detail=` (source de vérité, appliquée à l'écran ET au PDF/impression).
 *
 *  - `full`    : accroche + détails (description longue) + puces. (défaut)
 *  - `summary` : accroche seule (« les textes »), sans les détails ni les puces.
 *  - `minimal` : aucune description (titre / poste / dates / technos uniquement).
 */
export type DetailLevel = 'full' | 'summary' | 'minimal';

export const DEFAULT_DETAIL_LEVEL: DetailLevel = 'full';

/** Parse `?detail=` en {@link DetailLevel}. Toute valeur inconnue retombe sur `full`. */
export function parseDetailLevel(raw: string | null | undefined): DetailLevel {
  if (raw === 'summary' || raw === 'minimal') return raw;
  return DEFAULT_DETAIL_LEVEL;
}
