'use client';

import type { ReactNode } from 'react';

interface HeaderContentProps {
  name: string;
  role: string;
  /** CV court : en-tête plus compact à l'impression pour gagner de la hauteur sur A4. */
  compactPrint?: boolean;
  /** Coordonnées compactes sous le sous-titre. */
  belowRole?: ReactNode;
  /** Chemin de la photo de profil (sous `public/`). Si absent : pas d'avatar. */
  photoUrl?: string;
  /** Texte d'âge déjà localisé (ex. « 46 ans »). Si absent : non affiché. */
  ageText?: string;
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
  photoUrl,
  ageText,
}: HeaderContentProps) {
  return (
    <div
      className={`header-content pb-0 pt-2 max-md:pt-0 md:py-12 ${
        compactPrint ? 'print:py-8' : 'print:py-12'
      }`}
    >
      <div className="flex w-full items-stretch justify-end gap-4 print:gap-4 md:gap-6">
        {/* Photo de profil (optionnelle, à gauche du nom) */}
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={name}
            // `mr-auto` : épingle la photo à la marge gauche (alignée sur le corps
            // du CV) ; la marge auto pousse nom/rôle/âge à droite (mise en page
            // « letterhead »). Sans photo, rien ne change (texte aligné à droite).
            className={`mr-auto shrink-0 self-center rounded-full border-2 border-blue-400/40 object-cover ${
              compactPrint
                ? 'h-16 w-16 print:h-16 print:w-16'
                : 'h-20 w-20 print:h-28 print:w-28 md:h-28 md:w-28 lg:h-36 lg:w-36'
            }`}
          />
        ) : null}

        {/* Bloc texte : nom + rôle + âge + coordonnées, alignés à droite */}
        <div className="flex flex-col items-end text-right">
          <h1
            className={`text-3xl font-extrabold leading-tight text-blue-400 md:text-5xl md:leading-none lg:text-7xl ${
              compactPrint
                ? 'print:text-3xl print:leading-tight'
                : photoUrl
                ? // Avec la photo, le nom doit tenir sur UNE ligne à l'impression :
                  // un cran plus petit (text-6xl) + nowrap pour garantir l'absence de retour.
                  'print:whitespace-nowrap print:text-6xl print:leading-none'
                : 'print:text-7xl print:leading-none'
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
          {ageText ? (
            <p
              className={`mt-1 text-base leading-snug text-gray-400 md:mt-2 md:text-xl ${
                compactPrint
                  ? 'print:mt-0 print:text-xs'
                  : 'print:mt-1 print:text-lg'
              }`}
            >
              {ageText}
            </p>
          ) : null}
          {belowRole ? (
            <div className="mt-1 hidden w-full print:mt-2 print:block md:mt-2 md:block">
              {belowRole}
            </div>
          ) : null}
        </div>

        {/* Barre verticale décorative */}
        <div
          className="w-1 shrink-0 self-stretch rounded-full bg-gradient-to-b from-blue-400/40 to-teal-300/25 print:w-1 md:w-1.5"
          aria-hidden
        />
      </div>
    </div>
  );
}
