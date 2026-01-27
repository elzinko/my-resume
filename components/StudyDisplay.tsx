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

export default function StudyDisplay({ study, compact = false }: StudyDisplayProps) {
  if (compact) {
    // Compact mode: only name and end year
    const endYear = study.endDate ? new Date(study.endDate).getFullYear() : null;
    return (
      <li className="flex items-start justify-between gap-2">
        <span className="text-xs text-teal-300 print:text-[10px]">
          {study.name}
        </span>
        {endYear && (
          <span className="whitespace-nowrap text-[10px] text-gray-400 print:text-[8px]">
            {endYear}
          </span>
        )}
      </li>
    );
  }

  // Full mode: name with location/establishment
  return (
    <>
      <p className="flex justify-between">
        <strong className="text-base text-teal-300">{study.name}</strong>
      </p>
      <p className="flex text-sm text-gray-300">
        <small>
          {study.location} / {study.establishment}
        </small>
      </p>
    </>
  );
}
