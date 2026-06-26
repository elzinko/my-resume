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
  // classe de marge pilote rôle ET âge, donc nom→rôle == rôle→âge partout
  // (mobile, desktop, impression). Règle générale = une seule source.
  // NB : à la largeur A4, `md:` l'emporte sur `print:` → le PDF suit `md:mt-2`
  // (inutile d'ajouter un `print:mt-*` ici, il serait mort).
  const lineGap = 'mt-1 md:mt-2';
  return (
    <div
      className={`header-content pb-0 pt-2 max-md:pt-0 md:py-12 ${
        compactPrint ? 'print:py-8' : 'print:!py-2'
      }`}
    >
      <div className="flex w-full items-stretch gap-4 print:gap-4 md:gap-6">
        {/* Bloc photo — placé à l'OPPOSÉ du titre : titre à gauche → photo à droite,
            titre à droite (`?headerAlign=right`) → photo à gauche (`order-first`).
            Dès `md:`, même largeur que le bloc texte (`md:flex-1`), avatar centré. */}
        {photoUrl ? (
          <div
            className={`flex items-start md:items-center ${
              align === 'right' ? 'order-first' : ''
            }`}
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
        <div
          className={`flex flex-1 flex-col items-start text-left ${
            align === 'left' ? 'order-first' : ''
          } ${align === 'right' ? 'md:items-end md:text-right' : ''}`}
        >
          <h1
            data-cv-id="fullname"
            className={`font-extrabold leading-tight text-[#4e94f8] ${
              compactPrint
                ? // CV court : proportions proches du PDF (titre modéré, équilibré
                  // avec la petite photo) plutôt qu'un text-7xl géant sur l'écran.
                  'text-3xl print:text-3xl md:text-4xl'
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
            data-cv-id="title"
            className={`${lineGap} text-lg leading-snug text-[#fca658] md:leading-normal ${
              photoUrl ? 'md:text-2xl' : 'md:text-3xl'
            } ${
              compactPrint
                ? 'print:text-base print:leading-snug'
                : photoUrl
                ? // Bloc droit à 50 % : rôle nowrap + un cran plus petit pour tenir sur 1 ligne en PDF.
                  'print:whitespace-nowrap print:text-2xl print:leading-normal'
                : 'print:text-3xl print:leading-normal'
            }`}
          >
            {role}
          </p>
          {ageText ? (
            <p
              data-cv-id="age"
              className={`${lineGap} text-base leading-snug text-[#22c68d] md:text-xl ${
                compactPrint ? 'print:text-xs' : 'print:text-lg'
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
      </div>
    </div>
  );
}
