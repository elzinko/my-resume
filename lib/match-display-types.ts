/**
 * Données d’affichage « adéquation poste » (pastilles header, calculs missions).
 */

export interface MatchEntry {
  label: string;
  matchedClients: Array<{
    client: string;
    startDate: string;
    endDate?: string;
  }>;
  totalYears: number;
  /** `totalYears` provient du champ `experienceYearsOverride` sur l’exigence. */
  yearsFromOverride?: boolean;
}

export interface MatchDisplayData {
  entries: MatchEntry[];
}
