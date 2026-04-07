'use client';

import React from 'react';

interface SkillProps {
  skill: {
    id?: string;
    name: string;
    link?: string;
  };
  compact?: boolean;
}

export default function Skill({ skill, compact = false }: SkillProps) {
  /** Surface DS : `.cv-pill-skill` ; survol texte pour les liens. */
  const normalClasses =
    'cv-pill-skill whitespace-nowrap px-2 py-1 text-xs transition-colors hover:text-cv-tag-text-hover md:px-3 md:text-sm print:!text-cv-tag-text';

  const compactClasses =
    'cv-pill-skill whitespace-nowrap px-2 py-0.5 text-xs print:px-1.5 print:text-[10px] print:!text-cv-tag-text';

  // In compact mode or if no link, render as span
  if (compact || !skill?.link) {
    return (
      <span className={compact ? compactClasses : normalClasses}>
        {skill?.name}
      </span>
    );
  }

  return (
    <a href={skill.link} className={normalClasses}>
      {skill.name}
    </a>
  );
}
