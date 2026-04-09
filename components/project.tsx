'use client';

import React from 'react';
import formatDates from '@/lib/date';
import { capitalizeFirstLetter } from '@/lib/capitalize-first';

function formatProjectYear(start?: string, end?: string): string | null {
  const sy = start ? new Date(start).getFullYear() : null;
  const ey = end ? new Date(end).getFullYear() : null;
  if (sy && ey) return sy === ey ? `${sy}` : `${sy} - ${ey}`;
  return ey ? `${ey}` : sy ? `${sy}` : null;
}

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

export default function project({
  project: projectData,
  yearOnly = false,
  hideDatesPrint = false,
  compact = false,
}: {
  project: any;
  /** Afficher uniquement l'année (ex. « 2021 ») au lieu de MM/YYYY - MM/YYYY. */
  yearOnly?: boolean;
  /** Masquer les dates à l'impression (print + print-preview). */
  hideDatesPrint?: boolean;
  /** Taille réduite (même typo que Studies compact). */
  compact?: boolean;
}) {
  const fullDates = formatDates(projectData.startDate, projectData.endDate);
  const dates = yearOnly
    ? formatProjectYear(projectData.startDate, projectData.endDate)
    : fullDates;
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

  const href = projectData.link || '#';

  /* ------------------------------------------------------------------ */
  /*  Compact : même markup que StudyDisplay compact (flex titre + date) */
  /* ------------------------------------------------------------------ */
  if (compact) {
    const compactTitle = projectData.link ? (
      <a
        href={href}
        className="cv-study-title-compact min-w-0 flex-1 text-cv-tag-text underline-offset-2 hover:underline print:!text-cv-tag-text"
      >
        {name}
      </a>
    ) : (
      <span className="cv-study-title-compact min-w-0 flex-1 text-cv-tag-text print:!text-cv-tag-text">
        {name}
      </span>
    );

    return (
      <div id={id} className="cv-row-study-title-year">
        {compactTitle}
        {dates && (
          <span className="cv-study-year-compact min-w-max shrink-0 whitespace-nowrap text-cv-tag-text print:!text-cv-tag-text">
            {dates}
          </span>
        )}
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Default : grille titre / description / dates (CV complet)          */
  /* ------------------------------------------------------------------ */
  const description =
    typeof projectData.description === 'string'
      ? projectData.description.trim()
      : '';
  const hasDesc = description.length > 0;

  const titleInner = (
    <>
      {name}
      {projectData.client ? <span> - </span> : null}
      {projectData.client ? client : null}
      {projectData.location ? <span> - </span> : null}
      {projectData.location ? location : null}
    </>
  );

  const titleTypo = 'text-base font-normal leading-snug text-cv-tag-text print:text-sm';

  const titleEl = projectData.link ? (
    <a
      href={href}
      className={`${titleTypo} underline-offset-2 hover:underline`}
    >
      {titleInner}
    </a>
  ) : (
    <span className={titleTypo}>
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
          <span className={`cv-project-date-area min-w-max shrink-0 text-sm font-normal tabular-nums leading-snug text-cv-tag-text print:text-xs${hideDatesPrint ? ' print:hidden print-preview:hidden' : ''}`}>
            {dates}
          </span>
        ) : null}
      </div>
      <span
        className="cv-project-print hidden text-sm leading-snug text-cv-tag-text print:inline print:text-xs md:text-base"
        aria-hidden="true"
      >
        {printBody}
        {dates && !hideDatesPrint ? (
          <span className="ml-1 tabular-nums text-cv-tag-text print:text-xs">
            ({dates})
          </span>
        ) : null}
      </span>
    </>
  );
}
