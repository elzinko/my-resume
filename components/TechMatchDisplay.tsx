'use client';

import React from 'react';
import MatchClientsOverflowRow from './MatchClientsOverflowRow';

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
  /**
   * CV court : liste en colonne gauche (techno + durée), alignée sur Contact / Compétences.
   */
  variant?: 'default' | 'compact';
}

const labels = {
  fr: {
    sectionTitle: 'Adéquation avec le poste',
    /** CV court : titre court (colonne gauche + impression). */
    sectionTitleCompact: 'Alignement offre',
    years: 'ans',
    year: 'an',
    notPracticed: 'Non pratiquée',
    manualYearsHint:
      'Durée indiquée manuellement (pas dérivée des missions ci-dessous).',
    /** Accessibilité : pastille « … » pour afficher tous les clients. */
    expandClientsAria: 'Afficher tous les clients',
    collapseClientsAria: 'Réduire la liste des clients',
  },
  en: {
    sectionTitle: 'Profile Match',
    sectionTitleCompact: 'Job fit',
    years: 'years',
    year: 'year',
    notPracticed: 'Not practiced',
    manualYearsHint: 'Years set manually (not derived from roles below).',
    expandClientsAria: 'Show all clients',
    collapseClientsAria: 'Collapse client list',
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
  variant = 'default',
}: TechMatchDisplayProps) {
  const t = labels[lang];
  const entries = data?.entries ?? [];

  if (variant === 'compact') {
    return (
      <section
        id="profile-match"
        className="mb-6 print:mb-4 print:break-inside-avoid"
        data-testid="profile-match"
      >
        <h2 className="border-b pb-1 text-2xl font-semibold text-orange-300 print:!text-orange-300 print:text-sm">
          {t.sectionTitleCompact}
        </h2>
        <ul className="mt-2 list-none space-y-1 p-0 print:mt-1 print:space-y-0.5">
          {entries.map((entry, index) => {
            const hasMatches = entry.matchedClients.length > 0;
            const showYearsPill = hasMatches || entry.yearsFromOverride;
            const muted =
              !hasMatches && !entry.yearsFromOverride ? 'opacity-70' : '';

            return (
              <li
                key={`${index}-${entry.label}`}
                className={`min-w-0 ${muted}`}
                style={{ breakInside: 'avoid' }}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="cv-pill-match inline-flex min-w-0 max-w-full shrink items-center px-1.5 py-0.5 leading-snug print:px-1 print:py-0.5 print:max-w-[min(100%,12rem)]">
                    <span className="truncate text-sm font-semibold print:text-[10px]">
                      {entry.label}
                    </span>
                  </span>
                  {showYearsPill ? (
                    <span className="cv-pill-match-metric shrink-0 whitespace-nowrap px-1.5 py-0.5 text-[11px] print:px-1 print:text-[10px]">
                      {formatYears(entry.totalYears, lang)}
                    </span>
                  ) : (
                    <span className="shrink-0 text-[11px] italic text-gray-500 print:text-[10px]">
                      {t.notPracticed}
                    </span>
                  )}
                </div>
                {entry.yearsFromOverride && !hasMatches ? (
                  <p className="mt-0.5 text-[10px] leading-tight text-gray-500 print:text-[9px]">
                    {t.manualYearsHint}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  return (
    <section
      id="profile-match"
      className="mt-10 max-md:!mt-0 print:mt-4"
      data-testid="profile-match"
    >
      <h2 className="border-b pb-1 text-2xl font-semibold text-orange-300 print:!text-orange-300">
        {t.sectionTitle}
      </h2>

      <div className="mt-3 grid grid-cols-1 gap-2 print:mt-2 print:grid-cols-3 print:gap-3 md:mt-4 md:grid-cols-3 md:gap-3">
        {entries.map((entry, index) => {
          const hasMatches = entry.matchedClients.length > 0;
          const showYearsPill = hasMatches || entry.yearsFromOverride;

          return (
            <div
              key={`${index}-${entry.label}`}
              className={`cv-match-requirement-card min-w-0 ${
                !hasMatches && !entry.yearsFromOverride ? 'opacity-60' : ''
              }`}
              style={{ breakInside: 'avoid' }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-1.5 gap-y-1 md:gap-2">
                <h3 className="min-w-0 flex-1 text-sm font-semibold leading-snug text-orange-300 max-md:text-xs max-md:leading-tight print:text-[11px] print:!text-orange-300 md:text-base lg:text-lg">
                  {entry.label}
                </h3>
                {showYearsPill ? (
                  <span className="cv-pill-match-metric shrink-0 px-1.5 py-0.5 text-xs max-md:px-1 max-md:py-0.5 max-md:text-[11px] print:px-1.5 print:text-[10px] md:px-2 md:text-sm">
                    {formatYears(entry.totalYears, lang)}
                  </span>
                ) : null}
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
              ) : (
                <p className="mt-1.5 text-xs italic text-gray-500 max-md:text-[11px] print:mt-1 print:text-[10px] md:mt-2 md:text-sm">
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
