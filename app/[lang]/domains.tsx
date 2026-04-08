import Domain from '@/components/domain';
import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function domains({ locale }: { locale: Locale }) {
  const data: any = await getCvData(locale);
  return (
    <section
      id="domains"
      className="cv-mobile-section-mt max-md:!mt-0 print:order-[20]"
    >
      <div className="cv-domains-grid">
        {data?.allDomainsModels?.map((domain: any) => (
          <Domain key={domain.id} domain={domain} />
        ))}
      </div>
    </section>
  );
}
