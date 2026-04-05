import HeaderToolbar from '@/components/HeaderToolbar';
import HeaderContent from '@/components/HeaderContent';
import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function Header({ locale }: { locale: Locale }) {
  const data: any = await getCvData(locale);
  return (
    <header className="relative z-[70] print:mb-2">
      <div className="print:hidden">
        <HeaderToolbar />
      </div>

      <HeaderContent name={data?.header?.name} role={data?.header?.role} />
    </header>
  );
}
