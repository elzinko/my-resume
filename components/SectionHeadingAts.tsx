import React from 'react';
import type { Locale } from 'i18n-config';
import { atsSectionLabel, type AtsSectionKey } from '@/lib/ats-labels';

interface SectionHeadingAtsProps {
  /** Clé de section pour retrouver le libellé ATS canonique. */
  section: AtsSectionKey;
  locale: Locale;
  /** Titre localisé affiché en principal (français sur `/fr`). */
  title?: string | null;
  /** Classes du `<h2>` existant (couleur de section, bordure, modifs print…). */
  className?: string;
}

/**
 * Titre de section bilingue « discret ».
 *
 * Sur `/en` (ou quand aucun libellé ATS n'est pertinent), rend EXACTEMENT
 * `<h2 className={className}>{title}</h2>` — donc strictement identique à
 * l'ancien markup : aucune régression visuelle.
 *
 * Sur `/fr`, ajoute l'équivalent anglais canonique reconnu par les ATS, en
 * petit, muet, aligné à droite sur la même ligne (coût vertical nul → pas de
 * page supplémentaire). C'est un nœud texte réel (présent dans la couche texte
 * du PDF, contrairement à un `::before`/`aria-label`) et SANS letter-spacing,
 * qui ferait éclater le mot lettre par lettre à l'extraction (« E D U C… »).
 */
export default function SectionHeadingAts({
  section,
  locale,
  title,
  className,
}: SectionHeadingAtsProps) {
  const ats = atsSectionLabel(section, locale, title);
  if (!ats) {
    return <h2 className={className}>{title}</h2>;
  }
  return (
    <h2
      className={`${className ?? ''} flex items-baseline justify-between gap-3`}
    >
      <span className="min-w-0">{title}</span>
      <span className="shrink-0 whitespace-nowrap text-[0.5em] font-normal opacity-60">
        {ats}
      </span>
    </h2>
  );
}
