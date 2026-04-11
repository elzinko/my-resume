'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cvHeaderModeBtn } from '@/lib/cv-header-toolbar';
import {
  fullHrefFromShortPath,
  shortHrefFromOfferPath,
} from '@/lib/cv-mode-nav';
import { stripBasePath } from '@/lib/cv-path-utils';
import { i18n, type Locale } from 'i18n-config';

interface CvModeToggleProps {
  labels?: {
    full: string;
    compact: string;
  };
  onNavigate?: () => void;
}

export default function CvModeToggle({
  labels = { full: 'Version complète', compact: 'Version courte' },
  onNavigate,
}: CvModeToggleProps) {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const pathForLogic = stripBasePath(pathname, basePath);

  const segments = pathForLogic.split('/');
  const maybeLocale = segments[1];
  const lang: Locale =
    maybeLocale && i18n.locales.includes(maybeLocale as Locale)
      ? (maybeLocale as Locale)
      : i18n.defaultLocale;

  const isShortMode = pathForLogic.includes('/short');

  const sp = new URLSearchParams(searchParams.toString());
  const targetUrl = isShortMode
    ? fullHrefFromShortPath(lang, sp)
    : shortHrefFromOfferPath(pathForLogic, lang, sp);

  const label = isShortMode ? labels.full : labels.compact;

  return (
    <Link
      href={targetUrl}
      className={`${cvHeaderModeBtn} print:hidden`}
      title={label}
      onClick={() => onNavigate?.()}
    >
      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 md:h-5 md:w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        {!isShortMode ? (
          // Document icon for compact mode
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        ) : (
          // Grid icon for full view
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        )}
      </svg>
      {/* Label hidden on mobile, visible on desktop */}
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}
