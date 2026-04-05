'use client';

import React from 'react';
import Pill from './Pill';

interface DomainProps {
  domain: {
    id?: string;
    name: string;
    description: string;
    competencies?: Array<{
      id: string;
      name: string;
      link?: string;
    }>;
  };
  showTags?: boolean;
  compact?: boolean;
}

export default function Domain({
  domain,
  showTags = true,
  compact = false,
}: DomainProps) {
  return (
    <div
      className={
        compact
          ? 'mt-4 min-w-0 flex-1 print:mt-2'
          : 'mt-0 min-w-0 flex-1 md:mt-4'
      }
    >
      <h2
        className={`border-b pb-1 text-2xl font-semibold text-cv-section ${
          compact ? 'print:text-sm' : 'text-justify'
        }`}
      >
        {domain.name}
      </h2>
      <p
        className={
          compact
            ? 'mt-4 print:mt-2 print:text-[9px] print:leading-tight'
            : 'mt-4 min-h-[100px]'
        }
      >
        {domain.description}
      </p>
      {showTags && domain?.competencies && domain.competencies.length > 0 && (
        <p className="hidden flex-wrap gap-x-2 gap-y-2 whitespace-nowrap py-2 print:flex md:flex">
          {domain.competencies.map((competency) => (
            <Pill key={competency.id} color="skill">
              {competency.name.toLowerCase()}
            </Pill>
          ))}
        </p>
      )}
    </div>
  );
}
