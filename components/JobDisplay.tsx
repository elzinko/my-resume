'use client';

import React, { useState } from 'react';
import formatDates from '@/lib/date';
import JobExperienceBody from './JobExperienceBody';
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
  /** Texte détaillé (suite après l’accroche). Si absent côté CMS, tout peut rester dans `description` sans `descriptionShort`. */
  description: string;
  /** Accroche courte (mobile replié). */
  descriptionShort?: string;
  bullets?: Array<{ id: string; text: string }>;
  frameworks?: Array<{ id: string; name: string; link?: string }>;
}

/**
 * Ligne mobile : poste à gauche, dates à droite (ville sur md+ uniquement).
 */
function JobMetaMobileRow({
  roleName,
  datesLine,
  compact,
}: {
  roleName?: string | null;
  datesLine: string;
  compact?: boolean;
}) {
  const typo = compact
    ? 'text-[11px] text-cv-meta font-normal leading-snug text-cv-jobs'
    : 'text-xs text-cv-meta font-normal leading-snug text-cv-jobs';

  return (
    <div
      className={`flex w-full max-w-full items-baseline justify-between gap-x-3 print:hidden md:hidden ${typo}`}
      data-testid="job-meta-mobile"
    >
      <span className="min-w-0 truncate text-left" data-job-meta="role">
        {roleName ?? ''}
      </span>
      <span
        className="min-w-0 max-w-[55%] shrink-0 truncate whitespace-nowrap text-right tabular-nums"
        data-job-meta="dates"
      >
        {datesLine}
      </span>
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
  const [detailsOpen, setDetailsOpen] = useState(false);
  const dates = compact ? null : formatDates(job.startDate, job.endDate);
  const roleName = typeof job.role === 'string' ? job.role : job.role?.name;
  const frameworks = job.frameworks || [];
  const shortDesc = (job.descriptionShort ?? '').trim();
  const longDesc = (job.description ?? '').trim();
  const hasBullets = Boolean(job.bullets?.length);
  /** S’il n’y a que des pastilles techno, on les garde visibles sans ouvrir le détail texte. */
  const hidePillsUntilDetailOpen =
    Boolean(shortDesc) || Boolean(longDesc) || hasBullets;
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
          <span className="min-w-max shrink-0 self-end text-cv-meta font-normal tabular-nums leading-snug text-cv-jobs print:!inline print:text-[8px] max-md:hidden">
            {compactDateLine}
          </span>
        </div>
        <JobMetaMobileRow
          compact
          roleName={roleName}
          datesLine={compactDateLine}
        />
        <div className="cv-row-with-side-meta print:flex print:gap-1 max-md:hidden">
          <span className="min-w-0 flex-1 text-cv-meta font-normal leading-snug text-cv-jobs print:text-[8px]">
            {roleName ?? ''}
          </span>
          <span className="min-w-max shrink-0 self-end text-cv-meta leading-snug text-cv-jobs print:text-[8px]">
            {job.location}
          </span>
        </div>
        <JobExperienceBody
          descriptionShort={job.descriptionShort}
          description={job.description}
          bullets={job.bullets}
          locale={locale}
          compact
          onExpandedChange={setDetailsOpen}
        />
        <div
          className={
            !detailsOpen && hidePillsUntilDetailOpen ? 'max-md:hidden' : ''
          }
        >
          <JobFrameworkPills
            frameworks={frameworks}
            compact
            expandAriaLabel={expandTechAria}
            collapseAriaLabel={collapseTechAria}
          />
        </div>
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
        <span className="min-w-max shrink-0 self-end text-cv-meta font-normal tabular-nums leading-snug text-cv-jobs print:!inline print:text-xs max-md:hidden">
          {dates}
        </span>
      </div>
      <JobMetaMobileRow roleName={roleName} datesLine={datesStr} />
      <div className="cv-row-with-side-meta pb-2 print:flex max-md:hidden">
        <span className="min-w-0 flex-1 text-cv-meta font-normal leading-snug text-cv-jobs print:text-xs">
          {roleName ?? ''}
        </span>
        <span className="min-w-max shrink-0 self-end text-cv-meta leading-snug text-cv-jobs print:text-xs">
          {job.location}
        </span>
      </div>
      <JobExperienceBody
        descriptionShort={job.descriptionShort}
        description={job.description}
        bullets={job.bullets}
        locale={locale}
        onExpandedChange={setDetailsOpen}
      />
      <div
        className={
          !detailsOpen && hidePillsUntilDetailOpen ? 'max-md:hidden' : ''
        }
      >
        <JobFrameworkPills
          frameworks={frameworks}
          expandAriaLabel={expandTechAria}
          collapseAriaLabel={collapseTechAria}
        />
      </div>
    </div>
  );
}
