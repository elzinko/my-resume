'use client';

import React from 'react';
import StudyDisplay from './StudyDisplay';

interface StudyProps {
  study: any;
  compact?: boolean;
  condensed?: boolean;
}

export default function Study({
  study,
  compact = false,
  condensed = false,
}: StudyProps) {
  return (
    <StudyDisplay
      study={study}
      compact={compact}
      condensed={condensed}
      color="text-purple-300"
    />
  );
}
