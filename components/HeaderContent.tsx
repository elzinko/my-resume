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
  /**
   * Alignement du bloc titre (nom / rôle / âge). Défaut `left` sur TOUTES les vues
   * (court / complet / impression) ; `right` = aligné à droite en desktop/print
   * (param `?headerAlign=right`). La barre décorative reste toujours à droite.
   */
  align?: 'left' | 'right';
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
  align = 'left',
}: HeaderContentProps) {
  // Rythme vertical UNIFORME entre les 3 lignes (nom → rôle → âge) : la MÊME
  // classe pilote rôle ET âge, donc nom→rôle == rôle→âge partout.
  // CV court (compactPrint) = document A4 : on N'utilise PAS de bump `md:`
  // (qui grossit le web mais saute à l'impression, où Chrome évalue les
  // media-queries sous 768px) → le web rend EXACTEMENT les tailles du PDF.
  // CV complet : conserve son rythme web responsive (mt-1 md:mt-2).
  const lineGap = compactPrint ? 'mt-2' : 'mt-1 md:mt-2';
  return (
    <div
      className={`header-content ${
        compactPrint
          ? // A4 : tailles internes = PDF, mais à l'ÉCRAN on garde de l'air au-
            // dessus (entre la barre d'outils et le nom). À l'impression, pas de
            // barre d'outils → pt-0 (la marge @page suffit). pb fixe = PDF.
            'pb-8 pt-8 print:pt-0'
          : 'pb-0 pt-2 max-md:pt-0 md:py-12 print:!py-2'
      }`}
    >
      <div className="flex w-full items-stretch gap-4 md:gap-6 print:gap-4">
        {/* Bloc photo — placé à l'OPPOSÉ du titre : titre à gauche → photo à droite,
            titre à droite (`?headerAlign=right`) → photo à gauche (`order-first`).
            Dès `md:`, même largeur que le bloc texte (`md:flex-1`), avatar centré. */}
        {photoUrl ? (
          <div
            className={`flex ${
              compactPrint ? 'items-center' : 'items-start md:items-center'
            } ${align === 'right' ? 'order-first' : ''}`}
          >
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
                  ? // A4 : si l'âge est présent, la photo est sensiblement plus
                    // haute (≈ hauteur du bloc nom+rôle+âge) pour « prendre en
                    // compte » l'âge ; sinon elle ne couvre que 2 lignes. Taille
                    // FIXE (pas de stretch → pas de dépendance circulaire avec la
                    // largeur du texte). Centrée verticalement (items-center).
                    ageText
                    ? 'h-[72px] w-[72px]'
                    : 'h-16 w-16'
                  : 'h-20 w-20 md:h-28 md:w-28 lg:h-36 lg:w-36 print:h-28 print:w-28'
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
        <div
          className={`flex flex-1 flex-col items-start text-left ${
            align === 'left' ? 'order-first' : ''
          } ${align === 'right' ? 'md:items-end md:text-right' : ''}`}
        >
          <h1
            data-cv-id="fullname"
            className={`font-extrabold leading-tight text-[#4e94f8] ${
              compactPrint
                ? // A4 : taille fixe = PDF (text-3xl, 30px). Aucun bump md: qui
                  // grossirait le web. leading-none → écart visuel = la marge
                  // (rythme identique entre les 3 lignes). `!` pour battre le
                  // leading-tight de base partagé avec le CV complet.
                  'text-3xl !leading-none'
                : photoUrl
                ? // Mobile : text-2xl (24px) → « Thomas Couderc » tient sur 1 ligne
                  // même sur un petit écran (375px). md+ : tailles d'origine.
                  'text-2xl md:whitespace-nowrap md:text-4xl md:leading-none lg:text-6xl print:text-4xl print:leading-none'
                : 'text-2xl md:text-5xl md:leading-none lg:text-7xl print:text-5xl print:leading-none'
            }`}
          >
            {name}
          </h1>
          <p
            data-cv-id="title"
            className={
              compactPrint
                ? // A4 : taille fixe = PDF (text-base, 16px), pas de bump md:.
                  `${lineGap} text-base leading-none text-[#fca658]`
                : `${lineGap} text-lg leading-snug text-[#fca658] md:leading-normal ${
                    photoUrl ? 'md:text-2xl' : 'md:text-3xl'
                  } ${
                    photoUrl
                      ? // Bloc droit à 50 % : rôle nowrap + un cran plus petit pour tenir sur 1 ligne en PDF.
                        'print:whitespace-nowrap print:text-xl print:leading-normal'
                      : 'print:text-2xl print:leading-normal'
                  }`
            }
          >
            {role}
          </p>
          {ageText ? (
            <p
              data-cv-id="age"
              className={
                compactPrint
                  ? // A4 : taille fixe = PDF (text-xs, 12px), pas de bump md:.
                    `${lineGap} text-xs leading-none text-[#22c68d]`
                  : `${lineGap} text-base leading-snug text-[#22c68d] md:text-xl print:text-base`
              }
            >
              {ageText}
            </p>
          ) : null}
          {belowRole ? (
            <div className="mt-1 hidden w-full md:mt-2 md:block print:mt-2 print:block">
              {belowRole}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
