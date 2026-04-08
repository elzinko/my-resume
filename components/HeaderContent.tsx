'use client';

import type { ReactNode } from 'react';

interface HeaderContentProps {
  name: string;
  role: string;
  /** CV court : en-tête plus compact à l’impression pour gagner de la hauteur sur A4. */
  compactPrint?: boolean;
  /** Ex. coordonnées sans titres, alignées à droite (desktop CV long uniquement). */
  afterRole?: ReactNode;
  /** Ex. pastilles adéquation sous le sous-titre (rôle). */
  belowRole?: ReactNode;
}

export default function HeaderContent({
  name,
  role,
  compactPrint = false,
  afterRole,
  belowRole,
}: HeaderContentProps) {
  return (
    <div
      className={`header-content flex justify-between pb-0 pt-2 max-md:pt-0 md:py-20 ${
        compactPrint ? 'print:py-1.5' : 'print:py-4'
      }`}
    >
      <div className="grid w-full justify-items-end">
        <h1
          className={`text-3xl font-extrabold leading-tight text-blue-600 md:text-5xl md:leading-none lg:text-7xl ${
            compactPrint ? 'print:text-2xl print:leading-tight' : 'print:text-3xl'
          }`}
        >
          {name}
        </h1>
        <p
          className={`mt-1 text-lg leading-snug text-teal-300 md:mt-5 md:text-3xl md:leading-normal ${
            compactPrint
              ? 'print:mt-0.5 print:text-sm print:leading-snug print:text-teal-500'
              : 'print:mt-1 print:text-lg print:text-teal-500'
          }`}
        >
          {role}
        </p>
        {afterRole ? (
          <div className="w-full max-w-full justify-self-stretch">{afterRole}</div>
        ) : null}
        {belowRole ? (
          <div className="w-full max-w-full justify-self-stretch">{belowRole}</div>
        ) : null}
      </div>
    </div>
  );
}
