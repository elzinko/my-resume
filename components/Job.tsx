'use client';

import React from 'react';
import JobDisplay from './JobDisplay';
import type { DetailLevel } from '@/lib/cv-detail-level';
import type { Locale } from 'i18n-config';

interface JobProps {
  job: any;
  compact?: boolean;
  presentLabel?: string;
  locale?: Locale;
  /** Niveau de détail des expériences (param `?detail=`). */
  detailLevel?: DetailLevel;
}

export default function Job({
  job,
  compact = false,
  presentLabel,
  locale,
  detailLevel,
}: JobProps) {
  return (
    <JobDisplay
      job={job}
      compact={compact}
      presentLabel={presentLabel}
      locale={locale}
      detailLevel={detailLevel}
    />
  );
}
