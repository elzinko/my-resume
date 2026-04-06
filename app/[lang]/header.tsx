import HeaderToolbar from '@/components/HeaderToolbar';
import HeaderContent from '@/components/HeaderContent';
import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function Header({
  locale,
  headerRoleOverride,
}: {
  locale: Locale;
  /** Surcharge du titre sous le nom (pages offre dynamiques / match). */
  headerRoleOverride?: string;
}) {
  const data: any = await getCvData(locale);
  const role =
    headerRoleOverride?.trim() || data?.header?.role || '';
  return (
    <header className="relative z-[70] print:mb-2">
      <div className="print:hidden">
        <HeaderToolbar />
      </div>

      <HeaderContent name={data?.header?.name} role={role} />
    </header>
  );
}
