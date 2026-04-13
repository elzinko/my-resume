/**
 * Convertit les `searchParams` App Router (Next 13+) en `URLSearchParams`.
 */
export function recordToURLSearchParams(
  record: Record<string, string | string[] | undefined> | undefined,
): URLSearchParams {
  const u = new URLSearchParams();
  if (!record) return u;
  for (const [key, value] of Object.entries(record)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        if (v !== undefined && v !== '') u.append(key, v);
      }
    } else if (value !== '') {
      u.set(key, value);
    }
  }
  return u;
}
