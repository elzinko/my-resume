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
  /**
   * `true` : titre + lieu/établissement sur une ligne (séparés par /).
   * `false` : bloc classique titre + ligne méta (colonne gauche).
   */
  condensed?: boolean;
  /**
   * Classe Tailwind pour la couleur du titre + de l'année (ne dépend pas du parent).
   * Défaut : `text-cv-section` (teal-300, vert CV).
   */
  color?: string;
}

function formatStudyYear(startDate?: string, endDate?: string): string | null {
  const endYear = endDate ? new Date(endDate).getFullYear() : null;
  if (endYear) return `${endYear}`;
  const startYear = startDate ? new Date(startDate).getFullYear() : null;
  if (startYear) return `${startYear}`;
  return null;
}

function studyMetaLine(study: StudyData): string {
  const parts = [study.location, study.establishment].filter(
    (p): p is string => Boolean(p && String(p).trim()),
  );
  return parts.join(' / ');
}

export default function StudyDisplay({
  study,
  compact = false,
  condensed = false,
  color = 'text-cv-section',
}: StudyDisplayProps) {
  if (compact) {
    const endYear = study.endDate
      ? new Date(study.endDate).getFullYear()
      : null;
    return (
      <li className="cv-row-study-title-year">
        <span className={`cv-study-title-compact min-w-0 flex-1 ${color}`}>
          {study.name}
        </span>
        {endYear && (
          <span className={`cv-study-year-compact min-w-max shrink-0 whitespace-nowrap ${color}`}>
            {endYear}
          </span>
        )}
      </li>
    );
  }

  const year = formatStudyYear(study.startDate, study.endDate);

  if (condensed) {
    const meta = studyMetaLine(study);
    const titleWithMeta = meta ? `${study.name} / ${meta}` : study.name;
    return (
      <div className="cv-row-study-title-year">
        <span className={`cv-study-title min-w-0 flex-1 ${color}`}>
          {titleWithMeta}
        </span>
        {year && (
          <span
            className={`cv-study-year min-w-max shrink-0 whitespace-nowrap ${color}`}
          >
            {year}
          </span>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="cv-row-study-title-year">
        <span className={`cv-study-title min-w-0 flex-1 ${color}`}>
          {study.name}
        </span>
        {year && (
          <span
            className={`cv-study-year min-w-max shrink-0 whitespace-nowrap ${color}`}
          >
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
