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
