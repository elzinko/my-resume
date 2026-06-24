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
 * Layout : deux blocs de MÊME largeur (`flex-1`) + barre verticale décorative.
 *   ┌───────────────────────┬───────────────────────┐
 *   │ (•)                    │       Thomas Couderc ┃│
 *   │  photo, collée gauche  │  Développeur Sr.     ┃│
 *   │                        │            46 ans    ┃│
 *   └───────────────────────┴───────────────────────┘
 *      bloc gauche (photo)        bloc droit (texte)
 *   Sans photo : le bloc droit occupe toute la largeur (texte aligné à droite).
 *
 * Masque photo : voir le bloc « masque circulaire AJUSTABLE » ci-dessous.
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
        compactPrint ? 'print:py-8' : 'print:!py-2'
      }`}
    >
      <div className="flex w-full items-stretch gap-4 print:gap-4 md:gap-6">
        {/* Bloc gauche : photo. Dès `md:`, MÊME largeur que le bloc droit
            (`md:flex-1`) et avatar centré verticalement (`md:items-center`).
            Sur mobile, largeur intrinsèque + avatar aligné en HAUT (`items-start`)
            sur le haut du nom, car le bloc texte y est plus haut (lignes wrappées).
            Avatar collé à gauche. */}
        {photoUrl ? (
          <div className="flex items-start md:flex-1 md:items-center">
            {/*
              MASQUE CIRCULAIRE AJUSTABLE.
              Pour recadrer la photo DANS le cercle sans retoucher le fichier,
              modifie ces 3 variables sur le conteneur ci-dessous :
                [--avatar-x:50%]    pan horizontal (0% = gauche … 100% = droite)
                [--avatar-y:50%]    pan vertical   (0% = haut   … 100% = bas)
                [--avatar-zoom:1]   zoom (1 = ajusté · 1.15 = plus serré · 0.9 = recule)
            */}
            <div
              className={`overflow-hidden rounded-full border-2 border-blue-400/40 [--avatar-x:50%] [--avatar-y:50%] [--avatar-zoom:1] ${
                compactPrint
                  ? 'h-16 w-16 print:h-16 print:w-16'
                  : 'h-20 w-20 print:h-28 print:w-28 md:h-28 md:w-28 lg:h-36 lg:w-36'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt={name}
                className="h-full w-full object-cover [object-position:var(--avatar-x)_var(--avatar-y)] [transform:scale(var(--avatar-zoom))]"
              />
            </div>
          </div>
        ) : null}

        {/* Bloc droit : nom + rôle + âge + coordonnées, alignés à droite.
            `flex-1` → même largeur que le bloc photo (ou toute la largeur sans photo). */}
        <div className="flex flex-1 flex-col items-end text-right">
          <h1
            className={`font-extrabold leading-tight text-blue-400 ${
              compactPrint
                ? 'text-3xl print:text-3xl print:leading-tight md:text-5xl md:leading-none lg:text-7xl'
                : photoUrl
                ? // Avec la photo, dès md: le bloc droit ne fait que la moitié de la
                  // largeur : tailles réduites + nowrap (md+) pour 1 ligne. Sur mobile,
                  // le texte peut wrapper (sinon il déborde de l'écran).
                  'text-3xl print:text-5xl print:leading-none md:whitespace-nowrap md:text-4xl md:leading-none lg:text-6xl'
                : 'text-3xl print:text-7xl print:leading-none md:text-5xl md:leading-none lg:text-7xl'
            }`}
          >
            {name}
          </h1>
          <p
            className={`mt-1 text-lg leading-snug text-cv-section md:mt-3 md:leading-normal ${
              photoUrl ? 'md:text-2xl' : 'md:text-3xl'
            } ${
              compactPrint
                ? 'print:mt-0.5 print:text-base print:leading-snug'
                : photoUrl
                ? // Bloc droit à 50 % : rôle nowrap + un cran plus petit pour tenir sur 1 ligne en PDF.
                  'print:mt-2 print:whitespace-nowrap print:text-2xl print:leading-normal'
                : 'print:mt-3 print:text-3xl print:leading-normal'
            }`}
          >
            {role}
          </p>
          {ageText ? (
            <p
              className={`mt-1 text-base leading-snug text-rose-300 md:mt-2 md:text-xl ${
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
