'use client';

import React from 'react';
import MatchClientPill from './MatchClientPill';

export interface MatchEntry {
  label: string;
  matchedClients: Array<{
    client: string;
    startDate: string;
    endDate?: string;
  }>;
  totalYears: number;
}

export interface MatchDisplayData {
  entries: MatchEntry[];
}

interface TechMatchDisplayProps {
  data: MatchDisplayData;
  lang: 'fr' | 'en';
}

const labels = {
  fr: {
    sectionTitle: 'Adéquation avec le poste',
    years: 'ans',
    year: 'an',
    notPracticed: 'Non pratiquée',
  },
  en: {
    sectionTitle: 'Profile Match',
    years: 'years',
    year: 'year',
    notPracticed: 'Not practiced',
  },
};

function formatYears(totalYears: number, lang: 'fr' | 'en'): string {
  const t = labels[lang];
  if (!Number.isFinite(totalYears) || totalYears < 0) return '—';
  if (totalYears < 1) return `<1 ${t.year}`;
  const rounded = Math.round(totalYears);
  return `${rounded} ${rounded === 1 ? t.year : t.years}`;
}

export default function TechMatchDisplay({
  data,
  lang,
}: TechMatchDisplayProps) {
  const t = labels[lang];
  const entries = data?.entries ?? [];

  return (
    <section
      id="profile-match"
      className="mt-10 max-md:!mt-0 print:mt-4"
    >
      <h2 className="border-b pb-1 text-2xl font-semibold text-orange-300 print:!text-orange-300">
        {t.sectionTitle}
      </h2>

      <div className="flex w-full flex-col print:flex-row print:space-x-4 md:flex-row md:space-x-6">
        {entries.map((entry) => {
          const hasMatches = entry.matchedClients.length > 0;

          return (
            <div
              key={entry.label}
              className={`mt-4 min-w-0 flex-1 print:mt-2 ${
                !hasMatches ? 'opacity-50' : ''
              }`}
              style={{ breakInside: 'avoid' }}
            >
              <div className="mt-4 flex items-baseline justify-between gap-3 print:mt-2">
                <h3 className="min-w-0 flex-1 text-sm font-semibold leading-snug text-orange-300 print:text-[10px] print:!text-orange-300">
                  {entry.label}
                </h3>
                {hasMatches ? (
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-orange-300 print:text-[10px] print:!text-orange-300">
                    {formatYears(entry.totalYears, lang)}
                  </span>
                ) : null}
              </div>

              {hasMatches ? (
                <div className="flex flex-wrap gap-x-2 gap-y-2 py-2 print:gap-1 print:py-1">
                  {entry.matchedClients.map((match) => (
                    <MatchClientPill key={match.client} client={match.client} />
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm italic text-gray-500 print:mt-1 print:text-[10px]">
                  {t.notPracticed}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
