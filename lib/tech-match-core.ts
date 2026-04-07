import type { MatchRequirement } from '@/data/offers/types';
import type { MatchEntry } from '@/components/TechMatchDisplay';

export interface JobForMatching {
  client: string;
  startDate: string;
  endDate?: string;
  description?: string;
  descriptionShort?: string;
  role?: { name: string };
  bullets?: Array<{ id: string; text: string }>;
  frameworks: Array<{ id: string; name: string }>;
}

function textContainsKeyword(text: string, keywords: string[]): boolean {
  const normalized = text.toLowerCase();
  return keywords.some((kw) => normalized.includes(kw));
}

function jobMatchesRequirement(
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

function computeYears(startDate: string, endDate?: string): number {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}

function deduplicateClients(
  clients: Array<{ client: string; startDate: string; endDate?: string }>,
): Array<{ client: string; startDate: string; endDate?: string }> {
  const byClient = new Map<
    string,
    { client: string; startDate: string; endDate?: string }
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
    }
  }
  return Array.from(byClient.values());
}

export function buildMatchEntries(
  requirements: MatchRequirement[],
  jobs: JobForMatching[],
): MatchEntry[] {
  return requirements.map((req) => {
    const matched: Array<{
      client: string;
      startDate: string;
      endDate?: string;
    }> = [];

    for (const job of jobs) {
      if (jobMatchesRequirement(job, req.keywords)) {
        matched.push({
          client: job.client,
          startDate: job.startDate,
          endDate: job.endDate,
        });
      }
    }

    const deduplicated = deduplicateClients(matched);
    const totalYears = deduplicated.reduce(
      (sum, m) => sum + computeYears(m.startDate, m.endDate),
      0,
    );

    return {
      label: req.shortLabel ?? req.label,
      matchedClients: deduplicated,
      totalYears,
    };
  });
}
