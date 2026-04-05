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

export default function project({ project }: any) {
  const dates = formatDates(project.startDate, project.endDate);
  const id: any = 'project-' + project?.id;
  const name = projectPrimaryLabel(project);
  const client = project.client ? capitalizeFirstLetter(project.client) : '';
  const location = project.location
    ? capitalizeFirstLetter(project.location)
    : '';

  return (
    <section id={id}>
      <div className="cv-row-with-side-meta">
        <span className="min-w-0 flex-1 text-base font-normal leading-snug text-cv-tag-text print:text-sm">
          <a href={project.link ? project.link : '#'}>
            {name}
            {project.client ? <span> - </span> : null}
            {project.client ? client : null}
            {project.location ? <span> - </span> : null}
            {project.location ? location : null}
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
