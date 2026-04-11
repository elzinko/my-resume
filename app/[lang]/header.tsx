import HeaderToolbar from '@/components/HeaderToolbar';
import HeaderContent from '@/components/HeaderContent';
import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function Header({
  locale,
  offerPrintContactStrip,
  hideMalt,
}: {
  locale: Locale;
  /** Pages offre : bandeau coordonnées sous le rôle uniquement en aperçu `?print`. */
  offerPrintContactStrip?: {
    email: string;
    phone: string;
    location: string;
  };
  hideMalt?: boolean;
}) {
  const data: any = await getCvData(locale);

  return (
    <header className="relative z-[70] print:mb-2">
      <div className="print:hidden">
        <HeaderToolbar hideMalt={hideMalt} />
      </div>

      <HeaderContent
        name={data?.header?.name}
        role={data?.header?.role}
      />
    </header>
  );
}
