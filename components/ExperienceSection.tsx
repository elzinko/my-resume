'use client';

import React, { useState } from 'react';
import type { Locale } from 'i18n-config';
import SectionHeadingAts from './SectionHeadingAts';
import type { AtsSectionKey } from '@/lib/ats-labels';

interface ExperienceSectionProps {
  /** Clé de section ATS (libellé EN canonique bilingue dans le `<h2>`). */
  section: AtsSectionKey;
  title: string;
  locale: Locale;
  /**
   * Affiche le bouton « Masquer les détails » (écran uniquement, jamais à l'impression).
   * N'a de sens qu'en mode `full` (sinon il n'y a aucun détail à masquer).
   */
  canToggleDetails: boolean;
  /** Les `<li>` des expériences (Server Components). */
  children: React.ReactNode;
}

/**
 * En-tête du bloc Expériences + liste.
 *
 * Le bouton « Masquer les détails » est un confort **écran uniquement** : il pose la classe
 * `cv-hide-job-details` sur la liste, qui masque les `.cv-job-detail` à l'écran. L'impression
 * (PDF) ignore ce bouton et suit le paramètre `?detail=` (cf. styles/globals.css).
 */
export default function ExperienceSection({
  section,
  title,
  locale,
  canToggleDetails,
  children,
}: ExperienceSectionProps) {
  const [detailsHidden, setDetailsHidden] = useState(false);
  const labels =
    locale === 'en'
      ? { hide: 'Hide details', show: 'Show details' }
      : { hide: 'Masquer les détails', show: 'Afficher les détails' };

  return (
    <>
      <div className="flex items-end justify-between gap-2 border-b border-cv-jobs/25 pb-1 print:break-after-avoid">
        <SectionHeadingAts
          section={section}
          locale={locale}
          title={title}
          accent="pink"
          withBorder={false}
          className="min-w-0"
        />
        {canToggleDetails ? (
          <button
            type="button"
            onClick={() => setDetailsHidden((v) => !v)}
            aria-pressed={detailsHidden}
            className="hidden shrink-0 self-center rounded border border-pink-300/40 px-2 py-0.5 text-xs font-medium text-cv-jobs transition-colors hover:bg-pink-300/10 print:!hidden lg:inline-flex"
          >
            {detailsHidden ? labels.show : labels.hide}
          </button>
        ) : null}
      </div>
      <ul
        className={`cv-section-body-gap space-y-4 print:space-y-4 ${
          detailsHidden ? 'cv-hide-job-details' : ''
        }`}
      >
        {children}
      </ul>
    </>
  );
}
