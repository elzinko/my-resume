'use client';

import type { ReactNode } from 'react';

interface HeaderContentProps {
  name: string;
  role: string;
  /** CV court : en-tête plus compact à l'impression pour gagner de la hauteur sur A4. */
  compactPrint?: boolean;
  /** Coordonnées compactes sous le sous-titre. */
  belowRole?: ReactNode;
}

/**
 * En-tête du CV.
 *
 * Layout : bloc texte aligné à droite + barre verticale décorative.
 *   ┌──────────────────────────────────┐
 *   │          Thomas Couderc    ┃     │
 *   │  Développeur fullstack Sr  ┃     │
 *   │    email · tel · lieu      ┃     │
 *   └──────────────────────────────────┘
 *   Tout est aligné à droite. La barre verticale sert d'accent visuel discret.
 *
 * `compactPrint` : tailles réduites à l'impression (CV court A4).
 */
export default function HeaderContent({
  name,
  role,
  compactPrint = false,
  belowRole,
}: HeaderContentProps) {
  return (
    <div
      className={`header-content pb-0 pt-2 max-md:pt-0 md:py-20 ${
        compactPrint ? 'print:py-8' : 'print:py-20'
      }`}
    >
      <div className="flex w-full items-stretch justify-end gap-4 md:gap-6 print:gap-4">
        {/* Bloc texte : nom + rôle + coordonnées, alignés à droite */}
        <div className="flex flex-col items-end text-right">
          <h1
            className={`text-3xl font-extrabold leading-tight text-blue-400 md:text-5xl md:leading-none lg:text-7xl ${
              compactPrint
                ? 'print:text-3xl print:leading-tight'
                : 'print:text-5xl print:leading-none'
            }`}
          >
            {name}
          </h1>
          <p
            className={`mt-1 text-lg leading-snug text-cv-section md:mt-3 md:text-3xl md:leading-normal ${
              compactPrint
                ? 'print:mt-0.5 print:text-base print:leading-snug'
                : 'print:mt-3 print:text-3xl print:leading-normal'
            }`}
          >
            {role}
          </p>
          {belowRole ? (
            <div className="mt-1 hidden w-full md:mt-2 md:block print:mt-2 print:block">{belowRole}</div>
          ) : null}
        </div>

        {/* Barre verticale décorative */}
        <div
          className="w-1 shrink-0 self-stretch rounded-full bg-gradient-to-b from-blue-400/40 via-teal-300/30 to-pink-300/20 md:w-1.5 print:w-1"
          aria-hidden
        />
      </div>
    </div>
  );
}
