'use client';

import React from 'react';
import MatchClientsOverflowRow from './MatchClientsOverflowRow';
import { formatMatchYears, type MatchYearsLang } from '@/lib/format-match-years';

export interface MatchEntry {
  label: string;
  matchedClients: Array<{
    client: string;
    startDate: string;
    endDate?: string;
  }>;
  totalYears: number;
  /** `totalYears` provient du champ `experienceYearsOverride` sur l’exigence. */
  yearsFromOverride?: boolean;
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
    notPracticed: 'Non pratiquée',
    manualYearsHint:
      'Durée indiquée manuellement (pas dérivée des missions ci-dessous).',
    expandClientsAria: 'Afficher tous les clients',
    collapseClientsAria: 'Réduire la liste des clients',
  },
  en: {
    sectionTitle: 'Job fit',
    notPracticed: 'Not practiced',
    manualYearsHint: 'Years set manually (not derived from roles below).',
    expandClientsAria: 'Show all clients',
    collapseClientsAria: 'Collapse client list',
  },
} as const;

export default function TechMatchDisplay({
  data,
  lang,
}: TechMatchDisplayProps) {
  const t = labels[lang];
  const l = lang as MatchYearsLang;
  const entries = data?.entries ?? [];

  return (
    <section
      id="profile-match"
      className="mt-10 max-md:!mt-0 print:mt-4"
      data-testid="profile-match"
    >
      <h2 className="border-b pb-1 text-2xl font-semibold text-orange-300 print:!text-orange-300">
        {t.sectionTitle}
      </h2>

      <div className="mt-3 flex flex-col gap-3 print:mt-2 print:gap-2 md:mt-4 md:gap-3">
        {entries.map((entry, index) => {
          const hasMatches = entry.matchedClients.length > 0;
          const showYearsPill = hasMatches || entry.yearsFromOverride;
          const yearsLabel = showYearsPill
            ? formatMatchYears(entry.totalYears, l)
            : null;

          return (
            <div
              key={`${index}-${entry.label}`}
              className={`cv-match-requirement-card min-w-0 border-0 bg-transparent p-0 print:p-0 ${
                !hasMatches && !entry.yearsFromOverride ? 'opacity-60' : ''
              }`}
              style={{ breakInside: 'avoid' }}
              data-testid="profile-match-entry"
            >
              <div className="cv-pill-match inline-flex max-w-full flex-wrap items-baseline gap-x-2 gap-y-0.5 px-2.5 py-1 print:px-2 print:py-0.5 md:px-3 md:py-1.5">
                <span className="font-medium text-orange-300 print:!text-orange-300">
                  {entry.label}
                </span>
                {yearsLabel ? (
                  <span className="text-xs font-normal tabular-nums text-orange-200/95 print:text-[10px] print:!text-orange-300 md:text-sm">
                    {yearsLabel}
                  </span>
                ) : (
                  <span className="text-xs italic text-gray-500 print:text-[10px] md:text-sm">
                    {t.notPracticed}
                  </span>
                )}
              </div>

              {hasMatches ? (
                <div className="mt-1.5 print:mt-1 md:mt-2">
                  <MatchClientsOverflowRow
                    clients={entry.matchedClients}
                    expandAriaLabel={t.expandClientsAria}
                    collapseAriaLabel={t.collapseClientsAria}
                  />
                </div>
              ) : entry.yearsFromOverride ? (
                <p className="mt-1.5 text-xs text-gray-500 max-md:text-[11px] print:mt-1 print:text-[10px] md:mt-2 md:text-sm">
                  {t.manualYearsHint}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
