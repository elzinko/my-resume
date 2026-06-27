import React from 'react';

/**
 * Wrapper du CV court. La largeur/échelle est désormais gérée par `ScaledA4`
 * (dans `ShortPageWrapper`) : le document A4 à largeur fixe (794px) est zoomé
 * pour remplir l'écran (`print=0`) ou affiché à sa taille réelle 21 cm
 * (`print=1`). La classe `.cv-short-page` (cible du CSS `@page short`) est portée
 * par le document à l'intérieur de `ScaledA4`. Ce layout reste un simple passe-plat.
 */
export default function ShortCvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
