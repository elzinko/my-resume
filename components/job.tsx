'use client';

import React from 'react';
import JobDisplay from './JobDisplay';

interface JobProps {
  job: any;
  compact?: boolean;
  presentLabel?: string;
}

export default function Job({ job, compact = false, presentLabel }: JobProps) {
  return <JobDisplay job={job} compact={compact} presentLabel={presentLabel} />;
}
