'use client';

import React from 'react';
import CustomLink from '@/components/CustomLink';
import SectionHeadingAts from '@/components/SectionHeadingAts';
import { learningLinkLabel } from '@/lib/learning-label';
import { formatEntryPeriod } from '@/lib/date';
import type { Locale } from 'i18n-config';

export interface LearningItem {
  id: string;
  name: string;
  link: string;
  description?: string;
  startDate?: string;
  endDate?: string | null;
}

interface LearningsDisplayProps {
  title: string;
  items: LearningItem[];
  locale?: Locale;
}

export default function LearningsDisplay({
  title,
  items,
  locale = 'fr',
}: LearningsDisplayProps) {
  return (
    <>
      <SectionHeadingAts
        section="learnings"
        locale={locale}
        title={title}
        accent="teal"
      />
      <ul className="cv-section-simple-list max-md:mt-6">
        {items.map((learning) => {
          // Année d'apprentissage collée à droite (slot `year` de `.cv-entry`),
          // « depuis AAAA » si en cours (ex. LLM). Titre (L1) puis détail (L2) en
          // mobile ; inline « titre — détail · année » en desktop/print (.cv-entry).
          const period = formatEntryPeriod(
            learning.startDate,
            learning.endDate,
            locale,
          );
          return (
            <li className="cv-entry text-teal-300" key={learning.id}>
              <span className="cv-entry-title">
                <CustomLink
                  name={learningLinkLabel(learning)}
                  link={learning.link}
                  className="text-teal-300 print:!text-teal-300"
                />
              </span>
              {learning.description ? (
                <span className="cv-entry-detail text-sm text-cv-body-muted">
                  {learning.description}
                </span>
              ) : null}
              {/* Année APRÈS le détail (ordre DOM = titre → détail → année, comme
                  Études) : sans effet en grille (slot `year`), correct si un jour
                  l'entrée passe inline (le `·` s'attache à l'année, pas au détail). */}
              {period ? (
                <span className="cv-entry-year tabular-nums text-teal-300 print:!text-teal-300">
                  {period}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </>
  );
}
