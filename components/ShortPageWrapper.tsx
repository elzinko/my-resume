'use client';

import HeaderContent from './HeaderContent';
import HeaderToolbar from './HeaderToolbar';
import ScaledA4 from './ScaledA4';
import type { Locale } from 'i18n-config';
import { ReactNode, Suspense } from 'react';

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
  // Document A4 = en-tête (nom/photo) + contenu. Mis à l'échelle ensemble par
  // ScaledA4 (WYSIWYG). La barre d'outils reste HORS du scale (UI, jamais zoomée).
  const doc = (
    <div className="cv-short-page">
      <header className="print:mb-1">
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
    </div>
  );

  return (
    <>
      <div className="relative z-[70] print:hidden">
        <HeaderToolbar shortLang={lang} hideMalt={hideMalt} />
      </div>
      <Suspense fallback={<div className="mx-auto max-w-[800px]">{doc}</div>}>
        <ScaledA4>{doc}</ScaledA4>
      </Suspense>
    </>
  );
}
