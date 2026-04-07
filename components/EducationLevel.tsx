'use client';

import React from 'react';
import Pill from './Pill';
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
  /** Pastille violette sur le libellé de niveau uniquement (pas sur « Formations complémentaires »). */
  pillLevelLabel: boolean;
}

function buildRows(t: EducationLevelContent): BlockRow[] {
  return [
    {
      id: 'level',
      primaryRole: 'heading',
      primary: t.levelPrimary,
      secondary: t.effectiveLevelDetail,
      pillLevelLabel: true,
    },
    {
      id: 'diploma',
      primaryRole: 'primary',
      primary: t.diploma,
      secondary: t.diplomaDetail,
      pillLevelLabel: true,
    },
    {
      id: 'additional',
      primaryRole: 'primary',
      primary: t.additionalTraining,
      secondary: t.trainingThemes,
      pillLevelLabel: false,
    },
  ];
}

function EducationBlockRow({
  primaryRole,
  primary,
  secondary,
  compact,
  pillLevelLabel,
}: BlockRow & { compact: boolean }) {
  const primaryClass =
    primaryRole === 'heading' ? 'cv-education-heading' : 'cv-education-primary';
  const mutedClass = compact
    ? 'cv-education-muted-compact'
    : 'cv-education-muted';
  const stackGap = compact ? 'space-y-0.5' : 'space-y-1';

  return (
    <div className={stackGap}>
      {pillLevelLabel ? (
        <p className="m-0 leading-snug">
          <Pill color="education" compact={compact}>
            {primary}
          </Pill>
        </p>
      ) : (
        <p className={`m-0 ${primaryClass}`}>{primary}</p>
      )}
      {secondary ? (
        <p className={`${mutedClass} m-0 max-w-full`}>{secondary}</p>
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
      <section className="mb-6 print:mb-4">
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
