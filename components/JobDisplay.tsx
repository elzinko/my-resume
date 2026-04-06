'use client';

import React from 'react';
import formatDates from '@/lib/date';
import JobFrameworkPills from './JobFrameworkPills';
import { slugifyClient } from '@/lib/slug';
import type { Locale } from 'i18n-config';

export interface JobData {
  id?: string;
  client: string;
  role?: { name: string } | string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  bullets?: Array<{ id: string; text: string }>;
  frameworks?: Array<{ id: string; name: string; link?: string }>;
}

/**
 * Mobile CV complet : poste en entier (retours à la ligne) ; dessous ville / dates
 * avec un seul « / », flex-wrap pour ne rien tronquer.
 */
function JobMetaMobileRow({
  roleName,
  location,
  datesLine,
}: {
  roleName?: string | null;
  location?: string;
  datesLine: string;
}) {
  return (
    <div
      className="mt-1 space-y-1 text-xs text-cv-meta font-normal leading-snug text-cv-jobs md:hidden print:hidden"
      data-testid="job-meta-mobile"
    >
      {roleName ? (
        <p
          className="w-full break-words text-end text-cv-jobs"
          data-job-meta="role"
        >
          {roleName}
        </p>
      ) : null}
      <div className="flex w-full flex-wrap items-baseline justify-end gap-x-2 gap-y-0.5">
        <span
          className="min-w-0 max-w-full break-words text-end"
          data-job-meta="location"
        >
          {location?.trim() ? location : '\u00a0'}
        </span>
        <span
          className="shrink-0 text-cv-jobs/45"
          data-job-meta="sep"
          aria-hidden
        >
          /
        </span>
        <span
          className="min-w-0 max-w-full whitespace-normal break-words text-end tabular-nums text-cv-jobs"
          data-job-meta="dates"
        >
          {datesLine}
        </span>
      </div>
    </div>
  );
}

/** CV court mobile : poste sur une ligne, lieu + dates en dessous (lisible vs grille 5 colonnes tronquées). */
function CompactJobMetaMobile({
  roleName,
  location,
  datesLine,
}: {
  roleName?: string | null;
  location?: string;
  datesLine: string;
}) {
  return (
    <div className="mt-1 space-y-1 md:hidden print:hidden">
      {roleName ? (
        <p className="text-xs font-semibold leading-snug text-cv-jobs">
          {roleName}
        </p>
      ) : null}
      <div className="flex flex-wrap items-baseline justify-end gap-x-2 gap-y-0.5 text-xs leading-snug text-cv-meta text-cv-jobs">
        <span className="min-w-0 max-w-full break-words text-end">
          {location?.trim() ? location : '\u00a0'}
        </span>
        <span className="shrink-0 text-cv-jobs/45" aria-hidden>
          /
        </span>
        <span className="min-w-0 max-w-full whitespace-normal break-words text-end tabular-nums">
          {datesLine}
        </span>
      </div>
    </div>
  );
}

interface JobDisplayProps {
  job: JobData;
  compact?: boolean;
  presentLabel?: string;
  locale?: Locale;
}

export default function JobDisplay({
  job,
  compact = false,
  presentLabel = 'Présent',
  locale = 'fr',
}: JobDisplayProps) {
  const dates = compact ? null : formatDates(job.startDate, job.endDate);
  const roleName = typeof job.role === 'string' ? job.role : job.role?.name;
  const frameworks = job.frameworks || [];
  const expandTechAria =
    locale === 'en'
      ? 'Show all technologies'
      : 'Afficher toutes les technologies';
  const collapseTechAria =
    locale === 'en'
      ? 'Show fewer technologies'
      : 'Réduire la liste des technologies';

  if (compact) {
    const compactDateLine = `${job.startDate} - ${job.endDate || presentLabel}`;
    return (
      <div>
        <div className="cv-row-with-side-meta">
          <span className="min-w-0 flex-1 text-sm font-bold leading-snug text-cv-jobs print:text-xs">
            {job.client}
          </span>
          <span className="min-w-max shrink-0 self-end text-cv-meta font-normal tabular-nums leading-snug text-cv-jobs print:text-[10px] max-md:hidden print:!inline">
            {compactDateLine}
          </span>
        </div>
        <CompactJobMetaMobile
          roleName={roleName}
          location={job.location}
          datesLine={compactDateLine}
        />
        <div className="cv-row-with-side-meta print:gap-1 max-md:hidden print:flex">
          <span className="min-w-0 flex-1 text-cv-meta font-normal leading-snug text-cv-jobs print:text-[10px]">
            {roleName ?? ''}
          </span>
          <span className="min-w-max shrink-0 self-end text-cv-meta leading-snug text-cv-jobs print:text-[10px]">
            {job.location}
          </span>
        </div>
        <p className="cv-job-description mt-1">{job.description}</p>
        <JobFrameworkPills
          frameworks={frameworks}
          compact
          expandAriaLabel={expandTechAria}
          collapseAriaLabel={collapseTechAria}
        />
      </div>
    );
  }

  const datesStr = dates ?? '';

  return (
    <div id={slugifyClient(job.client)}>
      <div className="cv-row-with-side-meta">
        <span className="min-w-0 flex-1 text-base font-bold leading-snug text-cv-jobs print:text-sm">
          {job.client}
        </span>
        <span className="min-w-max shrink-0 self-end text-cv-meta font-normal tabular-nums leading-snug text-cv-jobs print:text-xs max-md:hidden print:!inline">
          {dates}
        </span>
      </div>
      <JobMetaMobileRow
        roleName={roleName}
        location={job.location}
        datesLine={datesStr}
      />
      <div className="cv-row-with-side-meta pb-2 max-md:hidden print:flex">
        <span className="min-w-0 flex-1 text-cv-meta font-normal leading-snug text-cv-jobs print:text-xs">
          {roleName ?? ''}
        </span>
        <span className="min-w-max shrink-0 self-end text-cv-meta leading-snug text-cv-jobs print:text-xs">
          {job.location}
        </span>
      </div>
      <p className="cv-job-description">{job.description}</p>
      {job.bullets && job.bullets.length > 0 && (
        <ul className="cv-job-description mx-4 my-2 list-disc">
          {job.bullets.map((bullet) => (
            <li key={bullet.id}>{bullet.text}</li>
          ))}
        </ul>
      )}
      <JobFrameworkPills
        frameworks={frameworks}
        expandAriaLabel={expandTechAria}
        collapseAriaLabel={collapseTechAria}
      />
    </div>
  );
}
