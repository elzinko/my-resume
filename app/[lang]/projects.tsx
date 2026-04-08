import Project from '@/components/project';
import { getCvData } from '@/lib/cv-data';
import {
  byEndThenStart,
  sortChronologicalDesc,
} from '@/lib/sort-chronological';
import { Locale } from 'i18n-config';
import React, { Fragment } from 'react';

export default async function projects({
  locale,
  sectionId = 'projects',
  className = '',
  condensed = false,
}: {
  locale: Locale;
  sectionId?: string | false;
  className?: string;
  /** `true` : une ligne avec séparateurs / (comme Learnings). */
  condensed?: boolean;
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
        className={sectionClass}
      >
        <h2 className="border-b pb-1 text-2xl font-semibold text-cv-tag-text">
          {data?.projectsTitle?.title ?? 'Projects'}
        </h2>
        {condensed ? (
          <div className="cv-section-condensed-inline flex flex-wrap items-baseline gap-x-0.5 text-sm leading-relaxed text-cv-tag-text md:text-base">
            {projectsOrdered.map((project: any, i: number) => (
              <Fragment key={project.id}>
                {i > 0 ? (
                  <span
                    className="mx-1 text-blue-400/80 print:text-blue-300/85"
                    aria-hidden
                  >
                    /
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
