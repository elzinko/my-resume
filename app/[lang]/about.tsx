import { getCvData } from '@/lib/cv-data';
import SectionHeadingAts from '@/components/SectionHeadingAts';
import { resolveAboutText, type CvMode } from '@/lib/cv-contract-text';
import type { ContractType } from '@/data/offers/types';
import type { EducationLevelContent } from '@/lib/education-level-content';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function About({
  locale,
  educationLevel,
  contract,
  mode,
}: {
  locale: Locale;
  educationLevel: EducationLevelContent;
  contract?: ContractType;
  mode?: CvMode;
}) {
  const data: any = await getCvData(locale);

  return (
    <section
      id="about"
      className="mb-1 mt-4 pb-1 print-preview:order-[10] print:order-[10] max-md:!mt-0"
    >
      <SectionHeadingAts
        section="about"
        locale={locale}
        title={data?.about?.title}
        accent="blue"
        className="min-w-0"
      />
      <p className="cv-job-description mt-4 text-left">
        {resolveAboutText(data?.about, contract, mode)}
      </p>
    </section>
  );
}
