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
  /** Masquer le lien Malt (ex. offre CDI). */
  hideMalt?: boolean;
  /** Alignement du bloc titre (défaut `left`). `?headerAlign=right` pour aligner à droite. */
  align?: 'left' | 'right';
  /** Photo de profil (placée à l'opposé du titre). Absente = pas d'avatar. */
  photoUrl?: string;
  /** Texte d'âge déjà localisé (ex. « 46 ans »). Affiché par défaut. */
  ageText?: string;
}

export default function ShortPageWrapper({
  children,
  lang,
  headerName,
  headerRole,
  hideMalt,
  align,
  photoUrl,
  ageText,
}: ShortPageWrapperProps) {
  return (
    <>
      <header className="relative z-[70] print:mb-1">
        <div className="print:hidden">
          <HeaderToolbar shortLang={lang} hideMalt={hideMalt} />
        </div>
        <HeaderContent
          name={headerName}
          role={headerRole}
          compactPrint
          align={align}
          photoUrl={photoUrl}
          ageText={ageText}
        />
      </header>
      {children}
    </>
  );
}
