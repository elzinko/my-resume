'use client';

import { formatMatchYears, type MatchYearsLang } from '@/lib/format-match-years';
import { useShortOfferMatchData } from '@/lib/use-short-offer-match-data';
import { computeDefaultMatchData } from '@/lib/short-offer-match';
import type { EducationLevelContent } from '@/lib/education-level-content';
import type { MatchDisplayData } from '@/lib/match-display-types';
import type { Locale } from 'i18n-config';
import { useMemo } from 'react';

interface JobFitSectionProps {
  lang: Locale;
  defaultOfferId: string | null;
  educationLevel: EducationLevelContent;
  /** 'full' = liste verticale avec detail (CV complet), 'compact' = pastilles inline (CV court). */
  variant?: 'full' | 'compact';
}

/** Pastille orange (label + metrique optionnelle). */
const pillCls =
  'cv-pill-match inline-flex max-w-full shrink-0 items-baseline gap-x-1.5 whitespace-nowrap px-2 py-0.5 text-xs font-medium print:gap-1 print:px-1.5 print:py-0.5 print:text-[10px] md:text-sm';

/** Metrique (annees) dans la pastille — plus discret. */
const metricCls =
  'text-[10px] font-normal tabular-nums text-orange-200/95 print:text-[9px] print:!text-orange-300 md:text-xs';

/** Badge client discret (fond colore, sans bordure). */
const clientBadgeCls =
  'inline-block whitespace-nowrap rounded bg-orange-300/15 px-1.5 py-0.5 text-[10px] font-normal text-orange-200/80 print:bg-orange-300/10 print:px-1 print:py-0 print:text-[8px] print:!text-orange-300/70 md:text-xs';

/**
 * Section « Adequation poste » :
 * - full : une ligne par entree (badge + detail clients ou texte)
 * - compact : pastilles inline (CV court)
 */
export default function JobFitSection({
  lang,
  defaultOfferId,
  educationLevel,
  variant = 'full',
}: JobFitSectionProps) {
  const offerData = useShortOfferMatchData(lang, defaultOfferId);

  const defaults = useMemo(
    () => computeDefaultMatchData(lang),
    [lang],
  );

  const data: MatchDisplayData = offerData ?? defaults;
  const entries = data.entries;
  const l = lang as MatchYearsLang;

  const sectionTitle =
    lang === 'en' ? 'Job fit' : 'Adequation poste';

  /* ── Compact : pastilles inline uniquement (CV court) ── */
  if (variant === 'compact') {
    return (
      <section id="job-fit" className="mb-6" aria-label={sectionTitle}>
        <h2 className="border-b pb-1 text-2xl font-semibold text-orange-300">
          {sectionTitle}
        </h2>
        <div className="cv-section-body-gap flex flex-wrap items-center gap-1.5 print:gap-1">
          {/* Education level pill */}
          <span className={pillCls}>
            <span className="min-w-0 truncate">{educationLevel.levelPrimary}</span>
          </span>

          {/* Tech pills */}
          {entries.map((entry, index) => {
            const showYears =
              entry.matchedClients.length > 0 || entry.yearsFromOverride === true;
            const yearsLabel = showYears
              ? formatMatchYears(entry.totalYears, l)
              : '\u2014';

            return (
              <span key={`${index}-${entry.label}`} className={pillCls}>
                <span className="min-w-0 truncate">{entry.label}</span>
                <span className={metricCls}>{yearsLabel}</span>
              </span>
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
      className="cv-mobile-section-mt max-md:!mt-0 print:order-[25] print-preview:order-[25]"
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
          <span className={pillCls}>
            <span className="min-w-0 truncate">{educationLevel.levelPrimary}</span>
          </span>
          <span className="text-sm text-cv-body-muted print:text-[10px] md:text-base">
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
              <span className={pillCls}>
                <span className="min-w-0 truncate">{entry.label}</span>
                <span className={metricCls}>{yearsLabel}</span>
              </span>
              {clients.length > 0 && (
                <span className="flex flex-wrap items-baseline gap-1 print:gap-0.5">
                  {clients.map((c) => (
                    <span key={c.client} className={clientBadgeCls}>
                      {c.client}
                    </span>
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
