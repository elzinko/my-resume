import Project from '@/components/Project';
import SectionHeadingAts from '@/components/SectionHeadingAts';
import { getCvData } from '@/lib/cv-data';
import type { CvMode } from '@/lib/cv-contract-text';
import {
  byEndThenStart,
  sortChronologicalDesc,
} from '@/lib/sort-chronological';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function projects({
  locale,
  sectionId = 'projects',
  className = '',
  mode,
}: {
  locale: Locale;
  sectionId?: string | false;
  className?: string;
  mode?: CvMode;
}) {
  const data: any = await getCvData(locale);
  const visibleProjects = (data?.allProjectsModels || []).filter(
    (p: { display?: boolean; displayMode?: string }) => {
      if (p.display === false) return false;
      if (p.displayMode && p.displayMode !== mode) return false;
      return true;
    },
  );
  const projectsOrdered = sortChronologicalDesc(
    visibleProjects,
    byEndThenStart,
  );

  const sectionClass =
    className && className.length > 0
      ? `${className} print:order-[100] print-preview:order-[100]`
      : 'mt-10 print:order-[100] print-preview:order-[100]';

  return (
    <>
      <section
        id={sectionId === false ? undefined : sectionId}
        data-cv-section="projects"
        className={`cv-cq-section ${sectionClass}`}
      >
        <SectionHeadingAts
          section="projects"
          locale={locale}
          title={data?.projectsTitle?.title ?? 'Projects'}
          className="border-b border-cv-tag-text/50 pb-1 text-2xl font-semibold text-cv-tag-text"
        />
        <ul className="cv-section-simple-list cv-cq-project-list max-md:mt-6">
          {projectsOrdered.map((project: any) => (
            <li key={project.id}>
              <Project project={project} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
