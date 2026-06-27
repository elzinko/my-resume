import Job from '@/components/Job';
import ExperienceClosingBlock from '@/components/ExperienceClosingBlock';
import ExperienceSection from '@/components/ExperienceSection';
import { getCvData } from '@/lib/cv-data';
import type { CvMode } from '@/lib/cv-contract-text';
import {
  formatRemainingClientsRecapForFullCv,
  getExperienceClosingLabels,
} from '@/lib/cv-experience-footer';
import {
  DEFAULT_DETAIL_LEVEL,
  jobDetailLevelAt,
  type DetailLevel,
} from '@/lib/cv-detail-level';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function jobs({
  locale,
  mode,
  detailLevel = DEFAULT_DETAIL_LEVEL,
  detailedJobs = null,
}: {
  locale: Locale;
  mode?: CvMode;
  detailLevel?: DetailLevel;
  /** Pagination : nb de postes en détail complet ; les suivants passent en bref. */
  detailedJobs?: number | null;
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
        // À l'impression : Expérience démarre TOUJOURS en page 2 (les coordonnées
        // ferment la page 1). `print:mt-0` → top uniforme via la marge @page.
        className="mt-10 break-before-page print:mt-0 print:break-before-page max-md:mt-0"
      >
        <ExperienceSection
          section="jobs"
          title={data?.jobsTitle?.title}
          locale={locale}
          canToggleDetails={detailLevel === 'full'}
        >
          {visibleJobs.map((job: any, index: number) => (
            <li key={job.client + index} className="print:break-inside-avoid">
              <Job
                job={job}
                locale={locale}
                detailLevel={jobDetailLevelAt(index, detailLevel, detailedJobs)}
                presentLabel={locale === 'en' ? 'Present' : 'Présent'}
              />
            </li>
          ))}
        </ExperienceSection>
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
