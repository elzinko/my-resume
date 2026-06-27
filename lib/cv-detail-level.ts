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

/**
 * Parse `?maxJobShown=N` : nombre de postes affichés en ENTRÉE sur le CV complet.
 * Les postes au-delà du N-ième ne sont PAS rendus comme entrées — leurs clients
 * sont pliés dans le bloc de synthèse de bas de liste (« +20 ans… missions plus
 * anciennes : … »). `null` (absent / invalide / < 1) = pas de plafond → tous les
 * postes visibles sont affichés (comportement par défaut du complet).
 */
export function parseMaxJobShown(
  raw: string | null | undefined,
): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) return null;
  return n;
}
