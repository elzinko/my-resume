'use client';

import React from 'react';

export interface StudyData {
  id: string;
  name: string;
  establishment?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}

interface StudyDisplayProps {
  study: StudyData;
  compact?: boolean;
}

function formatStudyYear(startDate?: string, endDate?: string): string | null {
  const endYear = endDate ? new Date(endDate).getFullYear() : null;
  if (endYear) return `${endYear}`;
  const startYear = startDate ? new Date(startDate).getFullYear() : null;
  if (startYear) return `${startYear}`;
  return null;
}

export default function StudyDisplay({
  study,
  compact = false,
}: StudyDisplayProps) {
  if (compact) {
    const endYear = study.endDate
      ? new Date(study.endDate).getFullYear()
      : null;
    return (
      <li className="cv-row-study-title-year">
        <span className="cv-study-title-compact min-w-0 flex-1">{study.name}</span>
        {endYear && (
          <span className="cv-study-year-compact min-w-max shrink-0 whitespace-nowrap">
            {endYear}
          </span>
        )}
      </li>
    );
  }

  const year = formatStudyYear(study.startDate, study.endDate);

  return (
    <>
      <div className="cv-row-study-title-year">
        <span className="cv-study-title min-w-0 flex-1">{study.name}</span>
        {year && (
          <span className="cv-study-year min-w-max shrink-0 whitespace-nowrap">
            {year}
          </span>
        )}
      </div>
      <p className="cv-study-meta mt-1">
        {study.location} / {study.establishment}
      </p>
    </>
  );
}
