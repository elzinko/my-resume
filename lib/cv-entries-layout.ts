/**
 * Disposition des entrées de liste « Études / Loisirs » (et sections `.cv-entry`
 * qui l'adoptent), pilotée par le paramètre d'URL `?entriesLayout`.
 *
 * - `stacked` (DÉFAUT) : titre (+ année à droite) sur la ligne 1, détail sur la
 *   ligne 2, dans tous les régimes — COHÉRENT avec Projets/Learnings/Loisirs (qui
 *   utilisent la grille `.cv-entry` de base). C'est le rendu attendu par défaut.
 * - `inline` (`?entriesLayout=inline`) : titre + détail sur UNE ligne, année
 *   collée à droite (desktop + impression). Sous `md`, repli auto sur la grille
 *   2 lignes (lisibilité mobile) — géré en CSS, pas ici.
 *
 * Paramètre UNIQUE et partagé (cf. décision produit) : la même valeur pilote
 * toutes les sections qui l'acceptent, pour un rendu cohérent.
 */
export type EntriesLayout = 'inline' | 'stacked';

export const DEFAULT_ENTRIES_LAYOUT: EntriesLayout = 'stacked';

/** `?entriesLayout=inline` → 'inline' ; tout le reste (absent inclus) → 'stacked'. */
export function parseEntriesLayout(
  value: string | null | undefined,
): EntriesLayout {
  return value?.trim().toLowerCase() === 'inline' ? 'inline' : 'stacked';
}
