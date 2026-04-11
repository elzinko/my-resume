'use client';

import React from 'react';

const solidColorMap = {
  fuchsia: 'bg-fuchsia-200',
  orange: 'bg-orange-300',
} as const;

type PillColor = keyof typeof solidColorMap | 'skill' | 'jobs' | 'domain' | 'education' | 'match';

type PillSize = 's' | 'm' | 'l';

interface PillProps {
  children: React.ReactNode;
  /** `skill` = Competences (bleu). `jobs` = Missions (rose). `domain` = Agile/Dev/Ops (teal). `education` = niveau Bac+5 / Bac+3 (violet). `match` = Adequation poste (orange). */
  color?: PillColor;
  /** `s` = petit (badges clients). `m` = standard (defaut). `l` = grand. */
  size?: PillSize;
  compact?: boolean;
  /** Afficher la bordure (defaut : true). `false` pour les badges clients. */
  border?: boolean;
  /** Texte secondaire optionnel (ex. "4 ans"), rendu en couleur plus claire. */
  metric?: string;
}

export type { PillColor, PillSize };

export default function Pill({
  children,
  color = 'fuchsia',
  size = 'm',
  compact = false,
  border = true,
  metric,
}: PillProps) {
  /* ── Match : Adequation poste / badges clients ── */
  if (color === 'match') {
    const pillClass = border ? 'cv-pill-match' : 'cv-pill-match-borderless';

    const sizeMap: Record<PillSize, string> = {
      s: compact
        ? 'px-1 py-0.5 text-[9px] print:text-[8px]'
        : 'px-1.5 py-0.5 text-[10px] print:px-1 print:py-0 print:text-[8px] md:text-xs',
      m: 'px-2 py-0.5 text-xs print:px-1.5 print:py-0.5 print:text-[10px] md:text-sm',
      l: compact
        ? 'px-2.5 py-1 text-sm print:px-2 print:py-0.5 print:text-xs'
        : 'px-3 py-1 text-sm md:text-base',
    };

    const noWrap = compact || size === 's' ? 'whitespace-nowrap' : '';
    const classes = `${pillClass} inline-flex max-w-full shrink-0 items-baseline gap-x-1.5 print:gap-1 ${noWrap} ${sizeMap[size]}`;
    const truncCls = compact ? 'min-w-0 truncate' : 'min-w-0';

    const metricCls =
      'text-[10px] font-normal tabular-nums text-orange-200/95 print:text-[9px] print:!text-orange-300 md:text-xs';

    return (
      <span className={classes}>
        <span className={truncCls}>{children}</span>
        {metric != null && <span className={metricCls}>{metric}</span>}
      </span>
    );
  }

  /* ── Jobs (rose) ── */
  if (color === 'jobs') {
    const classes = compact
      ? 'cv-pill-jobs whitespace-nowrap px-1 py-0.5 text-[9px] print:text-[8px]'
      : 'cv-pill-jobs whitespace-nowrap px-1.5 py-0.5 text-[10px] md:px-2 md:py-1 md:text-xs';
    return <span className={classes}>{children}</span>;
  }

  /* ── Domain (teal) ── */
  if (color === 'domain') {
    const classes = compact
      ? 'cv-pill-domain shrink-0 whitespace-nowrap px-2 py-0.5 text-xs font-medium leading-snug print:px-1.5 print:py-0.5 print:text-[10px] md:px-2.5 md:py-1 md:text-sm'
      : 'cv-pill-domain shrink-0 whitespace-nowrap px-2 py-0.5 text-xs font-medium leading-snug md:px-2.5 md:py-1 md:text-sm print:px-1.5 print:py-0.5 print:text-[10px]';
    return <span className={classes}>{children}</span>;
  }

  /* ── Skill (bleu) ── */
  if (color === 'skill') {
    const classes = compact
      ? 'cv-pill-skill whitespace-nowrap px-1 py-0.5 text-[9px] print:text-[8px]'
      : 'cv-pill-skill whitespace-nowrap px-1.5 py-0.5 text-[10px] md:px-2 md:py-1 md:text-xs';
    return <span className={classes}>{children}</span>;
  }

  /* ── Education (violet) ── */
  if (color === 'education') {
    const classes = compact
      ? 'cv-pill-education inline-block max-w-full px-1.5 py-0.5 text-xs leading-snug print:px-1.5 print:py-0.5 print:text-[10px]'
      : 'cv-pill-education inline-block max-w-full px-2 py-0.5 text-sm leading-snug md:px-2.5 md:py-1 md:text-base print:text-sm';
    return <span className={classes}>{children}</span>;
  }

  /* ── Legacy solid colors (fuchsia, orange) ── */
  const bg = solidColorMap[color];
  const classes = compact
    ? `whitespace-nowrap rounded ${bg} px-1 py-0.5 text-[9px] text-white print:text-[8px]`
    : `whitespace-nowrap rounded ${bg} px-1.5 py-0.5 text-[10px] text-white md:px-2 md:py-1 md:text-xs`;

  return <span className={classes}>{children}</span>;
}
