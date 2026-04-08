/** `?print`, `?print=1`, etc. — même règle que `FullCvPrintPreviewEffect`. */
export function isCvPrintPreviewQuery(sp: URLSearchParams): boolean {
  if (!sp.has('print')) return false;
  const v = sp.get('print');
  return v === null || v === '' || v === '1' || v === 'true';
}
