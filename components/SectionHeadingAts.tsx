import React from 'react';
import type { Locale } from 'i18n-config';
import { atsSectionLabel, type AtsSectionKey } from '@/lib/ats-labels';

/**
 * Accent d'une section : pilote À LA FOIS la couleur du titre ET la couleur du
 * filet (toujours atténué, discret). Source unique de cohérence — aucune section
 * ne doit redéfinir son filet à la main (c'est ce qui faisait dériver Études /
 * Projets / Expériences vers un gris incohérent).
 */
export type SectionAccent =
  | 'blue' // Profil / Résumé, Domaines
  | 'emerald' // Coordonnées
  | 'orange' // Adéquation, Loisirs
  | 'purple' // Études
  | 'pink' // Expériences (cv-jobs)
  | 'tag' // Projets, Compétences (cv-tag-text)
  | 'teal' // Apprentissages
  | 'section'; // legacy cv-section (turquoise)

/**
 * Atténuation unique du filet : `/25` au lieu de `/50` → trait discret, même
 * teinte que le titre. Changer cette valeur ici la change pour TOUT le CV.
 * (Classes littérales obligatoires pour le purge Tailwind — pas d'interpolation.)
 */
const ACCENT_CLASSES: Record<SectionAccent, { text: string; border: string }> =
  {
    blue: { text: 'text-blue-400', border: 'border-blue-400/25' },
    emerald: { text: 'text-emerald-400', border: 'border-emerald-400/25' },
    orange: { text: 'text-orange-300', border: 'border-orange-300/25' },
    purple: { text: 'text-purple-300', border: 'border-purple-300/25' },
    pink: { text: 'text-cv-jobs', border: 'border-cv-jobs/25' },
    tag: { text: 'text-cv-tag-text', border: 'border-cv-tag-text/25' },
    teal: { text: 'text-teal-300', border: 'border-teal-300/25' },
    section: { text: 'text-cv-section', border: 'border-cv-section/25' },
  };

interface SectionHeadingAtsProps {
  /** Clé ATS pour le libellé anglais (PDF). Omis = pas de libellé ATS (ex. Adéquation). */
  section?: AtsSectionKey;
  locale: Locale;
  /** Titre localisé affiché en principal (français sur `/fr`). */
  title?: string | null;
  /** Couleur de section : titre + filet atténué. Cohérence garantie par le composant. */
  accent: SectionAccent;
  /**
   * `false` : le composant ne rend PAS son filet (le parent le porte). Réservé aux
   * en-têtes composés (ex. Expériences avec bouton « afficher les détails »).
   */
  withBorder?: boolean;
  /** Classes additionnelles (min-w-0, hidden, marges, tailles print…). Pas la couleur ni le filet. */
  className?: string;
}

/**
 * Titre de section canonique du CV.
 *
 * - Couleur du titre + filet atténué pilotés par `accent` (source unique).
 * - Sur `/en` (ou sans `section`), rend simplement `<h2>{title}</h2>` stylé.
 * - Sur `/fr`, ajoute l'équivalent ATS anglais canonique reconnu par les parseurs,
 *   **uniquement à l'impression** (`hidden print:inline`) : présent dans la couche
 *   texte du PDF pour les ATS, mais SANS doublon visible à l'écran pour un humain.
 *   Texte réel sans letter-spacing (sinon « E D U C… » à l'extraction).
 */
export default function SectionHeadingAts({
  section,
  locale,
  title,
  accent,
  withBorder = true,
  className,
}: SectionHeadingAtsProps) {
  const { text, border } = ACCENT_CLASSES[accent];
  const base = `${
    withBorder ? `border-b ${border} ` : ''
  }pb-1 text-2xl font-semibold ${text}`;
  const ats = section ? atsSectionLabel(section, locale, title) : null;

  // TOUJOURS un `<h2 flex>` (même sans libellé ATS) : sinon un titre simple
  // (block) et un titre avec label (flex) n'ont pas la même hauteur de boîte →
  // leurs filets se désalignent d'une colonne à l'autre (ex. Adéquation vs
  // Expérience). Le span ATS reste conditionnel et masqué hors impression.
  return (
    <h2
      className={`${base} ${
        className ?? ''
      } flex items-baseline justify-between gap-3`}
    >
      <span className="min-w-0">{title}</span>
      {ats ? (
        <span className="hidden shrink-0 whitespace-nowrap text-[0.5em] font-normal leading-none opacity-60 print-preview:inline print:inline">
          {ats}
        </span>
      ) : null}
    </h2>
  );
}
