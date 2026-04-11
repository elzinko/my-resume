'use client';

import React from 'react';

export default function customLink({
  link,
  name,
  className = '',
}: {
  link: string;
  name: string;
  className?: string;
}) {
  return (
    <a
      href={link}
      className={`underline-offset-2 hover:underline ${className}`.trim()}
    >
      {name}
    </a>
  );
}
