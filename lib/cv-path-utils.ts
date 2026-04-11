/**
 * Chemins CV : basePath GitHub Pages et recollage de query sur les liens.
 */

export function stripBasePath(pathname: string, basePath: string): string {
  if (!basePath) return pathname;
  if (pathname.startsWith(basePath)) {
    const rest = pathname.slice(basePath.length);
    return rest || '/';
  }
  return pathname;
}

/** Compatible `URLSearchParams` et retour de `useSearchParams()` (Next). */
type QueryStringable = { toString(): string };

export function withQuery(
  path: string,
  sp: URLSearchParams | QueryStringable,
): string {
  const q = sp.toString();
  return q ? `${path}?${q}` : path;
}
