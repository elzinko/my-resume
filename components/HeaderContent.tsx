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

/**
 * En-tête du CV.
 *
 * Layout desktop / print (md+) :
 *   ┌─────────────────────────┬──────────────────┐
 *   │  Thomas Couderc    (→)  │  (←)  email      │
 *   │  Dev fullstack Senior   │       phone       │
 *   │                         │       location    │
 *   └─────────────────────────┴──────────────────┘
 *   Colonne gauche = nom + rôle alignés à droite.
 *   Colonne droite = coordonnées alignées à gauche.
 *
 * Mobile (< md) : tout stacked, aligné à droite, inchangé.
 */
export default function HeaderContent({
  name,
  role,
  compactPrint = false,
  afterRole,
  belowRole,
}: HeaderContentProps) {
  return (
    <div
      className={`header-content pb-0 pt-2 max-md:pt-0 md:py-20 ${
        compactPrint ? 'print:py-1.5' : 'print:py-4'
      }`}
    >
      {/*
        Mobile : single column, right-aligned (justify-items-end).
        Desktop+ : 2 columns miroir — nom|coordonnées.
        Le `1fr auto` laisse le bloc coordonnées prendre sa largeur naturelle.
      */}
      <div className="grid w-full justify-items-end md:grid-cols-[1fr_auto] md:items-end md:gap-x-8 print:grid-cols-[1fr_auto] print:items-end print:gap-x-6">
        {/* — Colonne gauche : nom + rôle, alignés à droite dans la colonne — */}
        <div className="md:justify-self-end print:justify-self-end">
          <h1
            className={`text-3xl font-extrabold leading-tight text-blue-600 md:text-5xl md:leading-none md:text-right lg:text-7xl ${
              compactPrint
                ? 'print:text-2xl print:leading-tight print:text-right'
                : 'print:text-3xl print:text-right'
            }`}
          >
            {name}
          </h1>
          <p
            className={`mt-1 text-lg leading-snug text-teal-300 md:mt-5 md:text-3xl md:leading-normal md:text-right ${
              compactPrint
                ? 'print:mt-0.5 print:text-sm print:leading-snug print:text-teal-500 print:text-right'
                : 'print:mt-1 print:text-lg print:text-teal-500 print:text-right'
            }`}
          >
            {role}
          </p>
        </div>
        {/* — Colonne droite : coordonnées, alignées à gauche — */}
        {afterRole ? (
          <div className="w-full max-w-full justify-self-stretch md:w-auto md:justify-self-start print:w-auto print:justify-self-start">
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
