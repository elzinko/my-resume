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
 * Niveau « bref » appliqué aux postes AU-DELÀ du seuil `?detailedJobs=N`.
 * `minimal` = titre / poste / dates / technos (sans la prose) → le poste reste
 * VISIBLE (frise intacte) et ses technos restent lisibles par l'ATS. « Briefer
 * n'est pas cacher » : aucune mission importante ne disparaît, on la condense.
 */
export const BRIEF_DETAIL_LEVEL: DetailLevel = 'minimal';

/**
 * Parse `?detailedJobs=N` : nombre de postes affichés en détail COMPLET (les
 * suivants passent en {@link BRIEF_DETAIL_LEVEL}). Maîtrise la pagination du PDF
 * sans rien retirer des données (l'URL garde tout). `null` (absent / invalide)
 * = pas de seuil → comportement actuel (tous au niveau global `?detail=`).
 */
export function parseDetailedJobs(
  raw: string | null | undefined,
): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0) return null;
  return n;
}

/**
 * Niveau de détail EFFECTIF d'un poste à l'index `index` (0 = le plus récent) :
 * les `detailedJobs` premiers gardent le niveau global, les suivants passent en
 * bref. Sans seuil (`null`), tout le monde garde le niveau global.
 */
export function jobDetailLevelAt(
  index: number,
  globalLevel: DetailLevel,
  detailedJobs: number | null,
): DetailLevel {
  if (detailedJobs == null) return globalLevel;
  return index < detailedJobs ? globalLevel : BRIEF_DETAIL_LEVEL;
}
