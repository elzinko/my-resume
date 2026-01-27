'use client';

import React from 'react';

export default function skill({ skill: skill }: any) {
  return (
    <a
      href={skill?.link}
      className="whitespace-nowrap rounded border border-blue-400/50 px-2 py-1 text-center text-xs text-blue-300 transition-colors hover:border-blue-300 hover:text-blue-200 md:px-3 md:text-sm"
    >
      {skill?.name}
    </a>
  );
}
