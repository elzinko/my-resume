import Project from '@/components/Project';
import { getCvData } from '@/lib/cv-data';
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
}: {
  locale: Locale;
  sectionId?: string | false;
  className?: string;
}) {
  const data: any = await getCvData(locale);
  const visibleProjects = (data?.allProjectsModels || []).filter(
    (p: { display?: boolean }) => p.display !== false,
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
        <h2 className="border-b pb-1 text-2xl font-semibold text-cv-tag-text">
          {data?.projectsTitle?.title ?? 'Projects'}
        </h2>
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
