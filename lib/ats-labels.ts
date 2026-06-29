import type { Locale } from '../i18n-config';

/**
 * Libellés de sections canoniques reconnus par les ATS anglo-saxons
 * (Workday, Greenhouse, Lever, Taleo, LinkedIn Recruiter, Jobscan…).
 *
 * Affichés en sous-titre discret sous le titre français du CV `/fr` afin que
 * les parseurs ATS mappent chaque section sans ambiguïté, sans dénaturer le
 * rendu pour un lecteur humain francophone. Sur `/en`, les titres sont déjà
 * anglais : aucun sous-titre n'est ajouté (cf. `atsSectionLabel`).
 *
 * Source de vérité unique : modifier ici, jamais en dur dans les composants.
 */
export type AtsSectionKey =
  | 'about'
  | 'contact'
  | 'jobs'
  | 'studies'
  | 'skills'
  | 'projects'
  | 'hobbies'
  | 'learnings'
  | 'jobfit';

export const ATS_SECTION_LABELS: Record<AtsSectionKey, string> = {
  about: 'Summary',
  contact: 'Contact',
  jobs: 'Work Experience',
  studies: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  hobbies: 'Interests',
  learnings: 'Continuous Learning',
  // « Adéquation poste » : pas une section ATS standard, mais on affiche son
  // équivalent EN (titre de la section sur /en) pour la COHÉRENCE visuelle —
  // toutes les sections portent le même petit libellé discret à l'impression.
  jobfit: 'Job fit',
};

/**
 * Renvoie le libellé ATS anglais à afficher en complément discret, ou `null`
 * quand il est inutile : sur `/en` (déjà anglais) ou quand le titre affiché
 * est déjà identique au libellé canonique.
 */
export function atsSectionLabel(
  key: AtsSectionKey,
  lang: Locale,
  displayedTitle?: string | null,
): string | null {
  if (lang !== 'fr') return null;
  const label = ATS_SECTION_LABELS[key];
  if (!label) return null;
  if (
    displayedTitle &&
    displayedTitle.trim().toLowerCase() === label.toLowerCase()
  ) {
    return null;
  }
  return label;
}
