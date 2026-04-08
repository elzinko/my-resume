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

export type ProjectVariant = 'default' | 'inline';

export default function project({
  project: projectData,
  variant = 'default',
}: {
  project: any;
  variant?: ProjectVariant;
}) {
  const dates = formatDates(projectData.startDate, projectData.endDate);
  const id: any = 'project-' + projectData?.id;
  const name = projectPrimaryLabel(projectData);
  const client = projectData.client
    ? capitalizeFirstLetter(projectData.client)
    : '';
  const location = projectData.location
    ? capitalizeFirstLetter(projectData.location)
    : '';

  const titleParts = [name, client || null, location || null].filter(Boolean);
  const titleText = titleParts.join(' — ');

  if (variant === 'inline') {
    const linkClass =
      'text-cv-tag-text underline-offset-2 hover:underline print:!text-cv-tag-text';
    const body = projectData.link ? (
      <a href={projectData.link} className={linkClass}>
        {titleText}
      </a>
    ) : (
      <span className="text-cv-tag-text print:!text-cv-tag-text">
        {titleText}
      </span>
    );
    return (
      <span className="inline text-sm leading-snug md:text-base">
        {body}
        {dates ? (
          <span className="ml-1 tabular-nums leading-snug text-cv-tag-text print:text-xs">
            ({dates})
          </span>
        ) : null}
      </span>
    );
  }

  return (
    <section id={id}>
      <div className="cv-row-with-side-meta">
        <span className="min-w-0 flex-1 text-base font-normal leading-snug text-cv-tag-text print:text-sm">
          <a href={projectData.link ? projectData.link : '#'}>
            {name}
            {projectData.client ? <span> - </span> : null}
            {projectData.client ? client : null}
            {projectData.location ? <span> - </span> : null}
            {projectData.location ? location : null}
          </a>
        </span>
        {dates ? (
          <span className="min-w-max shrink-0 self-end text-cv-meta font-normal tabular-nums leading-snug text-cv-tag-text print:text-xs">
            {dates}
          </span>
        ) : null}
      </div>
    </section>
  );
}
