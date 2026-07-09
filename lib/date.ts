import formatDate from 'intl-dateformat';

function formatDates(date1: string, date2?: string): string | null {
  const startDate = date1 ? formatDate(new Date(date1), 'MM/YYYY') : null;
  const endDate = date2 ? formatDate(new Date(date2), 'MM/YYYY') : null;

  const dates =
    startDate && endDate
      ? startDate + ' - ' + endDate
      : endDate
      ? endDate
      : startDate
      ? startDate
      : null;
  return dates;
}

/**
 * CV long : « MM/YYYY - MM/YYYY » ou « MM/YYYY - {ongoingLabel} » pour une
 * mission en cours (sans date de fin). Expose un repère de fin parseable par
 * les ATS (ex. « Present »/« Présent ») là où `formatDates` laissait la date
 * de début seule, illisible comme période pour un parseur.
 */
export function formatJobDatesFull(
  start: string,
  end: string | undefined,
  ongoingLabel: string,
): string {
  const startStr = start ? formatDate(new Date(start), 'MM/YYYY') : '';
  const endStr = end ? formatDate(new Date(end), 'MM/YYYY') : ongoingLabel;
  if (!startStr) return endStr;
  return `${startStr} - ${endStr}`;
}

/**
 * Période d'une entrée « liste » (Apprentissages / Loisirs), à l'ANNÉE :
 * - fin ouverte (endDate absent/null) → « depuis AAAA » / « since YYYY » (en cours) ;
 * - année unique (start == end)       → « AAAA » ;
 * - sinon                             → « AAAA - AAAA ».
 * Localisé : le libellé « depuis / since » suit la langue du CV.
 */
export function formatEntryPeriod(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  locale: 'fr' | 'en' = 'fr',
): string | null {
  const sy = startDate ? new Date(startDate).getFullYear() : null;
  const ey = endDate ? new Date(endDate).getFullYear() : null;
  if (sy && !ey) return locale === 'en' ? `since ${sy}` : `depuis ${sy}`;
  if (sy && ey) return sy === ey ? `${ey}` : `${sy} - ${ey}`;
  return ey ? `${ey}` : null;
}

/** Année–année ou « YYYY - Présent » : CV court / impression (évite 2023-01-01 brut). */
export function formatJobDatesCompactYears(
  start: string,
  end: string | undefined,
  ongoingLabel: string,
): string {
  const sy = yearFromIso(start);
  if (!sy) {
    return end ? `${start} - ${end}` : `${start} - ${ongoingLabel}`;
  }
  if (!end) {
    return `${sy} - ${ongoingLabel}`;
  }
  const ey = yearFromIso(end);
  if (!ey) {
    return `${sy} - ${end}`;
  }
  return `${sy} - ${ey}`;
}

function yearFromIso(s: string): string | null {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return String(d.getFullYear());
}

/**
 * Âge en années révolues à partir d'une date de naissance ISO (`YYYY-MM-DD`).
 * Parse les composantes à la main (pas de `new Date`) pour éviter les décalages
 * de fuseau horaire autour de minuit. Retourne `null` si la date est invalide.
 *
 * @param birthDateIso date de naissance, ex. `"1980-01-24"`.
 * @param ref date de référence (défaut : maintenant). Injectable pour les tests.
 */
export function computeAge(
  birthDateIso: string,
  ref: Date = new Date(),
): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(birthDateIso);
  if (!m) return null;
  const birthYear = Number(m[1]);
  const birthMonth = Number(m[2]); // 1-12
  const birthDay = Number(m[3]);
  if (birthMonth < 1 || birthMonth > 12 || birthDay < 1 || birthDay > 31) {
    return null;
  }
  const refMonth = ref.getMonth() + 1; // 1-12
  const refDay = ref.getDate();
  let age = ref.getFullYear() - birthYear;
  if (refMonth < birthMonth || (refMonth === birthMonth && refDay < birthDay)) {
    age -= 1;
  }
  return age >= 0 ? age : null;
}

export default formatDates;
