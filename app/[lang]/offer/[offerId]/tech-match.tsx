import { getDataWithLocal } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import { Locale } from 'i18n-config';
import { getOffer } from '@/data/offers';
import type { MatchRequirement } from '@/data/offers';
import TechMatchDisplay from '@/components/TechMatchDisplay';
import type { MatchDisplayData, MatchEntry } from '@/components/TechMatchDisplay';

const jobsQuery = gql`
  query getAllJobsForMatching($lang: SiteLocale) {
    allJobsModels(locale: $lang, filter: { visible: { eq: true } }) {
      client
      startDate
      endDate
      description
      role {
        name
      }
      bullets {
        id
        text
      }
      frameworks {
        id
        name
      }
    }
  }
`;

interface JobForMatching {
  client: string;
  startDate: string;
  endDate?: string;
  description?: string;
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
  keywords: string[]
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
  clients: Array<{ client: string; startDate: string; endDate?: string }>
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

function buildMatchEntries(
  requirements: MatchRequirement[],
  jobs: JobForMatching[]
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
      0
    );

    return {
      label: req.label,
      matchedClients: deduplicated,
      totalYears,
    };
  });
}

interface TechMatchProps {
  locale: Locale;
  offerId: string;
}

export default async function TechMatch({ locale, offerId }: TechMatchProps) {
  const offer = getOffer(offerId);
  if (!offer) return null;

  const data: any = await getDataWithLocal({ locale } as any, jobsQuery);
  const jobs: JobForMatching[] = data?.allJobsModels || [];

  const entries = buildMatchEntries(offer.requirements, jobs);

  const matchData: MatchDisplayData = {
    entries,
  };

  return <TechMatchDisplay data={matchData} lang={locale as 'fr' | 'en'} />;
}
