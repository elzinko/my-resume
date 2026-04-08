'use client';

import React from 'react';
import formatDates from '@/lib/date';
import { capitalizeFirstLetter } from '@/lib/capitalize-first';

function projectPrimaryLabel(project: {
  title?: string | null;
  name?: string | null;
}): string | null {
  const title = typeof project.title === 'string' ? project.title.trim() : '';
  if (title) return title;
  const name = project.name?.trim();
  if (!name) return null;
  return capitalizeFirstLetter(name);
}

export default function project({ project: projectData }: { project: any }) {
  const dates = formatDates(projectData.startDate, projectData.endDate);
  const id: string = 'project-' + projectData?.id;
  const name = projectPrimaryLabel(projectData);
  const client = projectData.client
    ? capitalizeFirstLetter(projectData.client)
    : '';
  const location = projectData.location
    ? capitalizeFirstLetter(projectData.location)
    : '';

  const titleParts = [name, client || null, location || null].filter(Boolean);
  const titleText = titleParts.join(' — ');

  const description =
    typeof projectData.description === 'string'
      ? projectData.description.trim()
      : '';
  const hasDesc = description.length > 0;

  const href = projectData.link || '#';

  const titleInner = (
    <>
      {name}
      {projectData.client ? <span> - </span> : null}
      {projectData.client ? client : null}
      {projectData.location ? <span> - </span> : null}
      {projectData.location ? location : null}
    </>
  );

  const titleEl = projectData.link ? (
    <a
      href={href}
      className="text-base font-normal leading-snug text-cv-tag-text underline-offset-2 hover:underline print:text-sm"
    >
      {titleInner}
    </a>
  ) : (
    <span className="text-base font-normal leading-snug text-cv-tag-text print:text-sm">
      {titleInner}
    </span>
  );

  const printLinkClass =
    'text-cv-tag-text underline-offset-2 print:!text-cv-tag-text';

  const printBody = projectData.link ? (
    <a href={href} className={printLinkClass}>
      {titleText}
    </a>
  ) : (
    <span className="text-cv-tag-text print:!text-cv-tag-text">{titleText}</span>
  );

  return (
    <>
      <div
        id={id}
        className={`cv-project-screen cv-project-row${hasDesc ? '' : ' cv-project-row--no-desc'}`}
      >
        <div className="cv-project-title-area">{titleEl}</div>
        {hasDesc ? (
          <p className="cv-project-desc-area cv-study-meta">{description}</p>
        ) : null}
        {dates ? (
          <span className="cv-project-date-area min-w-max shrink-0 text-sm font-normal tabular-nums leading-snug text-cv-tag-text print:text-xs">
            {dates}
          </span>
        ) : null}
      </div>
      <span
        className="cv-project-print hidden text-sm leading-snug text-cv-tag-text print:inline print:text-xs md:text-base"
        aria-hidden="true"
      >
        {printBody}
        {dates ? (
          <span className="ml-1 tabular-nums text-cv-tag-text print:text-xs">
            ({dates})
          </span>
        ) : null}
      </span>
    </>
  );
}
