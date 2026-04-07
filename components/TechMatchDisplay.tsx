'use client';

import React, { useCallback, useState } from 'react';
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

const MAX_CLIENTS_VISIBLE = 3;

const labels = {
  fr: {
    sectionTitle: 'Adéquation avec le poste',
    years: 'ans',
    year: 'an',
    notPracticed: 'Non pratiquée',
    /** Accessibilité : pastille « … » pour afficher tous les clients. */
    expandClientsAria: 'Afficher tous les clients',
    collapseClientsAria: 'Réduire la liste des clients',
  },
  en: {
    sectionTitle: 'Profile Match',
    years: 'years',
    year: 'year',
    notPracticed: 'Not practiced',
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
}: TechMatchDisplayProps) {
  const t = labels[lang];
  const entries = data?.entries ?? [];
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>(
    {},
  );

  const toggleRow = useCallback((index: number) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  return (
    <section
      id="profile-match"
      className="mt-10 max-md:!mt-0 print:mt-4"
      data-testid="profile-match"
    >
      <h2 className="border-b pb-1 text-lg font-semibold text-orange-300 max-md:text-base max-md:pb-0.5 print:!text-orange-300 md:text-2xl">
        {t.sectionTitle}
      </h2>

      <div className="mt-3 flex flex-col gap-2 print:mt-2 print:gap-2 md:mt-4 md:gap-3">
        {entries.map((entry, index) => {
          const hasMatches = entry.matchedClients.length > 0;
          const expanded = Boolean(expandedRows[index]);
          const clients = entry.matchedClients;
          const n = clients.length;
          const hasOverflow = n > MAX_CLIENTS_VISIBLE;
          const visibleClients =
            expanded || !hasOverflow
              ? clients
              : clients.slice(0, MAX_CLIENTS_VISIBLE);
          const hiddenClients =
            expanded || !hasOverflow ? [] : clients.slice(MAX_CLIENTS_VISIBLE);

          return (
            <div
              key={`${index}-${entry.label}`}
              className={`cv-match-requirement-card min-w-0 ${
                !hasMatches ? 'opacity-60' : ''
              }`}
              style={{ breakInside: 'avoid' }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-1.5 gap-y-1 md:gap-2">
                <h3 className="min-w-0 flex-1 text-sm font-semibold leading-snug text-orange-300 max-md:text-xs max-md:leading-tight print:text-[11px] print:!text-orange-300 md:text-base lg:text-lg">
                  {entry.label}
                </h3>
                {hasMatches ? (
                  <span className="cv-pill-match shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold tabular-nums max-md:px-1 max-md:py-0.5 max-md:text-[11px] print:px-1.5 print:text-[10px] md:px-2 md:text-sm">
                    {formatYears(entry.totalYears, lang)}
                  </span>
                ) : null}
              </div>

              {hasMatches ? (
                <>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 print:mt-1 print:gap-1 md:mt-2 md:gap-x-2 md:gap-y-2">
                    {visibleClients.map((match) => (
                      <MatchClientPill key={match.client} client={match.client} />
                    ))}
                    {hiddenClients.length > 0 ? (
                      <div
                        className={
                          expanded
                            ? 'flex w-full flex-wrap gap-1.5 md:gap-x-2 md:gap-y-2'
                            : 'hidden w-full flex-wrap gap-1.5 print:flex print:gap-1 md:gap-x-2 md:gap-y-2'
                        }
                      >
                        {hiddenClients.map((match) => (
                          <MatchClientPill
                            key={match.client}
                            client={match.client}
                          />
                        ))}
                      </div>
                    ) : null}
                    {hasOverflow ? (
                      expanded ? (
                        <button
                          type="button"
                          className="inline-flex rounded print:hidden outline-none ring-orange-300/40 focus-visible:ring-2"
                          onClick={() => toggleRow(index)}
                          aria-expanded
                          aria-label={t.collapseClientsAria}
                        >
                          <span className="cv-pill-match inline-flex min-w-[1.5rem] items-center justify-center whitespace-nowrap px-1.5 py-0.5 text-[10px] font-medium max-md:min-w-[1.35rem] max-md:px-1 max-md:py-0.5 max-md:text-[9px]">
                            −
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="inline-flex rounded print:hidden outline-none ring-orange-300/40 focus-visible:ring-2"
                          onClick={() => toggleRow(index)}
                          aria-expanded={false}
                          aria-label={t.expandClientsAria}
                        >
                          <span className="cv-pill-match inline-flex min-w-[1.5rem] items-center justify-center whitespace-nowrap px-1.5 py-0.5 text-[10px] font-medium max-md:min-w-[1.35rem] max-md:px-1 max-md:py-0.5 max-md:text-[9px]">
                            …
                          </span>
                        </button>
                      )
                    ) : null}
                  </div>
                </>
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
