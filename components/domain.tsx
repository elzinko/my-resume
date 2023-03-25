'use client';

import React from 'react';

export default function domain({ domain: domain }: any) {
  return (
    <div className="mt-4">
      <h2 className="border-b pb-1 text-justify text-2xl font-semibold text-blue-600">
        {domain.name}
      </h2>
      <p className="mt-4 min-h-[100px]">{domain.description}</p>
      {domain?.competencies?.length > 0 ? (
        <p className="flex  flex-wrap gap-x-2 gap-y-2 whitespace-nowrap py-2">
          {domain?.competencies?.map((competency: any) => (
            <span
              key={competency.id}
              className="rounded bg-orange-400 px-2 py-1 text-xs text-white"
            >
              {competency.name.toLowerCase()}
            </span>
          ))}
        </p>
      ) : (
        ''
      )}
    </div>
  );
}
