import Project from '@/components/project';
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
  /** `false` : pas d’id (doublon mobile / bas de page). */
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
  return (
    <>
      <section
        id={sectionId === false ? undefined : sectionId}
        data-cv-section="projects"
        className={className ? className : 'mt-10'}
      >
        <h2 className="border-b pb-1 text-2xl font-semibold text-cv-tag-text">
          {data?.projectsTitle?.title ?? 'Projects'}
        </h2>
        <ul className="cv-section-simple-list">
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
