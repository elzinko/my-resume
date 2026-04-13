export type MatchYearsLang = 'fr' | 'en';

/**
 * Libellé lisible des années d’expérience (adéquation offre / pastilles header).
 */
export function formatMatchYears(
  totalYears: number,
  lang: MatchYearsLang,
): string {
  const t =
    lang === 'en'
      ? { years: 'years', year: 'year' }
      : { years: 'ans', year: 'an' };
  if (!Number.isFinite(totalYears) || totalYears < 0) return '—';
  if (totalYears < 1) return `<1 ${t.year}`;
  const rounded = Math.round(totalYears);
  return `${rounded} ${rounded === 1 ? t.year : t.years}`;
}
