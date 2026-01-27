'use client';

import React from 'react';

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

export default function Domain({ domain, showTags = true, compact = false }: DomainProps) {
  return (
    <div className={compact ? "mt-4 flex-1 print:mt-2" : "mt-4"}>
      <h2 className={`border-b pb-1 text-2xl font-semibold text-blue-500 ${compact ? 'print:text-sm' : 'text-justify'}`}>
        {domain.name}
      </h2>
      <p className={compact 
        ? "mt-4 print:mt-2 print:text-[9px] print:leading-tight" 
        : "mt-4 min-h-[100px]"
      }>
        {domain.description}
      </p>
      {showTags && domain?.competencies?.length > 0 && (
        <p className="flex flex-wrap gap-x-2 gap-y-2 whitespace-nowrap py-2">
          {domain.competencies.map((competency) => (
            <span
              key={competency.id}
              className="rounded bg-orange-300 px-2 py-1 text-xs text-white"
            >
              {competency.name.toLowerCase()}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
