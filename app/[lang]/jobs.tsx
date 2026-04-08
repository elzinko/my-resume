import Job from '@/components/job';
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
  const closing = getExperienceClosingLabels(locale);
  const recapLine = formatRemainingClientsRecapForFullCv(jobsList, locale);

  return (
    <div className="cv-print-jobs-group print:order-[70]">
      <section
        id="jobs"
        className="mt-10 break-before-page print:break-before-auto"
      >
        <h2 className="border-b pb-1 text-2xl font-semibold text-cv-jobs">
          {data?.jobsTitle?.title}
        </h2>
        <ul className="mt-4 space-y-4 print:space-y-4">
          {jobsList.map((job: any, index: number) => (
            <li key={job.client + index}>
              <Job job={job} locale={locale} />
            </li>
          ))}
        </ul>
        {jobsList.length > 0 ? (
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
