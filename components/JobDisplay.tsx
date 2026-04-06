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
 * Vue étroite (< lg) : poste + dates (lieu en sr-only). Au-delà de lg, la ligne desktop poste|lieu reprend.
 * On utilise lg (pas md) pour éviter une colonne main à ~500px en tablette où poste/lieu/dates semblaient tronqués.
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
  const locationTrimmed = location?.trim() ?? '';
  return (
    <div
      className="mt-1 text-xs text-cv-meta font-normal leading-snug text-cv-jobs lg:hidden print:hidden"
      data-testid="job-meta-mobile"
    >
      <span className="sr-only" data-job-meta="location">
        {locationTrimmed || '\u00a0'}
      </span>
      <div
        className="flex w-full flex-wrap items-baseline gap-x-2 gap-y-0.5"
        data-testid="job-meta-mobile-line"
      >
        {roleName ? (
          <span
            className="min-w-0 flex-1 basis-0 break-words text-start text-cv-jobs"
            data-job-meta="role"
          >
            {roleName}
          </span>
        ) : null}
        <span
          className={`min-w-0 shrink-0 whitespace-nowrap text-end tabular-nums text-cv-jobs${roleName ? '' : ' ml-auto'}`}
          data-job-meta="dates"
        >
          {datesLine}
        </span>
      </div>
    </div>
  );
}

/** CV court : même seuil lg que JobMetaMobileRow. */
function CompactJobMetaMobile({
  roleName,
  location,
  datesLine,
}: {
  roleName?: string | null;
  location?: string;
  datesLine: string;
}) {
  const locationTrimmed = location?.trim() ?? '';
  return (
    <div className="mt-1 lg:hidden print:hidden">
      <span className="sr-only" data-job-meta="location">
        {locationTrimmed || '\u00a0'}
      </span>
      <div
        className="flex w-full flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs leading-snug text-cv-meta text-cv-jobs"
        data-testid="job-meta-mobile-line"
      >
        {roleName ? (
          <span
            className="min-w-0 flex-1 basis-0 break-words text-start font-semibold text-cv-jobs"
            data-job-meta="role"
          >
            {roleName}
          </span>
        ) : null}
        <span
          className={`min-w-0 shrink-0 whitespace-nowrap text-end tabular-nums${roleName ? '' : ' ml-auto'}`}
          data-job-meta="dates"
        >
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
          <span className="min-w-max shrink-0 self-end text-cv-meta font-normal tabular-nums leading-snug text-cv-jobs print:text-[10px] max-lg:hidden print:!inline">
            {compactDateLine}
          </span>
        </div>
        <CompactJobMetaMobile
          roleName={roleName}
          location={job.location}
          datesLine={compactDateLine}
        />
        <div className="cv-row-with-side-meta print:gap-1 max-lg:hidden print:flex">
          <span className="min-w-0 flex-1 whitespace-normal break-words text-cv-meta font-normal leading-snug text-cv-jobs print:text-[10px]">
            {roleName ?? ''}
          </span>
          <span className="min-w-max shrink-0 self-end whitespace-normal break-words text-end text-cv-meta leading-snug text-cv-jobs print:text-[10px]">
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
        <span className="min-w-max shrink-0 self-end text-cv-meta font-normal tabular-nums leading-snug text-cv-jobs print:text-xs max-lg:hidden print:!inline">
          {dates}
        </span>
      </div>
      <JobMetaMobileRow
        roleName={roleName}
        location={job.location}
        datesLine={datesStr}
      />
      <div className="cv-row-with-side-meta pb-2 max-lg:hidden print:flex">
        <span className="min-w-0 flex-1 whitespace-normal break-words text-cv-meta font-normal leading-snug text-cv-jobs print:text-xs">
          {roleName ?? ''}
        </span>
        <span className="min-w-max shrink-0 self-end whitespace-normal break-words text-end text-cv-meta leading-snug text-cv-jobs print:text-xs">
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
