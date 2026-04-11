import { getCvData } from '@/lib/cv-data';
import { resolveAboutText } from '@/lib/cv-contract-text';
import type { ContractType } from '@/data/offers/types';
import type { EducationLevelContent } from '@/lib/education-level-content';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function About({
  locale,
  educationLevel,
  contract,
}: {
  locale: Locale;
  educationLevel: EducationLevelContent;
  contract?: ContractType;
}) {
  const data: any = await getCvData(locale);

  return (
    <section
      id="about"
      className="mt-4 pb-1 mb-1 max-md:!mt-0 print:order-[10] print-preview:order-[10]"
    >
      <div className="border-b pb-1">
        <h2 className="min-w-0 text-2xl font-semibold text-cv-section">
          {data?.about?.title}
        </h2>
      </div>
      <p className="mt-4 text-cv-body-muted">
        {resolveAboutText(data?.about, contract)}
      </p>
    </section>
  );
}
