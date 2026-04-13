'use client';

import {
  formatMatchYears,
  type MatchYearsLang,
} from '@/lib/format-match-years';
import { useShortOfferMatchData } from '@/lib/use-short-offer-match-data';
import Pill from '@/components/Pill';
import type { Locale } from 'i18n-config';

interface ShortHeaderJobFitPillsProps {
  lang: Locale;
}

/**
 * Bandeau sous le sous-titre (role) du CV court : pastilles type skills avec
 * libelle techno + annees en texte lisible (ex. « 5 ans »), meme source que l'adequation.
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
      : 'Adequation poste (apercu), annees d\u2019experience par exigence';

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
            <li
              key={`${index}-${entry.label}`}
              className="m-0 p-0"
              aria-label={`${entry.label}, ${ariaYears}`}
            >
              <Pill color="match" compact metric={yearsLabel}>
                {entry.label}
              </Pill>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
