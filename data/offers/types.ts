export interface MatchRequirement {
  /** Libellé affiché dans l’offre / specs ; synonymes regroupés dans `keywords`. */
  label: string;
  /** Libellé court dans le bloc « adéquation » (ex. « Python » au lieu de « Python / Backend »). */
  shortLabel?: string;
  keywords: string[];
  /**
   * Durée affichée (années) à la place du calcul automatique à partir des missions.
   * Utile en attendant un calcul fiable (chevauchements, texte libre, etc.).
   */
  experienceYearsOverride?: number;
}

export type ContractType = 'cdi' | 'freelance';

export interface JobOffer {
  id: string;
  company: string;
  title: { fr: string; en: string };
  url?: string;
  requirements: MatchRequirement[];
  /** Type de contrat : masque Malt en CDI, par défaut freelance. */
  contract?: ContractType;
  /** Adresse du lieu de travail (itinéraire depuis la gare de Thomery). */
  workAddress?: string;
  /** Libellé discret affiché à côté du lieu (ex. durée de trajet). */
  commuteLabel?: string;
  /** Slugs de missions à mettre en avant (CV court). Valeurs = slug client sans préfixe "mission-". */
  highlightedJobs?: string[];
}
