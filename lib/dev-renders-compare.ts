/**
 * Feature 0017 — /dev/renders compare mode.
 *
 * Pure helpers that describe the comparison matrix (variant × medium, plus a
 * mobile row) and build the live iframe `src` for a given deployment base URL.
 * Kept side-effect free so it can be unit-tested with `node:test` and reused
 * by the client page.
 */

/** One row of the compare matrix. `mobile` rows render at a phone width. */
export interface CompareRow {
  id: string;
  label: string;
  /** Path segment after the locale, e.g. '' (full CV) or '/short'. */
  variantPath: string;
  /** Query string for the medium, e.g. '' (web) or '?print=1' (print preview). */
  mediumQuery: string;
  /** When true, the cell is rendered at a fixed phone width (~390px). */
  mobile?: boolean;
}

/**
 * Build the iframe `src` for one cell: `${base}/${lang}${variantPath}${mediumQuery}`.
 * Returns '' when no base is provided so the caller can render a placeholder.
 */
export function compareCellSrc(
  base: string,
  lang: string,
  row: CompareRow,
): string {
  const cleanBase = base.trim().replace(/\/+$/, '');
  if (!cleanBase) return '';
  return `${cleanBase}/${lang}${row.variantPath}${row.mediumQuery}`;
}

/** The full compare matrix: full/short × web/print, then a mobile row. */
export function compareRows(): CompareRow[] {
  return [
    {
      id: 'full-web',
      label: 'Complet — Web',
      variantPath: '',
      mediumQuery: '',
    },
    {
      id: 'full-print',
      label: 'Complet — Aperçu print',
      variantPath: '',
      mediumQuery: '?print=1',
    },
    {
      id: 'short-web',
      label: 'Court — Web',
      variantPath: '/short',
      mediumQuery: '',
    },
    {
      id: 'short-print',
      label: 'Court — Aperçu print',
      variantPath: '/short',
      mediumQuery: '?print=1',
    },
    {
      id: 'mobile',
      label: 'Mobile — Complet (Web)',
      variantPath: '',
      mediumQuery: '',
      mobile: true,
    },
  ];
}
