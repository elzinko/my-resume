'use client';

import { formatMatchYears, type MatchYearsLang } from '@/lib/format-match-years';
import { useShortOfferMatchData } from '@/lib/use-short-offer-match-data';
import type { Locale } from 'i18n-config';

interface ShortHeaderJobFitPillsProps {
  lang: Locale;
}

/**
 * Bandeau sous le sous-titre (rôle) du CV court : pastilles type skills avec
 * libellé techno + années en texte lisible (ex. « 5 ans »), même source que l’adéquation.
 */
export default function ShortHeaderJobFitPills({
  lang,
}: ShortHeaderJobFitPillsProps) {
  const data = useShortOfferMatchData(lang);
  const entries = data?.entries ?? [];
  const l = lang as MatchYearsLang;
  if (entries.length === 0) return null;

  const listLabel =
    lang === 'en'
      ? 'Role fit at a glance, years of experience per requirement'
      : 'Adéquation poste (aperçu), années d’expérience par exigence';

  return (
    <div
      className="flex flex-wrap items-center gap-1.5 print:gap-1"
      data-testid="header-job-fit-pills"
      role="region"
      aria-label={listLabel}
    >
      <ul className="m-0 flex max-w-full list-none flex-wrap items-center gap-1.5 p-0 print:gap-1">
        {entries.map((entry, index) => {
          const hasMatches = entry.matchedClients.length > 0;
          const showYears =
            hasMatches || entry.yearsFromOverride === true;
          const yearsLabel = showYears
            ? formatMatchYears(entry.totalYears, l)
            : '—';

          const ariaYears = showYears
            ? yearsLabel
            : lang === 'en'
              ? 'not practiced'
              : 'non pratiquée';

          return (
            <li
              key={`${index}-${entry.label}`}
              className="m-0 p-0"
              aria-label={`${entry.label}, ${ariaYears}`}
            >
              <span className="cv-pill-match inline-flex max-w-full flex-wrap items-baseline gap-x-1.5 whitespace-nowrap px-2 py-0.5 text-xs font-medium print:gap-1 print:px-1.5 print:py-0.5 print:text-[10px] md:text-sm">
                <span className="min-w-0 truncate">{entry.label}</span>
                <span className="text-[10px] font-normal tabular-nums text-orange-200/95 print:text-[9px] print:!text-orange-300 md:text-xs">
                  {yearsLabel}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
