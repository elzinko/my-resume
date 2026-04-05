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
  const baseClasses =
    'whitespace-nowrap rounded border border-cv-tag-border/50 text-cv-tag-text';

  const normalClasses = `${baseClasses} px-2 py-1 text-xs transition-colors hover:border-cv-tag-text hover:text-cv-tag-text-hover md:px-3 md:text-sm`;

  const compactClasses = `${baseClasses} px-2 py-0.5 text-xs print:px-1.5 print:text-[10px]`;

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
