import HeaderToolbar from '@/components/HeaderToolbar';
import HeaderContent from '@/components/HeaderContent';
import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function Header({ locale }: { locale: Locale }) {
  const data: any = await getCvData(locale);
  const ui = data?.ui ?? {};
  const labels = {
    menu: ui.menu ?? 'Menu',
    menuClose: ui.menuClose ?? 'Close menu',
    versionFull: ui.versionFull ?? 'Full version',
    versionCompact: ui.versionCompact ?? 'Compact version',
  };
  return (
    <header className="relative z-[70] print:mb-2">
      <div className="print:hidden">
        <HeaderToolbar labels={labels} />
      </div>

      <HeaderContent name={data?.header?.name} role={data?.header?.role} />
    </header>
  );
}
