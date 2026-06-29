import Job from '@/components/Job';
import ExperienceClosingBlock from '@/components/ExperienceClosingBlock';
import ExperienceSection from '@/components/ExperienceSection';
import { getCvData } from '@/lib/cv-data';
import type { CvMode } from '@/lib/cv-contract-text';
import {
  formatFoldedClientsRecap,
  getExperienceClosingLabels,
} from '@/lib/cv-experience-footer';
import { DEFAULT_DETAIL_LEVEL, type DetailLevel } from '@/lib/cv-detail-level';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function jobs({
  locale,
  mode,
  detailLevel = DEFAULT_DETAIL_LEVEL,
  maxJobShown = null,
}: {
  locale: Locale;
  mode?: CvMode;
  detailLevel?: DetailLevel;
  /** Pagination : N postes affichés en entrée ; au-delà → plié au footer (`?maxJobShown=N`). */
  maxJobShown?: number | null;
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
  // Missions citées dans le récap « missions plus anciennes » SANS entrée détaillée :
  //  - les missions visibles pliées au-delà de `?maxJobShown=N` ;
  //  - les missions `display:false` (volontairement hors liste) mais à créditer,
  //    pertinentes pour le mode courant.
  const shownJobs =
    maxJobShown != null ? visibleJobs.slice(0, maxJobShown) : visibleJobs;
  const hiddenRecapJobs = jobsList.filter(
    (j: { display?: boolean; displayMode?: string }) =>
      j.display === false && (!j.displayMode || j.displayMode === mode),
  );
  const foldedJobs = [
    ...(maxJobShown != null ? visibleJobs.slice(maxJobShown) : []),
    ...hiddenRecapJobs,
  ];
  const closing = getExperienceClosingLabels(locale);
  const recapLine = formatFoldedClientsRecap(foldedJobs, locale);

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
          {shownJobs.map((job: any, index: number) => (
            <li key={job.client + index} className="print:break-inside-avoid">
              <Job
                job={job}
                locale={locale}
                detailLevel={detailLevel}
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
