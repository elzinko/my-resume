'use client';

import React from 'react';
import { slugifyClient } from '@/lib/slug';

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
  if (totalYears < 1) return `<1 ${t.year}`;
  const rounded = Math.round(totalYears);
  return `${rounded} ${rounded === 1 ? t.year : t.years}`;
}

export default function TechMatchDisplay({ data, lang }: TechMatchDisplayProps) {
  const t = labels[lang];

  return (
    <section className="mt-6 print:mt-3">
      <h2 className="border-b pb-1 text-2xl font-semibold text-orange-300">
        {t.sectionTitle}
      </h2>

      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3 print:grid-cols-3 print:gap-1.5">
        {data.entries.map((entry) => {
          const hasMatches = entry.matchedClients.length > 0;

          return (
            <div
              key={entry.label}
              className={`rounded border p-2 print:p-1.5 ${
                hasMatches
                  ? 'border-orange-300/30 bg-orange-300/5'
                  : 'border-gray-700 opacity-50'
              }`}
              style={{ breakInside: 'avoid' }}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-orange-300 print:text-[10px]">
                  {entry.label}
                </span>
                {hasMatches ? (
                  <span className="whitespace-nowrap rounded bg-orange-300 px-1.5 py-0.5 text-[10px] font-bold text-gray-900 print:text-[8px]">
                    {formatYears(entry.totalYears, lang)}
                  </span>
                ) : (
                  <span className="text-[10px] italic text-gray-500 print:text-[8px]">
                    {t.notPracticed}
                  </span>
                )}
              </div>
              {hasMatches && (
                <div className="mt-1.5 flex flex-wrap gap-1 print:mt-0.5">
                  {entry.matchedClients.map((match) => (
                    <a
                      key={match.client}
                      href={`#${slugifyClient(match.client)}`}
                      className="whitespace-nowrap rounded bg-orange-300/20 px-1.5 py-0.5 text-[10px] text-orange-200 transition-colors hover:bg-orange-300/40 print:text-[8px]"
                    >
                      {match.client}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
