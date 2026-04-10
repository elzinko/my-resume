'use client';

import HeaderContent from './HeaderContent';
import HeaderToolbar from './HeaderToolbar';
import type { Locale } from 'i18n-config';
import { ReactNode } from 'react';

interface ShortPageWrapperProps {
  children: ReactNode;
  lang: string;
  headerName: string;
  headerRole: string;
  /** `SHORT_CV_OFFER_ID` — lien « Version complète » cohérent sans `?offer=`. */
  defaultOfferId?: string | null;
  /** Masquer le lien Malt (ex. offre CDI). */
  hideMalt?: boolean;
}

export default function ShortPageWrapper({
  children,
  lang,
  headerName,
  headerRole,
  defaultOfferId = null,
  hideMalt,
}: ShortPageWrapperProps) {
  return (
    <>
      <header className="relative z-[70] print:mb-1">
        <div className="print:hidden">
          <HeaderToolbar
            shortLang={lang}
            shortDefaultOfferId={defaultOfferId}
            hideMalt={hideMalt}
          />
        </div>
        <HeaderContent
          name={headerName}
          role={headerRole}
          compactPrint
        />
      </header>
      {children}
    </>
  );
}
