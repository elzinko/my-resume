'use client';

import React from 'react';
import StudyDisplay from './StudyDisplay';

interface StudyProps {
  study: any;
  compact?: boolean;
}

export default function Study({ study, compact = false }: StudyProps) {
  return <StudyDisplay study={study} compact={compact} />;
}
