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
  /** 'grid' = 3 colonnes (CV complet), 'compact' = colonne unique (CV court). */
  variant?: 'grid' | 'compact';
}

/**
 * Section « Adequation poste » : pastilles orange — niveau de formation +
 * competences techniques (Java, JavaScript par defaut, ou offre si presente).
 * Chaque pastille affiche le label et le nombre d'annees d'experience.
 */
export default function JobFitSection({
  lang,
  defaultOfferId,
  educationLevel,
  variant = 'grid',
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

  // Pastille orange avec label + metrique (annees)
  const pillBase =
    'cv-pill-match inline-flex max-w-full shrink-0 flex-wrap items-baseline gap-x-1.5 whitespace-nowrap px-2 py-0.5 text-xs font-medium print:gap-1 print:px-1.5 print:py-0.5 print:text-[10px] md:text-sm';
  const metricCls =
    'text-[10px] font-normal tabular-nums text-orange-200/95 print:text-[9px] print:!text-orange-300 md:text-xs';

  if (variant === 'compact') {
    return (
      <section id="job-fit" className="mb-6" aria-label={sectionTitle}>
        <h2 className="border-b pb-1 text-2xl font-semibold text-orange-300">
          {sectionTitle}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 print:gap-1">
          {/* Education level pill */}
          <span className={pillBase}>
            <span className="min-w-0 truncate">{educationLevel.levelPrimary}</span>
            <span className={metricCls}>{educationLevel.effectiveLevelDetail}</span>
          </span>

          {/* Tech pills */}
          {entries.map((entry, index) => {
            const hasMatches = entry.matchedClients.length > 0;
            const showYears = hasMatches || entry.yearsFromOverride === true;
            const yearsLabel = showYears
              ? formatMatchYears(entry.totalYears, l)
              : '\u2014';

            return (
              <span
                key={`${index}-${entry.label}`}
                className={pillBase}
                aria-label={`${entry.label}, ${showYears ? yearsLabel : lang === 'en' ? 'not practiced' : 'non pratiquee'}`}
              >
                <span className="min-w-0 truncate">{entry.label}</span>
                <span className={metricCls}>{yearsLabel}</span>
              </span>
            );
          })}
        </div>
      </section>
    );
  }

  // variant === 'grid' — 3 columns like Domains
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
      <div className="cv-domains-grid">
        {/* Column 1: Education level */}
        <div className="mt-0 min-w-0 md:mt-4">
          <span className={pillBase}>
            <span className="min-w-0 truncate">{educationLevel.levelPrimary}</span>
          </span>
          <p className="cv-about-domain-print-body mt-1.5 text-sm leading-snug text-cv-body-muted print:mt-4 print:min-h-0 md:mt-4 md:min-h-[100px] md:text-base md:leading-normal">
            {educationLevel.effectiveLevelDetail}
          </p>
        </div>

        {/* Column 2+: Tech entries */}
        {entries.map((entry, index) => {
          const hasMatches = entry.matchedClients.length > 0;
          const showYears = hasMatches || entry.yearsFromOverride === true;
          const yearsLabel = showYears
            ? formatMatchYears(entry.totalYears, l)
            : '\u2014';

          return (
            <div key={`${index}-${entry.label}`} className="mt-0 min-w-0 md:mt-4">
              <span className={pillBase}>
                <span className="min-w-0 truncate">{entry.label}</span>
                <span className={metricCls}>{yearsLabel}</span>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
