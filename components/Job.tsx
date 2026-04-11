'use client';

import React from 'react';
import JobDisplay from './JobDisplay';
import type { Locale } from 'i18n-config';

interface JobProps {
  job: any;
  compact?: boolean;
  presentLabel?: string;
  locale?: Locale;
}

export default function Job({
  job,
  compact = false,
  presentLabel,
  locale,
}: JobProps) {
  return (
    <JobDisplay
      job={job}
      compact={compact}
      presentLabel={presentLabel}
      locale={locale}
    />
  );
}
