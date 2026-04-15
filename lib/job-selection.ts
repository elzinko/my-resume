import { slugifyClient } from './slug';
import { SHORT_CV_EXCLUDED_CLIENTS } from './cv-experience-footer';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Mission affichée avec tous les détails (description, bullets, frameworks). */
export interface FeaturedSection<T> {
  type: 'featured';
  job: T;
}

/** Groupe de missions compressées : client + dates, pas de détail. */
export interface StubSection<T> {
  type: 'stub';
  jobs: T[];
}

export type JobSection<T> = FeaturedSection<T> | StubSection<T>;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Normalise un slug de job pour la comparaison.
 * Accepte "jpb-systeme", "mission-jpb-systeme" ou le nom brut "JPB Système".
 */
function normalizeJobSlug(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  // Déjà un slug propre avec préfixe
  if (trimmed.startsWith('mission-')) return trimmed;

  // Slug sans préfixe (ex. "jpb-systeme")
  if (/^[a-z0-9-]+$/.test(trimmed)) return `mission-${trimmed}`;

  // Nom brut (ex. "JPB Système") → on slugifie
  return slugifyClient(trimmed);
}

/* ------------------------------------------------------------------ */
/*  Fonction principale                                                */
/* ------------------------------------------------------------------ */

/**
 * Réorganise la liste des missions pour le CV court avec mise en avant.
 *
 * - Les missions dont le slug est dans `highlightedSlugs` sont rendues en détail (« featured »).
 * - Les missions intermédiaires sont regroupées en blocs « stub » (client + dates uniquement).
 * - L'ordre chronologique original est préservé.
 *
 * Si `highlightedSlugs` est vide ou undefined, retourne `null` pour signaler
 * au composant d'utiliser le comportement par défaut (slice chrono).
 */
export function buildJobSections<T extends { client: string }>(
  allJobs: T[],
  highlightedSlugs: string[] | undefined,
): JobSection<T>[] | null {
  if (!highlightedSlugs || highlightedSlugs.length === 0) return null;

  const highlightedSet = new Set(highlightedSlugs.map(normalizeJobSlug));

  // Exclure les clients blacklistés
  const jobs = allJobs.filter((j) => !SHORT_CV_EXCLUDED_CLIENTS.has(j.client));

  const sections: JobSection<T>[] = [];
  let currentStubGroup: T[] = [];

  for (const job of jobs) {
    const slug = slugifyClient(job.client);

    if (highlightedSet.has(slug)) {
      // Flush le groupe stub accumulé
      if (currentStubGroup.length > 0) {
        sections.push({ type: 'stub', jobs: [...currentStubGroup] });
        currentStubGroup = [];
      }
      sections.push({ type: 'featured', job });
    } else {
      currentStubGroup.push(job);
    }
  }

  // Stub trailing (missions après le dernier featured)
  if (currentStubGroup.length > 0) {
    sections.push({ type: 'stub', jobs: currentStubGroup });
  }

  return sections;
}
