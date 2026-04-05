/**
 * Tri chronologique inverse sur une clé dérivée (dates ISO recommandées).
 * Réutilisable pour toute liste chargée depuis JSON, Dato ou autre.
 */
export function sortChronologicalDesc<T>(
  items: readonly T[],
  getSortKey: (item: T) => string | null | undefined,
): T[] {
  const key = (item: T) => getSortKey(item) ?? '';
  return [...items].sort((a, b) => key(b).localeCompare(key(a)));
}

/**
 * Période « la plus récente d’abord » : fin, sinon début (missions, formations, projets…).
 * Paramètre en `any` pour que `sortChronologicalDesc` infère `T` depuis le tableau, pas depuis `unknown`.
 */
export function byEndThenStart(item: any): string {
  if (item == null || typeof item !== 'object') return '';
  return item.endDate || item.startDate || '';
}
