import type { Locale } from '../i18n-config';

/** Aligné sur `CompactCvLayout` : missions détaillées sur le CV court. */
export const SHORT_CV_MAX_JOBS = 8;

export const SHORT_CV_EXCLUDED_CLIENTS = new Set(['RelevanC']);

export function jobsAfterShortWindow<T extends { client: string }>(
  allJobs: T[],
): T[] {
  const filtered = allJobs.filter(
    (j) => !SHORT_CV_EXCLUDED_CLIENTS.has(j.client),
  );
  return filtered.slice(SHORT_CV_MAX_JOBS);
}

export type ExperienceClosingLabels = {
  moreExperience: string;
  moreExperienceTail: string;
};

const FALLBACK: Record<Locale, ExperienceClosingLabels> = {
  fr: {
    moreExperience: "+20 ans d'expérience",
    moreExperienceTail: 'en développement fullstack et DevOps.',
  },
  en: {
    moreExperience: '+20 years of experience',
    moreExperienceTail: 'in full-stack development and DevOps.',
  },
};

export function getExperienceClosingLabels(
  locale: Locale,
): ExperienceClosingLabels {
  return FALLBACK[locale];
}

/** Liste des clients pour les missions non détaillées sur le CV court (ordre bundle). */
function remainingClientNames<T extends { client: string }>(
  allJobs: T[],
): string[] {
  const rest = jobsAfterShortWindow(allJobs);
  return rest.map((j) => j.client.trim()).filter(Boolean);
}

/** CV court : missions non détaillées sur la page. */
export function formatRemainingClientsForShortCv<T extends { client: string }>(
  allJobs: T[],
  locale: Locale,
): string | null {
  const names = remainingClientNames(allJobs);
  if (names.length === 0) return null;
  const joined = names.join(', ');
  return locale === 'fr'
    ? `Autres clients : ${joined}.`
    : `Other clients include ${joined}.`;
}

/**
 * CV complet avec `?maxJobShown=N` : synthèse des missions PLIÉES (au-delà du
 * N-ième poste affiché). Liste TOUS les clients fournis — pas d'exclusion : ce
 * sont des postes réellement repliés, on ne veut pas les faire disparaître.
 */
export function formatFoldedClientsRecap<T extends { client: string }>(
  foldedJobs: T[],
  locale: Locale,
): string | null {
  const names = foldedJobs.map((j) => j.client.trim()).filter(Boolean);
  if (names.length === 0) return null;
  const joined = names.join(', ');
  return locale === 'fr'
    ? `Anciens clients : ${joined}.`
    : `Earlier clients: ${joined}.`;
}
