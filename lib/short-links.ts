/**
 * Liens courts « vanity » : un slug racine (ex. `/resilience`) → l'URL d'un CV
 * personnalisé (`/fr?company=…&requirement=…`). Résolus par le middleware
 * AVANT la logique de locale, afin que `elzinko.fr/<slug>` redirige en un seul
 * saut vers la version ciblée du CV.
 *
 * Pour ajouter un lien : une entrée dans `SHORT_LINKS`. La destination est
 * construite via `cvOfferTarget()` pour garantir un encodage correct, ou bien
 * c'est le chemin d'un fichier statique de `public/` (ex. un CV en PDF).
 */

/**
 * CV généraliste (PDF A4, une page), hors moteur de rendu du CV : il est conçu à
 * part pour les forums emploi et servi tel quel depuis `public/cv/`.
 */
export const GENERIC_CV_PDF = '/cv/thomas-couderc-cv-generaliste.pdf';

interface CvOfferParams {
  company: string;
  titleFr: string;
  subtitleFr: string;
  contract?: 'cdi' | 'freelance';
  /** Chaque entrée : `Libellé:mot1,mot2` (ordre = ordre d'affichage). */
  requirements: string[];
}

/** Construit une URL `/fr?…` correctement encodée pour une offre. */
export function cvOfferTarget(params: CvOfferParams): string {
  const sp = new URLSearchParams();
  sp.set('company', params.company);
  sp.set('title_fr', params.titleFr);
  sp.set('subtitle_fr', params.subtitleFr);
  if (params.contract) sp.set('contract', params.contract);
  for (const req of params.requirements) sp.append('requirement', req);
  return `/fr?${sp.toString()}`;
}

/** Registre des liens courts (clé = slug en minuscules, sans `/`). */
export const SHORT_LINKS: Record<string, string> = {
  resilience: cvOfferTarget({
    company: 'Resilience',
    titleFr: 'Développeur fullstack Kotlin',
    subtitleFr: 'Développeur fullstack Kotlin · Java · Spring Boot',
    contract: 'freelance',
    requirements: [
      'Kotlin:kotlin',
      'Java:java',
      'Spring Boot:spring-boot,spring boot,springboot,spring',
      'PostgreSQL:postgresql,postgres',
      'Kubernetes & Docker:kubernetes,docker,openshift,rancher',
      'APIs REST:rest,openapi,swagger,ktor',
    ],
  }),
  generic: GENERIC_CV_PDF,
  generaliste: GENERIC_CV_PDF,
};

/**
 * Résout un pathname (`/resilience`, `/Resilience/`) vers sa cible, ou `null`
 * si aucun lien court ne correspond.
 */
export function resolveShortLink(pathname: string): string | null {
  const slug = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!slug) return null;
  return SHORT_LINKS[slug] ?? null;
}
