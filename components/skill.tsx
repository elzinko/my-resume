'use client';

import React from 'react';

export default function skill({ skill: skill }: any) {
  return (
    <a
      href={skill?.link}
      className="whitespace-nowrap rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-2 py-1 text-center text-xs text-white md:px-3 md:text-sm"
    >
      {skill?.name}
    </a>
  );
}
