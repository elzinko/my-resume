import Job from '@/components/job';
import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function jobs({ locale }: { locale: Locale }) {
  const data: any = await getCvData(locale);
  return (
    <>
      <section id="jobs" className="mt-10 break-before-page">
        <h2 className="border-b pb-1 text-2xl font-semibold text-cv-jobs">
          {data?.jobsTitle?.title}
        </h2>
        <ul className="mt-4 space-y-4 print:space-y-4">
          {data?.allJobsModels?.map((job: any, index: number) => (
            <li key={job.client + index}>
              <Job job={job} locale={locale} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
