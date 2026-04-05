'use client';

import React from 'react';

const solidColorMap = {
  fuchsia: 'bg-fuchsia-200',
  orange: 'bg-orange-300',
} as const;

type PillColor = keyof typeof solidColorMap | 'skill' | 'jobs';

interface PillProps {
  children: React.ReactNode;
  /** `skill` = bordure + texte bleus (bloc Compétences). `jobs` = bordure + texte roses (bloc Missions). */
  color?: PillColor;
  compact?: boolean;
}

export default function Pill({
  children,
  color = 'fuchsia',
  compact = false,
}: PillProps) {
  if (color === 'jobs') {
    const classes = compact
      ? 'whitespace-nowrap rounded border border-cv-jobs/45 px-1 py-0.5 text-[9px] text-cv-jobs print:text-[8px]'
      : 'whitespace-nowrap rounded border border-cv-jobs/45 px-1.5 py-0.5 text-[10px] text-cv-jobs md:px-2 md:py-1 md:text-xs';
    return <span className={classes}>{children}</span>;
  }

  if (color === 'skill') {
    const classes = compact
      ? 'whitespace-nowrap rounded border border-cv-tag-border/50 px-1 py-0.5 text-[9px] text-cv-tag-text print:text-[8px]'
      : 'whitespace-nowrap rounded border border-cv-tag-border/50 px-1.5 py-0.5 text-[10px] text-cv-tag-text md:px-2 md:py-1 md:text-xs';
    return <span className={classes}>{children}</span>;
  }

  const bg = solidColorMap[color];
  const classes = compact
    ? `whitespace-nowrap rounded ${bg} px-1 py-0.5 text-[9px] text-white print:text-[8px]`
    : `whitespace-nowrap rounded ${bg} px-1.5 py-0.5 text-[10px] text-white md:px-2 md:py-1 md:text-xs`;

  return <span className={classes}>{children}</span>;
}
