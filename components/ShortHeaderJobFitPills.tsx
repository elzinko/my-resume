'use client';

import { useShortOfferMatchData } from '@/lib/use-short-offer-match-data';
import type { Locale } from 'i18n-config';

function yearsCircleLabel(totalYears: number): string {
  if (!Number.isFinite(totalYears) || totalYears < 0) return '—';
  if (totalYears < 1) return '<1';
  return String(Math.round(totalYears));
}

interface ShortHeaderJobFitPillsProps {
  lang: Locale;
  defaultOfferId: string | null;
}

/**
 * Bandeau sous le sous-titre (rôle) du CV court : pastilles type skills + pastille circulaire
 * pour les années d’expérience par critère — même jeu de données que le bloc Adéquation.
 */
export default function ShortHeaderJobFitPills({
  lang,
  defaultOfferId,
}: ShortHeaderJobFitPillsProps) {
  const data = useShortOfferMatchData(lang, defaultOfferId);
  const entries = data?.entries ?? [];
  if (entries.length === 0) return null;

  const listLabel =
    lang === 'en'
      ? 'Role fit at a glance, years of experience per requirement'
      : 'Adéquation poste (aperçu), années d’expérience par exigence';

  return (
    <div
      className="mt-2 flex w-full flex-wrap justify-end gap-1.5 print:mt-1.5 print:gap-1 md:mt-3"
      role="region"
      aria-label={listLabel}
    >
      <ul className="m-0 flex max-w-full list-none flex-wrap justify-end gap-1.5 p-0 print:gap-1">
        {entries.map((entry, index) => {
          const hasMatches = entry.matchedClients.length > 0;
          const showYears =
            hasMatches || entry.yearsFromOverride === true;
          const yearsText = showYears
            ? yearsCircleLabel(entry.totalYears)
            : '—';

          const ariaYears =
            lang === 'en'
              ? yearsText === '—'
                ? 'no years shown'
                : yearsText === '<1'
                  ? 'less than one year experience'
                  : `${yearsText} years experience`
              : yearsText === '—'
                ? 'sans années affichées'
                : yearsText === '<1'
                  ? 'moins d’un an d’expérience'
                  : `${yearsText} ans d’expérience`;

          return (
            <li
              key={`${index}-${entry.label}`}
              className="m-0 p-0"
              aria-label={`${entry.label}, ${ariaYears}`}
            >
              <span className="cv-pill-match inline-flex max-w-full items-center gap-1.5 whitespace-nowrap px-2 py-0.5 text-xs font-medium print:gap-1 print:px-1.5 print:py-0.5 print:text-[10px] md:text-sm">
                <span className="min-w-0 truncate">{entry.label}</span>
                <span
                  className="inline-flex h-5 min-w-[1.25rem] shrink-0 items-center justify-center rounded-full border border-orange-300/90 bg-orange-300/20 px-0.5 text-[9px] font-semibold tabular-nums leading-none text-orange-300 print:h-4 print:min-w-4 print:text-[8px] print:!text-orange-300"
                  aria-hidden
                >
                  {yearsText}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
