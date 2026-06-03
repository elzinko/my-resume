import type { MatchEntry } from '@/lib/match-display-types';

export type MatchClient = MatchEntry['matchedClients'][number];

/**
 * Nombre max de clients listés sous une exigence (CV complet) avant troncature « … ».
 * Le calcul des années reste basé sur la liste complète — seul l'affichage est borné.
 */
export const JOB_FIT_MAX_CLIENTS = 6;

/** Clé de récence : fin de mission (mission en cours = future, donc en tête). */
function recencyKey(c: MatchClient): string {
  return c.endDate ?? '9999-12-31';
}

/**
 * Tri par récence décroissante : missions en cours d'abord, puis fin la plus
 * récente, puis début le plus récent. Tri stable (départage par nom de client).
 * Renvoie une copie — n'altère pas l'entrée.
 */
export function sortClientsByRecency(clients: MatchClient[]): MatchClient[] {
  return [...clients].sort((a, b) => {
    const ra = recencyKey(a);
    const rb = recencyKey(b);
    if (ra !== rb) return ra < rb ? 1 : -1;
    if (a.startDate !== b.startDate) return a.startDate < b.startDate ? 1 : -1;
    return a.client.localeCompare(b.client);
  });
}

export interface TruncatedClients {
  /** Clients affichés (triés par récence, au plus `max`). */
  visible: MatchClient[];
  /** Clients masqués par la troncature (triés par récence). */
  hidden: MatchClient[];
  /** Raccourci : `hidden.length`. */
  hiddenCount: number;
}

/**
 * Trie par récence puis tronque à `max`, en exposant le reliquat masqué pour
 * un indicateur d'overflow (« … »). `max <= 0` → tout masqué ; sinon, si la
 * liste tient dans `max`, rien n'est masqué.
 */
export function truncateClientsForDisplay(
  clients: MatchClient[],
  max: number = JOB_FIT_MAX_CLIENTS,
): TruncatedClients {
  const sorted = sortClientsByRecency(clients);
  if (max >= sorted.length) {
    return { visible: sorted, hidden: [], hiddenCount: 0 };
  }
  const safeMax = Math.max(0, max);
  const visible = sorted.slice(0, safeMax);
  const hidden = sorted.slice(safeMax);
  return { visible, hidden, hiddenCount: hidden.length };
}
