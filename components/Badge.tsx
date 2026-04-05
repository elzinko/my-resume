'use client';

import React from 'react';

const colorMap = {
  orange: 'bg-orange-300',
  teal: 'bg-teal-300',
} as const;

interface BadgeProps {
  children: React.ReactNode;
  color?: keyof typeof colorMap;
  compact?: boolean;
}

export default function Badge({
  children,
  color = 'orange',
  compact = false,
}: BadgeProps) {
  const bg = colorMap[color];

  const classes = compact
    ? `inline-block whitespace-nowrap rounded ${bg} px-2 py-0.5 text-xs font-bold text-gray-900 print:text-[10px]`
    : `inline-block whitespace-nowrap rounded ${bg} px-2.5 py-1 text-sm font-bold text-gray-900 print:text-[10px]`;

  return <span className={classes}>{children}</span>;
}
