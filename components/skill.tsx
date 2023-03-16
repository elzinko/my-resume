'use client';

import React from 'react';

export default function skill({ skill: skill }: any) {
  return (
    <a
      href={skill?.link}
      className="w-28 rounded-lg bg-blue-600 px-2 py-1 text-center text-white md:text-sm"
    >
      {skill?.name}
    </a>
  );
}
