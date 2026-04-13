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

export default formatDates;
