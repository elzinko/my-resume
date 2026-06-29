import type { MatchRequirement } from '@/data/offers/types';
import type { MatchEntry } from '@/lib/match-display-types';

export interface JobForMatching {
  client: string;
  clientUrl?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  descriptionShort?: string;
  role?: { name: string };
  bullets?: Array<{ id: string; text: string }>;
  frameworks: Array<{ id: string; name: string }>;
}

const LOOSE_KEYWORD_MIN_LEN = 3;

function textContainsKeyword(text: string, keywords: string[]): boolean {
  const normalized = text.toLowerCase();
  return keywords.some((kw) => normalized.includes(kw));
}

/** Pour rapprocher `nodejs` et `node.js` sans ambiguïté sur la casse uniquement. */
function normalizeCompact(s: string): string {
  return s.toLowerCase().replace(/[.\s_-]+/g, '');
}

function textMatchesKeywordLoose(text: string, kw: string): boolean {
  if (kw.length < LOOSE_KEYWORD_MIN_LEN) return false;
  const nt = normalizeCompact(text);
  const nk = normalizeCompact(kw);
  if (!nk) return false;
  return nt.includes(nk);
}

function jobCorpusForLooseMatch(job: JobForMatching): string {
  const parts: string[] = [];
  if (job.role?.name) parts.push(job.role.name);
  if (job.descriptionShort) parts.push(job.descriptionShort);
  if (job.description) parts.push(job.description);
  for (const b of job.bullets || []) parts.push(b.text);
  for (const fw of job.frameworks || []) parts.push(fw.name);
  return parts.join(' ');
}

function jobMatchesFrameworkId(
  job: JobForMatching,
  keywords: string[],
): boolean {
  const frameworks = job.frameworks || [];
  return keywords.some((kw) => frameworks.some((fw) => fw.id === kw));
}

function jobMatchesRequirementStrict(
  job: JobForMatching,
  keywords: string[],
): boolean {
  const frameworks = job.frameworks || [];
  const frameworkMatch = frameworks.some((fw) => {
    const name = fw.name.toLowerCase();
    return keywords.some((kw) => name.includes(kw) || kw.includes(name));
  });
  if (frameworkMatch) return true;

  if (job.role?.name && textContainsKeyword(job.role.name, keywords)) {
    return true;
  }

  if (
    job.descriptionShort &&
    textContainsKeyword(job.descriptionShort, keywords)
  ) {
    return true;
  }

  if (job.description && textContainsKeyword(job.description, keywords)) {
    return true;
  }

  if (job.bullets?.some((b) => textContainsKeyword(b.text, keywords))) {
    return true;
  }

  return false;
}

function jobMatchesRequirementLoose(
  job: JobForMatching,
  keywords: string[],
): boolean {
  const corpus = jobCorpusForLooseMatch(job);
  if (!corpus) return false;
  return keywords.some((kw) => textMatchesKeywordLoose(corpus, kw));
}

export function jobMatchesRequirement(
  job: JobForMatching,
  keywords: string[],
): boolean {
  if (jobMatchesFrameworkId(job, keywords)) return true;
  if (jobMatchesRequirementStrict(job, keywords)) return true;
  if (jobMatchesRequirementLoose(job, keywords)) return true;
  return false;
}

/**
 * Années cumulées = UNION des intervalles [début, fin] des missions (PAS la somme
 * des durées) → des missions qui SE RECOUPENT (jobs concurrents : solopreneur +
 * une mission client en parallèle, etc.) ne comptent pas deux fois le même temps
 * calendaire. On veut « N années d'expérience avec X » au sens du temps réel
 * écoulé, sans jamais dépasser la durée de carrière.
 */
function unionYears(
  intervals: Array<{ startDate: string; endDate?: string }>,
): number {
  const spans = intervals
    .map((i) => ({
      start: new Date(i.startDate).getTime(),
      end: (i.endDate ? new Date(i.endDate) : new Date()).getTime(),
    }))
    .filter((s) => Number.isFinite(s.start) && Number.isFinite(s.end) && s.end >= s.start)
    .sort((a, b) => a.start - b.start);
  if (spans.length === 0) return 0;
  let totalMs = 0;
  let curStart = spans[0].start;
  let curEnd = spans[0].end;
  for (let k = 1; k < spans.length; k++) {
    const s = spans[k];
    if (s.start <= curEnd) {
      if (s.end > curEnd) curEnd = s.end; // chevauchement → on étend
    } else {
      totalMs += curEnd - curStart; // intervalle disjoint → on clôt
      curStart = s.start;
      curEnd = s.end;
    }
  }
  totalMs += curEnd - curStart;
  return totalMs / (1000 * 60 * 60 * 24 * 365.25);
}

function deduplicateClients(
  clients: Array<{
    client: string;
    clientUrl?: string;
    startDate: string;
    endDate?: string;
  }>,
): Array<{
  client: string;
  clientUrl?: string;
  startDate: string;
  endDate?: string;
}> {
  const byClient = new Map<
    string,
    { client: string; clientUrl?: string; startDate: string; endDate?: string }
  >();
  for (const entry of clients) {
    const existing = byClient.get(entry.client);
    if (!existing) {
      byClient.set(entry.client, { ...entry });
    } else {
      if (entry.startDate < existing.startDate) {
        existing.startDate = entry.startDate;
      }
      if (!entry.endDate) {
        existing.endDate = undefined;
      } else if (existing.endDate && entry.endDate > existing.endDate) {
        existing.endDate = entry.endDate;
      }
      if (!existing.clientUrl && entry.clientUrl) {
        existing.clientUrl = entry.clientUrl;
      }
    }
  }
  return Array.from(byClient.values());
}

function hasValidExperienceOverride(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0;
}

export function buildMatchEntries(
  requirements: MatchRequirement[],
  jobs: JobForMatching[],
): MatchEntry[] {
  return requirements.map((req) => {
    const matched: Array<{
      client: string;
      clientUrl?: string;
      startDate: string;
      endDate?: string;
    }> = [];

    for (const job of jobs) {
      if (jobMatchesRequirement(job, req.keywords)) {
        matched.push({
          client: job.client,
          clientUrl: job.clientUrl,
          startDate: job.startDate,
          endDate: job.endDate,
        });
      }
    }

    const deduplicated = deduplicateClients(matched);
    // Années = UNION des intervalles bruts des missions matchées (dé-chevauchées),
    // pas la somme par client → pas de double-comptage des périodes concurrentes.
    const computedYears = unionYears(matched);

    const override = req.experienceYearsOverride;
    const useOverride = hasValidExperienceOverride(override);

    return {
      label: req.shortLabel ?? req.label,
      matchedClients: deduplicated,
      totalYears: useOverride ? override : computedYears,
      yearsFromOverride: useOverride,
    };
  });
}
