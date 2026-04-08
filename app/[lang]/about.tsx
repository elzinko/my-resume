import ProfileEducationBadge from '@/components/ProfileEducationBadge';
import { getCvData } from '@/lib/cv-data';
import {
  getProfileEducationBadgeLabel,
  type EducationLevelContent,
} from '@/lib/education-level-content';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function About({
  locale,
  educationLevel,
}: {
  locale: Locale;
  educationLevel: EducationLevelContent;
}) {
  const data: any = await getCvData(locale);
  const profileBadgeLabel = getProfileEducationBadgeLabel(educationLevel, locale);

  return (
    <section
      id="about"
      className="cv-mobile-section-mt max-md:!mt-0 print:order-[10] print-preview:order-[10]"
    >
      <div className="border-b pb-1">
        <h2 className="min-w-0 text-2xl font-semibold text-cv-section">
          {data?.about?.title}
        </h2>
      </div>
      <p className="cv-about-domain-print-body mt-2 text-sm leading-snug text-cv-body-muted md:mt-4 md:text-base md:leading-normal">
        {data?.about?.text}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-2 py-2 print:mt-2 print:flex-wrap print:py-1 md:mt-1.5 md:flex-wrap">
        <ProfileEducationBadge label={profileBadgeLabel} />
      </div>
    </section>
  );
}
