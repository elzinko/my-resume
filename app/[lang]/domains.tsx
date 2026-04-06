import Domain from '@/components/domain';
import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function domains({ locale }: { locale: Locale }) {
  const data: any = await getCvData(locale);
  return (
    <section id="domains" className="mt-3 md:mt-10">
      <div className="flex w-full flex-col gap-2 md:flex-row md:gap-0 md:space-x-6">
        {data?.allDomainsModels?.map((domain: any) => (
          <Domain key={domain.id} domain={domain} />
        ))}
      </div>
    </section>
  );
}
