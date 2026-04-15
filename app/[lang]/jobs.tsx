import Job from '@/components/Job';
import ExperienceClosingBlock from '@/components/ExperienceClosingBlock';
import { getCvData } from '@/lib/cv-data';
import {
  formatRemainingClientsRecapForFullCv,
  getExperienceClosingLabels,
} from '@/lib/cv-experience-footer';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function jobs({ locale }: { locale: Locale }) {
  const data: any = await getCvData(locale);
  const jobsList = data?.allJobsModels || [];
  const visibleJobs = jobsList.filter(
    (j: { display?: boolean }) => j.display !== false,
  );
  const closing = getExperienceClosingLabels(locale);
  const recapLine = formatRemainingClientsRecapForFullCv(visibleJobs, locale);

  return (
    <div className="cv-print-jobs-group print-preview:order-[90] print:order-[90]">
      <section
        id="jobs"
        className="mt-10 break-before-page print:break-before-auto max-md:mt-0"
      >
        <h2 className="border-b pb-1 text-2xl font-semibold text-cv-jobs print:break-after-avoid">
          {data?.jobsTitle?.title}
        </h2>
        <ul className="cv-section-body-gap space-y-4 print:space-y-4">
          {visibleJobs.map((job: any, index: number) => (
            <li key={job.client + index}>
              <Job job={job} locale={locale} />
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
