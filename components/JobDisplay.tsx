'use client';

import React from 'react';
import formatDates from '@/lib/date';
import { slugifyClient } from '@/lib/slug';

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

interface JobDisplayProps {
  job: JobData;
  compact?: boolean;
  presentLabel?: string; // Label for "Present" in current language
  maxFrameworks?: number; // Limit frameworks shown in compact mode
}

export default function JobDisplay({ 
  job, 
  compact = false, 
  presentLabel = 'Présent',
  maxFrameworks = 5 
}: JobDisplayProps) {
  // In compact mode, dates are already formatted strings
  // In full mode, dates need to be formatted from ISO strings
  const dates = compact ? null : formatDates(job.startDate, job.endDate);
  const roleName = typeof job.role === 'string' ? job.role : job.role?.name;
  const frameworks = job.frameworks || [];
  const displayFrameworks = compact ? frameworks.slice(0, maxFrameworks) : frameworks;

  if (compact) {
    // Compact mode: dates are already formatted as strings (e.g., "06/2024")
    return (
      <div>
        <div className="flex items-start justify-between">
          <span className="font-bold text-sky-300 print:text-xs">
            {job.client}
          </span>
          <span className="text-xs text-fuchsia-300 print:text-[10px]">
            {job.location}
          </span>
        </div>
        <div className="text-xs text-sky-300 print:text-[10px]">
          {job.startDate} - {job.endDate || presentLabel}
        </div>
        <p className="mt-1 text-xs print:text-[10px]">
          {job.description}
        </p>
        {displayFrameworks.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {displayFrameworks.map((fw) => (
              <span
                key={fw.id}
                className="whitespace-nowrap rounded bg-fuchsia-200 px-1 py-0.5 text-[9px] text-white print:text-[8px]"
              >
                {fw.name.toLowerCase()}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Full mode: complete display with role, bullets, all frameworks
  return (
    <div id={slugifyClient(job.client)}>
      <div className="flex justify-between">
        <small className="font-bold text-sky-300">{job.client}</small>
        <small className="min-w-max text-sky-300">{dates}</small>
      </div>
      <p className="flex justify-between pb-2">
        <small className="text-teal-300">{roleName}</small>
        <small className="text-fuchsia-300">{job.location}</small>
      </p>
      <p className="text-justify text-xs">{job.description}</p>
      {job.bullets && job.bullets.length > 0 && (
        <ul className="mx-4 my-2 list-disc text-xs">
          {job.bullets.map((bullet) => (
            <li key={bullet.id}>{bullet.text}</li>
          ))}
        </ul>
      )}
      {frameworks.length > 0 && (
        <p className="flex flex-wrap gap-1.5 py-2 md:gap-2">
          {frameworks.map((framework) => (
            <span
              key={framework.id}
              className="whitespace-nowrap rounded bg-fuchsia-200 px-1.5 py-0.5 text-[10px] text-white md:px-2 md:py-1 md:text-xs"
            >
              {framework.name.toLowerCase()}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
