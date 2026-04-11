'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { i18n, type Locale } from '../i18n-config';
import { cvHeaderLocaleSwitchBtn } from '@/lib/cv-header-toolbar';
import { stripBasePath, withQuery } from '@/lib/cv-path-utils';
import LocaleTargetFlag from './LocaleTargetFlag';

/** Libellés aria / title selon la langue affichée et la langue cible du lien. */
const SWITCH_TITLE: Record<Locale, Record<Locale, string>> = {
  fr: {
    fr: 'Passer en français',
    en: 'Switch to French',
  },
  en: {
    fr: 'Passer en anglais',
    en: 'Switch to English',
  },
};

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
  const searchParams = useSearchParams();
  const pathName = stripBasePath(rawPath, basePath);

  const segments = pathName.split('/');
  const maybeLocale = segments[1];
  const currentLocale: Locale =
    maybeLocale && i18n.locales.includes(maybeLocale as Locale)
      ? (maybeLocale as Locale)
      : i18n.defaultLocale;

  const targetLocale: Locale = currentLocale === 'fr' ? 'en' : 'fr';

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

  const href = withQuery(redirectedPathName(targetLocale), searchParams);
  const ariaLabel = SWITCH_TITLE[targetLocale][currentLocale];

  return (
    <ul className={listClassName}>
      <li className="shrink-0">
        <Link
          data-testid="locale-switch"
          className={cvHeaderLocaleSwitchBtn}
          href={href}
          hrefLang={targetLocale}
          title={ariaLabel}
          aria-label={ariaLabel}
          onClick={() => onNavigate?.()}
        >
          <span className="block h-4 w-4 overflow-hidden rounded-sm md:h-5 md:w-5">
            <LocaleTargetFlag locale={targetLocale} />
          </span>
        </Link>
      </li>
    </ul>
  );
}
