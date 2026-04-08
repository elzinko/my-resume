/** Aperçu mobile (même onglet) : paramètre d’URL + iframe pour un viewport étroit réel. */

export const CV_VIEWPORT_PARAM = 'cvViewport' as const;
export const CV_VIEWPORT_MOBILE_VALUE = 'mobile' as const;

export function isCvViewportMobileQuery(sp: URLSearchParams): boolean {
  const v = sp.get(CV_VIEWPORT_PARAM);
  return (
    v === CV_VIEWPORT_MOBILE_VALUE ||
    v === '1' ||
    v === 'true'
  );
}

/** Query sans `cvViewport` (URL chargée dans l’iframe pour éviter l’emboîtement). */
export function searchParamsWithoutCvViewport(
  sp: URLSearchParams | string,
): string {
  const next = new URLSearchParams(
    typeof sp === 'string' ? sp : sp.toString(),
  );
  next.delete(CV_VIEWPORT_PARAM);
  return next.toString();
}

/**
 * URL absolue pour l’iframe (même origine, sans `cvViewport`).
 */
export function buildCvMobilePreviewIframeSrc(
  pathname: string,
  sp: URLSearchParams,
): string {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const qs = searchParamsWithoutCvViewport(sp);
  const origin =
    typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${basePath}${path}${qs ? `?${qs}` : ''}`;
}
