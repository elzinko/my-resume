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

/** Slug normalisé d'une mission : slug explicite prioritaire, sinon dérivé du client. */
function jobSlug<T extends { client: string; slug?: string }>(job: T): string {
  return job.slug ? normalizeJobSlug(job.slug) : slugifyClient(job.client);
}

/**
 * Réorganise la liste des missions pour le CV court avec mise en avant.
 *
 * - Les missions listées dans `highlightedSlugs` sont rendues en détail
 *   (« featured »), **dans l'ordre fourni** (pas forcément chronologique).
 * - Toutes les autres missions visibles forment un unique bloc « Autres
 *   expériences » compressé (`stub`), dans l'ordre d'origine (chronologique).
 * - Le matching se fait sur le slug explicite de la mission (ex. `matiere-web`),
 *   avec repli sur le slug dérivé du client.
 *
 * Retourne `null` (→ comportement chrono par défaut) si `highlightedSlugs` est
 * vide/undefined ou si aucun slug ne correspond à une mission connue.
 */
export function buildJobSections<T extends { client: string; slug?: string }>(
  allJobs: T[],
  highlightedSlugs: string[] | undefined,
): JobSection<T>[] | null {
  if (!highlightedSlugs || highlightedSlugs.length === 0) return null;

  // Exclure les clients blacklistés du CV court.
  const jobs = allJobs.filter((j) => !SHORT_CV_EXCLUDED_CLIENTS.has(j.client));

  // Index slug normalisé → mission (première occurrence gagnante).
  const bySlug = new Map<string, T>();
  for (const job of jobs) {
    const slug = jobSlug(job);
    if (!bySlug.has(slug)) bySlug.set(slug, job);
  }

  // Missions mises en avant, DANS L'ORDRE des slugs fournis (dédupliquées).
  const featuredJobs: T[] = [];
  const featuredSet = new Set<T>();
  for (const raw of highlightedSlugs) {
    const job = bySlug.get(normalizeJobSlug(raw));
    if (job && !featuredSet.has(job)) {
      featuredSet.add(job);
      featuredJobs.push(job);
    }
  }

  // Aucun slug valide → on laisse le composant retomber sur le défaut chrono.
  if (featuredJobs.length === 0) return null;

  const sections: JobSection<T>[] = featuredJobs.map((job) => ({
    type: 'featured',
    job,
  }));

  // Le reste, compressé en un seul bloc trailing (« Autres expériences »).
  const rest = jobs.filter((j) => !featuredSet.has(j));
  if (rest.length > 0) {
    sections.push({ type: 'stub', jobs: rest });
  }

  return sections;
}
