'use client';

import {
  formatMatchYears,
  type MatchYearsLang,
} from '@/lib/format-match-years';
import { useShortOfferMatchData } from '@/lib/use-short-offer-match-data';
import {
  computeDefaultMatchData,
  SHORT_PROFILE_MATCH_MAX,
} from '@/lib/short-offer-match';
import type { EducationLevelContent } from '@/lib/education-level-content';
import type { MatchDisplayData } from '@/lib/match-display-types';
import type { Locale } from 'i18n-config';
import { useMemo } from 'react';
import Pill from '@/components/Pill';
import { slugifyClient } from '@/lib/slug';

interface JobFitSectionProps {
  lang: Locale;
  educationLevel: EducationLevelContent;
  /** 'full' = liste verticale avec detail (CV complet), 'compact' = pastilles inline (CV court). */
  variant?: 'full' | 'compact';
}

/**
 * Section « Adequation poste » :
 * - full : une ligne par entree (badge + detail clients ou texte)
 * - compact : pastilles inline (CV court)
 */
export default function JobFitSection({
  lang,
  educationLevel,
  variant = 'full',
}: JobFitSectionProps) {
  const offerData = useShortOfferMatchData(lang);

  const defaults = useMemo(() => computeDefaultMatchData(lang), [lang]);

  const data: MatchDisplayData = offerData ?? defaults;
  const entries =
    variant === 'compact'
      ? data.entries.slice(0, SHORT_PROFILE_MATCH_MAX)
      : data.entries;
  const l = lang as MatchYearsLang;

  const sectionTitle = lang === 'en' ? 'Job fit' : 'Adequation poste';

  /* ── Compact : pastilles inline uniquement (CV court) ── */
  if (variant === 'compact') {
    return (
      <section id="job-fit" className="mb-6" aria-label={sectionTitle}>
        <h2 className="border-b pb-1 text-2xl font-semibold text-orange-300">
          {sectionTitle}
        </h2>
        <div className="cv-section-body-gap flex flex-wrap items-center gap-1.5 print:gap-1">
          {/* Education level pill */}
          <Pill color="match" compact>
            {educationLevel.levelPrimary}
          </Pill>

          {/* Tech pills */}
          {entries.map((entry, index) => {
            const clientCount = entry.matchedClients.length;
            const showYears =
              clientCount > 0 || entry.yearsFromOverride === true;
            const yearsLabel = showYears
              ? formatMatchYears(entry.totalYears, l)
              : '\u2014';
            const clientsLabel =
              clientCount > 0
                ? `${clientCount} ${clientCount === 1 ? 'client' : 'clients'}`
                : undefined;
            const metric = clientsLabel
              ? `${yearsLabel} · ${clientsLabel}`
              : yearsLabel;

            return (
              <Pill
                key={`${index}-${entry.label}`}
                color="match"
                compact
                metric={metric}
              >
                {entry.label}
              </Pill>
            );
          })}
        </div>
      </section>
    );
  }

  /* ── Full : une ligne par entree avec detail ── */
  return (
    <section
      id="job-fit"
      className="cv-mobile-section-mt print-preview:order-[25] max-md:!mt-0 print:order-[25]"
      aria-label={sectionTitle}
    >
      <div className="border-b pb-1">
        <h2 className="min-w-0 text-2xl font-semibold text-orange-300">
          {sectionTitle}
        </h2>
      </div>

      <ul className="mt-3 space-y-2.5 md:mt-4 md:space-y-3 print:mt-2 print:space-y-1.5">
        {/* Education level row */}
        <li className="flex flex-wrap items-baseline gap-x-2 gap-y-1 print:gap-x-1.5">
          <Pill color="match">{educationLevel.levelPrimary}</Pill>
          <span className="text-sm text-cv-body-muted md:text-base print:text-[10px]">
            {educationLevel.effectiveLevelDetail}
          </span>
        </li>

        {/* Tech entry rows */}
        {entries.map((entry, index) => {
          const showYears =
            entry.matchedClients.length > 0 || entry.yearsFromOverride === true;
          const yearsLabel = showYears
            ? formatMatchYears(entry.totalYears, l)
            : '\u2014';
          const clients = entry.matchedClients;

          return (
            <li
              key={`${index}-${entry.label}`}
              className="flex flex-wrap items-baseline gap-x-2 gap-y-1 print:gap-x-1.5"
            >
              <Pill color="match" metric={yearsLabel}>
                {entry.label}
              </Pill>
              {clients.length > 0 && (
                <span className="flex flex-wrap items-baseline gap-1 print:gap-0.5">
                  {clients.map((c) => (
                    <Pill
                      key={c.client}
                      color="match"
                      size="s"
                      border={false}
                      href={`#${slugifyClient(c.client)}`}
                    >
                      {c.client}
                    </Pill>
                  ))}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
