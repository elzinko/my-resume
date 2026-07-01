'use client';

import React from 'react';
import CustomLink from '@/components/CustomLink';
import SectionHeadingAts from '@/components/SectionHeadingAts';
import { learningLinkLabel } from '@/lib/learning-label';
import type { Locale } from 'i18n-config';

export interface LearningItem {
  id: string;
  name: string;
  link: string;
  description?: string;
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
        {items.map((learning) => (
          // Pas d'année pour les apprentissages : titre (L1) puis détail (L2 sans
          // tiret) en mobile ; inline « titre — détail » en desktop/print (.cv-entry).
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
          </li>
        ))}
      </ul>
    </>
  );
}
