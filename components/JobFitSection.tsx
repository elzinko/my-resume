'use client';

import { formatMatchYears, type MatchYearsLang } from '@/lib/format-match-years';
import { useShortOfferMatchData } from '@/lib/use-short-offer-match-data';
import type { Locale } from 'i18n-config';

interface JobFitSectionProps {
  lang: Locale;
  defaultOfferId: string | null;
  /** Libelle du niveau de formation (ex. "Equivalent Bac+5"). */
  educationLabel: string;
}

/**
 * Section « Adequation poste » : pastille niveau de formation + pastilles
 * competences liees a l'offre (avec annees d'experience).
 * Visible uniquement quand il y a des donnees (offre ou niveau).
 */
export default function JobFitSection({
  lang,
  defaultOfferId,
  educationLabel,
}: JobFitSectionProps) {
  const data = useShortOfferMatchData(lang, defaultOfferId);
  const entries = data?.entries ?? [];
  const l = lang as MatchYearsLang;

  const sectionLabel =
    lang === 'en' ? 'Job fit' : 'Adequation poste';

  return (
    <section
      id="job-fit"
      className="print:order-[15] print-preview:order-[15]"
      aria-label={sectionLabel}
    >
      <div className="flex flex-wrap items-center gap-1.5 print:gap-1">
        {/* Education level pill */}
        <span className="cv-pill-match inline-flex max-w-full shrink-0 items-center whitespace-nowrap px-2 py-0.5 text-xs font-medium print:px-1.5 print:py-0.5 print:text-[10px] md:text-sm">
          {educationLabel}
        </span>

        {/* Match requirement pills */}
        {entries.map((entry, index) => {
          const hasMatches = entry.matchedClients.length > 0;
          const showYears = hasMatches || entry.yearsFromOverride === true;
          const yearsLabel = showYears
            ? formatMatchYears(entry.totalYears, l)
            : '\u2014';

          const ariaYears = showYears
            ? yearsLabel
            : lang === 'en'
              ? 'not practiced'
              : 'non pratiquee';

          return (
            <span
              key={`${index}-${entry.label}`}
              className="cv-pill-match inline-flex max-w-full flex-wrap items-baseline gap-x-1.5 whitespace-nowrap px-2 py-0.5 text-xs font-medium print:gap-1 print:px-1.5 print:py-0.5 print:text-[10px] md:text-sm"
              aria-label={`${entry.label}, ${ariaYears}`}
            >
              <span className="min-w-0 truncate">{entry.label}</span>
              <span className="text-[10px] font-normal tabular-nums text-orange-200/95 print:text-[9px] print:!text-orange-300 md:text-xs">
                {yearsLabel}
              </span>
            </span>
          );
        })}
      </div>
    </section>
  );
}
