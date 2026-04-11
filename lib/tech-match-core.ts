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

function computeYears(startDate: string, endDate?: string): number {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
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
    const computedYears = deduplicated.reduce(
      (sum, m) => sum + computeYears(m.startDate, m.endDate),
      0,
    );

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
