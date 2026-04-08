import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function About({ locale }: { locale: Locale }) {
  const data: any = await getCvData(locale);
  return (
    <section
      id="about"
      className="cv-mobile-section-mt max-md:!mt-0 print:order-[10] print-preview:order-[10]"
    >
      <h2 className="border-b pb-1 text-2xl font-semibold text-cv-section">
        {data?.about?.title}
      </h2>
      <p className="cv-about-domain-print-body mt-2 text-sm leading-snug text-cv-body-muted md:mt-4 md:text-base md:leading-normal">
        {data?.about?.text}
      </p>
    </section>
  );
}
