import Job from '@/components/Job';
import ExperienceClosingBlock from '@/components/ExperienceClosingBlock';
import SectionHeadingAts from '@/components/SectionHeadingAts';
import { getCvData } from '@/lib/cv-data';
import type { CvMode } from '@/lib/cv-contract-text';
import {
  formatRemainingClientsRecapForFullCv,
  getExperienceClosingLabels,
} from '@/lib/cv-experience-footer';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function jobs({
  locale,
  mode,
}: {
  locale: Locale;
  mode?: CvMode;
}) {
  const data: any = await getCvData(locale);
  const jobsList = data?.allJobsModels || [];
  const visibleJobs = jobsList.filter(
    (j: { display?: boolean; displayMode?: string }) => {
      if (j.display === false) return false;
      if (j.displayMode && j.displayMode !== mode) return false;
      return true;
    },
  );
  const closing = getExperienceClosingLabels(locale);
  const recapLine = formatRemainingClientsRecapForFullCv(visibleJobs, locale);

  return (
    <div className="cv-print-jobs-group print-preview:order-[90] print:order-[90]">
      <section
        id="jobs"
        className="mt-10 break-before-page max-md:mt-0 print:break-before-auto"
      >
        <SectionHeadingAts
          section="jobs"
          locale={locale}
          title={data?.jobsTitle?.title}
          className="border-b pb-1 text-2xl font-semibold text-cv-jobs print:break-after-avoid"
        />
        <ul className="cv-section-body-gap space-y-4 print:space-y-4">
          {visibleJobs.map((job: any, index: number) => (
            <li key={job.client + index}>
              <Job
                job={job}
                locale={locale}
                presentLabel={locale === 'en' ? 'Present' : 'Présent'}
              />
            </li>
          ))}
        </ul>
        {visibleJobs.length > 0 ? (
          <ExperienceClosingBlock
            moreExperience={closing.moreExperience}
            moreExperienceTail={closing.moreExperienceTail}
            moreClientsLine={recapLine}
          />
        ) : null}
      </section>
    </div>
  );
}
