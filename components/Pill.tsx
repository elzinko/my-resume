'use client';

import React from 'react';

const solidColorMap = {
  fuchsia: 'bg-fuchsia-200',
  orange: 'bg-orange-300',
} as const;

type PillColor = keyof typeof solidColorMap | 'skill' | 'jobs' | 'domain' | 'education';

interface PillProps {
  children: React.ReactNode;
  /** `skill` = Compétences (bleu). `jobs` = Missions (rose). `domain` = Agile/Dev/Ops (teal). `education` = niveau Bac+5 / Bac+3 (violet). */
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
      ? 'cv-pill-jobs whitespace-nowrap px-1 py-0.5 text-[9px] print:text-[8px]'
      : 'cv-pill-jobs whitespace-nowrap px-1.5 py-0.5 text-[10px] md:px-2 md:py-1 md:text-xs';
    return <span className={classes}>{children}</span>;
  }

  if (color === 'domain') {
    const classes = compact
      ? 'cv-pill-domain whitespace-nowrap px-1 py-0.5 text-[9px] print:text-[8px]'
      : 'cv-pill-domain whitespace-nowrap px-1.5 py-0.5 text-[10px] md:px-2 md:py-1 md:text-xs';
    return <span className={classes}>{children}</span>;
  }

  if (color === 'skill') {
    const classes = compact
      ? 'cv-pill-skill whitespace-nowrap px-1 py-0.5 text-[9px] print:text-[8px]'
      : 'cv-pill-skill whitespace-nowrap px-1.5 py-0.5 text-[10px] md:px-2 md:py-1 md:text-xs';
    return <span className={classes}>{children}</span>;
  }

  if (color === 'education') {
    const classes = compact
      ? 'cv-pill-education inline-block max-w-full px-1.5 py-0.5 text-xs leading-snug print:px-1.5 print:py-0.5 print:text-[10px]'
      : 'cv-pill-education inline-block max-w-full px-2 py-0.5 text-sm leading-snug md:px-2.5 md:py-1 md:text-base print:text-sm';
    return <span className={classes}>{children}</span>;
  }

  const bg = solidColorMap[color];
  const classes = compact
    ? `whitespace-nowrap rounded ${bg} px-1 py-0.5 text-[9px] text-white print:text-[8px]`
    : `whitespace-nowrap rounded ${bg} px-1.5 py-0.5 text-[10px] text-white md:px-2 md:py-1 md:text-xs`;

  return <span className={classes}>{children}</span>;
}
