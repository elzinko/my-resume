'use client';

import HeaderContent from './HeaderContent';
import HeaderDesktopContactStrip from './HeaderDesktopContactStrip';
import HeaderToolbar from './HeaderToolbar';
import type { Locale } from 'i18n-config';
import { ReactNode } from 'react';

interface ShortPageWrapperProps {
  children: ReactNode;
  lang: string;
  headerName: string;
  headerRole: string;
  /** Coordonnées sous le rôle en PDF / aperçu `?print` (colonne Contact masquée). */
  headerContact?: {
    email: string;
    phone: string;
    location: string;
  };
  /** `SHORT_CV_OFFER_ID` — lien « Version complète » cohérent sans `?offer=`. */
  defaultOfferId?: string | null;
  /** Pastilles adéquation sous le rôle : à envelopper en `<Suspense>` côté page serveur si besoin de `useSearchParams`. */
  belowRole?: ReactNode;
}

export default function ShortPageWrapper({
  children,
  lang,
  headerName,
  headerRole,
  headerContact,
  defaultOfferId = null,
  belowRole,
}: ShortPageWrapperProps) {
  const locale = lang as Locale;

  return (
    <>
      <header className="relative z-[70] print:mb-1">
        <div className="print:hidden">
          <HeaderToolbar
            shortLang={lang}
            shortDefaultOfferId={defaultOfferId}
          />
        </div>
        <HeaderContent
          name={headerName}
          role={headerRole}
          compactPrint
          afterRole={
            headerContact ? (
              <div className="hidden w-full print-preview:block print:block">
                <HeaderDesktopContactStrip
                  email={headerContact.email}
                  phone={headerContact.phone}
                  location={headerContact.location}
                  locale={locale}
                />
              </div>
            ) : undefined
          }
          belowRole={belowRole}
        />
      </header>
      {children}
    </>
  );
}
