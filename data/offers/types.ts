export interface MatchRequirement {
  /** Libellé affiché dans l’offre / specs ; synonymes regroupés dans `keywords`. */
  label: string;
  /** Libellé court dans le bloc « adéquation » (ex. « Python » au lieu de « Python / Backend »). */
  shortLabel?: string;
  keywords: string[];
}

export interface JobOffer {
  id: string;
  company: string;
  title: { fr: string; en: string };
  url?: string;
  requirements: MatchRequirement[];
}
