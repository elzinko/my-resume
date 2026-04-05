'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { i18n, type Locale } from '../i18n-config';
import {
  cvHeaderLocaleBtn,
  cvHeaderLocaleBtnActive,
} from '@/lib/cv-header-toolbar';

function stripBasePath(pathname: string, basePath: string): string {
  if (!basePath) return pathname;
  if (pathname.startsWith(basePath)) {
    const rest = pathname.slice(basePath.length);
    return rest || '/';
  }
  return pathname;
}

interface LocaleSwitcherProps {
  /** Fermer le menu mobile après navigation. */
  onNavigate?: () => void;
  /** Classes du `<ul>` (ex. une seule ligne sans wrap). */
  listClassName?: string;
}

export default function LocaleSwitcher({
  onNavigate,
  listClassName = 'flex flex-wrap gap-2',
}: LocaleSwitcherProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const rawPath = usePathname() || '/';
  const pathName = stripBasePath(rawPath, basePath);

  const segments = pathName.split('/');
  const maybeLocale = segments[1];
  const currentLocale: Locale =
    maybeLocale && i18n.locales.includes(maybeLocale as Locale)
      ? (maybeLocale as Locale)
      : i18n.defaultLocale;

  const redirectedPathName = (locale: string): string => {
    if (!pathName || pathName === '/') {
      return `/${locale}`;
    }
    const segs = pathName.split('/');
    if (segs.length < 2 || !segs[1]) {
      return `/${locale}`;
    }
    const next = [...segs];
    next[1] = locale;
    return next.join('/') || `/${locale}`;
  };

  return (
    <ul className={listClassName}>
      {i18n.locales.map((locale) => {
        const active = locale === currentLocale;
        return (
          <li key={locale} className="shrink-0">
            <Link
              className={`${cvHeaderLocaleBtn} ${active ? cvHeaderLocaleBtnActive : ''}`}
              href={redirectedPathName(locale)}
              hrefLang={locale}
              aria-current={active ? 'true' : undefined}
              onClick={() => onNavigate?.()}
            >
              {locale}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
