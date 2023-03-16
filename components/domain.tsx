'use client';

import React from 'react';

export default function domain({ domain: domain }: any) {
  return (
    <div className="mt-4">
      <h2 className="border-b pb-1 text-justify text-2xl font-semibold text-blue-600">
        {domain.name}
      </h2>
      <p className="mt-4">{domain.description}</p>
    </div>
  );
}
