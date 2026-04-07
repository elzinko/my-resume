'use client';

import React from 'react';
import type { EducationLevelContent } from '@/lib/education-level-content';

interface EducationLevelProps {
  content: EducationLevelContent;
  compact?: boolean;
}

type PrimaryRole = 'heading' | 'primary';

interface BlockRow {
  id: string;
  primaryRole: PrimaryRole;
  primary: string;
  secondary?: string;
}

function buildRows(t: EducationLevelContent): BlockRow[] {
  return [
    {
      id: 'level',
      primaryRole: 'heading',
      primary: t.levelPrimary,
      secondary: t.effectiveLevelDetail,
    },
    {
      id: 'diploma',
      primaryRole: 'primary',
      primary: t.diploma,
      secondary: t.diplomaDetail,
    },
    {
      id: 'additional',
      primaryRole: 'primary',
      primary: t.additionalTraining,
      secondary: t.trainingThemes,
    },
  ];
}

/** Ligne 1 = niveau / titre, ligne 2 = précision ou matière ; encadré violet comme les pastilles Compétences. */
function EducationBlockRow({
  primaryRole,
  primary,
  secondary,
  compact,
}: BlockRow & { compact: boolean }) {
  const primaryClass =
    primaryRole === 'heading' ? 'cv-education-heading' : 'cv-education-primary';
  const mutedClass = compact
    ? 'cv-education-muted-compact'
    : 'cv-education-muted';
  const cardClass = compact
    ? 'cv-education-level-card-compact'
    : 'cv-education-level-card';
  const detailGap = compact ? 'mt-0.5' : 'mt-1';

  return (
    <div className={cardClass}>
      <p className={primaryClass}>{primary}</p>
      {secondary ? (
        <p className={`${mutedClass} max-w-full ${detailGap}`}>{secondary}</p>
      ) : null}
    </div>
  );
}

export default function EducationLevel({
  content,
  compact = false,
}: EducationLevelProps) {
  const rows = buildRows(content);

  if (compact) {
    return (
      <section className="mb-6 mt-6 print:mb-4 print:mt-4">
        <h2 className="border-b pb-1 text-2xl font-semibold text-purple-300 print:text-sm">
          {content.title}
        </h2>
        <div className="mt-2 space-y-2 font-normal print:mt-1 print:space-y-1.5">
          {rows.map((row) => (
            <EducationBlockRow key={row.id} {...row} compact />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="education-level" className="mt-10">
      <h2 className="border-b pb-1 text-2xl font-semibold text-purple-300">
        {content.title}
      </h2>
      <div className="mt-4 space-y-3 font-normal print:space-y-2">
        {rows.map((row) => (
          <EducationBlockRow key={row.id} {...row} compact={false} />
        ))}
      </div>
    </section>
  );
}
