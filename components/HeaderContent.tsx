'use client';

import type { ReactNode } from 'react';

interface HeaderContentProps {
  name: string;
  role: string;
  /** CV court : en-tête plus compact à l'impression pour gagner de la hauteur sur A4. */
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
  /* ---------- CV court : en-tête 2 colonnes (nom|contact) ---------- */
  if (compactPrint) {
    return (
      <div className="header-content cv-short-header pb-0 pt-2 max-md:pt-0 md:py-20 print:py-1.5">
        {/* Écran : colonne unique, droite — impression : 2 colonnes miroir */}
        <div className="grid w-full justify-items-end print:grid-cols-[1fr_auto] print:items-end print:gap-x-6 print-preview:grid-cols-[1fr_auto] print-preview:items-end print-preview:gap-x-6">
          {/* — Colonne gauche : nom + rôle — */}
          <div className="print:justify-self-end print-preview:justify-self-end">
            <h1 className="text-3xl font-extrabold leading-tight text-blue-600 md:text-5xl md:leading-none lg:text-7xl print:text-2xl print:leading-tight">
              {name}
            </h1>
            <p className="mt-1 text-lg leading-snug text-teal-300 md:mt-5 md:text-3xl md:leading-normal print:mt-0.5 print:text-sm print:leading-snug print:text-teal-500 print:text-right print-preview:text-right">
              {role}
            </p>
          </div>
          {/* — Colonne droite : coordonnées — */}
          {afterRole ? (
            <div className="w-full max-w-full justify-self-stretch print:w-auto print:justify-self-start print-preview:w-auto print-preview:justify-self-start">
              {afterRole}
            </div>
          ) : null}
        </div>
        {belowRole ? (
          <div className="w-full max-w-full">{belowRole}</div>
        ) : null}
      </div>
    );
  }

  /* ---------- CV long : layout classique ---------- */
  return (
    <div
      className="header-content flex justify-between pb-0 pt-2 max-md:pt-0 md:py-20 print:py-4"
    >
      <div className="grid w-full justify-items-end">
        <h1 className="text-3xl font-extrabold leading-tight text-blue-600 md:text-5xl md:leading-none lg:text-7xl print:text-3xl">
          {name}
        </h1>
        <p className="mt-1 text-lg leading-snug text-teal-300 md:mt-5 md:text-3xl md:leading-normal print:mt-1 print:text-lg print:text-teal-500">
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
