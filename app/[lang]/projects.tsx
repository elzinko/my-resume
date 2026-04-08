import Project from '@/components/project';
import { getCvData } from '@/lib/cv-data';
import {
  byEndThenStart,
  sortChronologicalDesc,
} from '@/lib/sort-chronological';
import { Locale } from 'i18n-config';
import React, { Fragment } from 'react';

export type ProjectsContentLayout = 'list' | 'inline';

export default async function projects({
  locale,
  sectionId = 'projects',
  className = '',
  contentLayout = 'list',
}: {
  locale: Locale;
  sectionId?: string | false;
  className?: string;
  /** `inline` : une ligne avec tirets (colonne latérale dense). */
  contentLayout?: ProjectsContentLayout;
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
      ? `${className} print:order-[90]`
      : 'mt-10 print:order-[90]';

  return (
    <>
      <section
        id={sectionId === false ? undefined : sectionId}
        data-cv-section="projects"
        className={sectionClass}
      >
        <h2 className="border-b pb-1 text-2xl font-semibold text-cv-tag-text">
          {data?.projectsTitle?.title ?? 'Projects'}
        </h2>
        {contentLayout === 'inline' ? (
          <div className="mt-4 flex flex-wrap items-baseline gap-x-1 gap-y-1 print:mt-2 md:mt-4">
            {projectsOrdered.map((project: any, i: number) => (
              <Fragment key={project.id}>
                {i > 0 ? (
                  <span
                    className="text-cv-tag-text/40 print:text-cv-tag-text/50"
                    aria-hidden
                  >
                    ·
                  </span>
                ) : null}
                <Project project={project} variant="inline" />
              </Fragment>
            ))}
          </div>
        ) : (
          <ul className="cv-section-simple-list">
            {projectsOrdered.map((project: any) => (
              <li key={project.id}>
                <Project project={project} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
