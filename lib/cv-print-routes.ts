import { i18n, type Locale } from '../i18n-config';

/** `true` pour `/fr`, `/en` (page CV complète), pas `/fr/short` ni offres. */
export function isFullCvRootPathname(pathname: string | null): boolean {
  if (!pathname) return false;
  const parts = pathname.split('/').filter(Boolean);
  return (
    parts.length === 1 &&
    (i18n.locales as readonly string[]).includes(parts[0] as string)
  );
}

/** `true` pour `/fr/short`, `/en/short`. */
export function isShortCvPathname(pathname: string | null): boolean {
  if (!pathname) return false;
  const parts = pathname.split('/').filter(Boolean);
  return (
    parts.length === 2 &&
    parts[1] === 'short' &&
    (i18n.locales as readonly string[]).includes(parts[0] as string)
  );
}

/**
 * Locale pour les pages où `?print` active `html.cv-print-preview` :
 * `/fr`, `/fr/short` (les query params d'offre s'appliquent désormais sur la racine).
 */
export function localeFromCvPrintPreviewPathname(
  pathname: string | null,
): Locale | null {
  if (!pathname) return null;
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return null;
  const lang = parts[0];
  if (!(i18n.locales as readonly string[]).includes(lang as string))
    return null;
  if (parts.length === 1) return lang as Locale;
  if (parts.length === 2 && parts[1] === 'short') return lang as Locale;
  return null;
}

/** CV long ou CV court : aperçu `?print`. */
export function isCvPrintPreviewPathname(pathname: string | null): boolean {
  return localeFromCvPrintPreviewPathname(pathname) !== null;
}

export function localeFromPathIfRoot(pathname: string | null): Locale | null {
  if (!pathname || !isFullCvRootPathname(pathname)) return null;
  const seg = pathname.split('/').filter(Boolean)[0] as string;
  return seg as Locale;
}

/** URL absolue path pour ouvrir le CV court avec autoprint (incl. `NEXT_PUBLIC_BASE_PATH`). */
export function shortAutoprintPath(lang: Locale): string {
  const bp = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  const suffix = `/${lang}/short?autoprint=1`;
  return bp ? `${bp}${suffix}` : suffix;
}
