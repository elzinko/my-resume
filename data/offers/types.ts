export interface MatchRequirement {
  label: string;
  keywords: string[];
}

export interface JobOffer {
  id: string;
  company: string;
  title: { fr: string; en: string };
  url?: string;
  requirements: MatchRequirement[];
}
