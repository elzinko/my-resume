'use client';

import { ReactNode, Suspense } from 'react';
import HeaderToolbar from './HeaderToolbar';
import HeaderContent from './HeaderContent';
import ShortHeaderJobFitPills from './ShortHeaderJobFitPills';
import type { Locale } from 'i18n-config';

interface ShortPageWrapperProps {
  children: ReactNode;
  lang: string;
  headerName: string;
  headerRole: string;
  /** Aligné sur `SHORT_CV_OFFER_ID` / `?offer=` — pastilles adéquation sous le rôle. */
  defaultOfferId?: string | null;
}

export default function ShortPageWrapper({
  children,
  lang,
  headerName,
  headerRole,
  defaultOfferId = null,
}: ShortPageWrapperProps) {
  const locale = lang as Locale;

  return (
    <>
      <header className="relative z-[70] print:mb-1">
        <div className="print:hidden">
          <HeaderToolbar shortLang={lang} />
        </div>
        <HeaderContent
          name={headerName}
          role={headerRole}
          compactPrint
          belowRole={
            <Suspense fallback={null}>
              <ShortHeaderJobFitPills
                lang={locale}
                defaultOfferId={defaultOfferId}
              />
            </Suspense>
          }
        />
      </header>
      {children}
    </>
  );
}
