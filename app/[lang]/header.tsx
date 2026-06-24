import HeaderToolbar from '@/components/HeaderToolbar';
import HeaderContent from '@/components/HeaderContent';
import { getCvData } from '@/lib/cv-data';
import { computeAge } from '@/lib/date';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function Header({
  locale,
  offerPrintContactStrip,
  hideMalt,
  subtitleOverride,
  showPhoto = false,
  showAge = false,
}: {
  locale: Locale;
  /** Pages offre : bandeau coordonnées sous le rôle uniquement en aperçu `?print`. */
  offerPrintContactStrip?: {
    email: string;
    phone: string;
    location: string;
  };
  hideMalt?: boolean;
  /** Surcharge du sous-titre (rôle) via paramètre URL. */
  subtitleOverride?: string;
  /** Afficher la photo de profil (param `?photo=1`). */
  showPhoto?: boolean;
  /** Afficher l'âge sous le rôle (par défaut oui ; `?age=0` pour masquer). */
  showAge?: boolean;
}) {
  const data: any = await getCvData(locale);

  const photoUrl =
    showPhoto && typeof data?.header?.photo === 'string'
      ? (data.header.photo as string)
      : undefined;

  const birthDate =
    typeof data?.header?.birthDate === 'string'
      ? (data.header.birthDate as string)
      : undefined;
  const age = showAge && birthDate ? computeAge(birthDate) : null;
  const ageText =
    age != null
      ? locale === 'en'
        ? `${age} years old`
        : `${age} ans`
      : undefined;

  return (
    <header className="relative z-[70] print:mb-2">
      <div className="print:hidden">
        <HeaderToolbar hideMalt={hideMalt} />
      </div>

      <HeaderContent
        name={data?.header?.name}
        role={subtitleOverride || data?.header?.role}
        photoUrl={photoUrl}
        ageText={ageText}
      />
    </header>
  );
}
