export interface MatchRequirement {
  label: string;
  keywords: string[];
}

export interface JobOffer {
  id: string;
  company: string;
  title: { fr: string; en: string };
  /** Remplace le titre sous le nom sur le CV (ligne teal du header). */
  cvHeaderRole?: { fr: string; en: string };
  url?: string;
  requirements: MatchRequirement[];
}
