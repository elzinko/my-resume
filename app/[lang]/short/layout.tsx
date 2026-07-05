import React from 'react';

/**
 * Layout du CV court — transparent depuis ADR-0006 (vue mobile indépendante).
 *
 * L'enveloppe A4 (`cv-print-preview` + `cv-short-page mx-auto max-w-[800px]` + zoom)
 * n'est PLUS posée ici : elle est portée par la **branche desktop/impression** dans
 * `page.tsx`. Raison : sur mobile, `/short` rend désormais la vue COMPLÈTE
 * (`OfferTailoredShell`, identique à `/[lang]`) — elle ne doit pas hériter du cadrage
 * A4 du court (tokens d'espacement densifiés, largeur 800px, zoom). Seule la branche
 * desktop/impression (le vrai CV court A4) reste enveloppée.
 */
export default function ShortCvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
