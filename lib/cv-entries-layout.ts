/**
 * Disposition des entrées de liste « Études / Loisirs » (et sections `.cv-entry`
 * qui l'adoptent), pilotée par le paramètre d'URL `?entriesLayout`.
 *
 * - `inline` (DÉFAUT) : titre + détail sur UNE ligne, année collée à droite
 *   (desktop + impression). Sous `md`, repli automatique sur la grille 2 lignes
 *   (lisibilité mobile) — géré en CSS, pas ici.
 * - `stacked` : titre (+ année à droite) sur la ligne 1, détail sur la ligne 2,
 *   dans tous les régimes (ancien comportement « école sur la 2e ligne »).
 *
 * Paramètre UNIQUE et partagé (cf. décision produit) : la même valeur pilote
 * toutes les sections qui l'acceptent, pour un rendu cohérent.
 */
export type EntriesLayout = 'inline' | 'stacked';

export const DEFAULT_ENTRIES_LAYOUT: EntriesLayout = 'inline';

/** `?entriesLayout=stacked` → 'stacked' ; tout le reste (absent inclus) → 'inline'. */
export function parseEntriesLayout(
  value: string | null | undefined,
): EntriesLayout {
  return value?.trim().toLowerCase() === 'stacked' ? 'stacked' : 'inline';
}
