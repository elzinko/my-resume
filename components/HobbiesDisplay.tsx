'use client';

import React from 'react';
import CustomLink from '@/components/CustomLink';
import SectionHeadingAts from '@/components/SectionHeadingAts';
import { formatEntryPeriod } from '@/lib/date';
import type { Locale } from 'i18n-config';

export interface HobbyItem {
  id: string;
  name: string;
  link: string;
  description?: string;
  startDate?: string;
  endDate?: string | null;
}

interface HobbiesDisplayProps {
  title: string;
  items: HobbyItem[];
  locale?: Locale;
}

export default function HobbiesDisplay({
  title,
  items,
  locale = 'fr',
}: HobbiesDisplayProps) {
  return (
    <>
      <SectionHeadingAts
        section="hobbies"
        locale={locale}
        title={title}
        accent="orange"
      />
      <ul className="cv-section-simple-list max-md:mt-6">
        {items.map((hobby) => {
          // Période « depuis AAAA » collée à droite (slot `year` de `.cv-entry`),
          // comme Projets/Études : loisir = activité en cours → fin ouverte.
          const period = formatEntryPeriod(
            hobby.startDate,
            hobby.endDate,
            locale,
          );
          return (
            <li className="cv-entry text-orange-300" key={hobby.id}>
              <span className="cv-entry-title">
                <CustomLink
                  name={hobby.name}
                  link={hobby.link}
                  className="text-orange-300 print:!text-orange-300"
                />
              </span>
              {hobby.description ? (
                <span className="cv-entry-detail cv-hobby-desc text-sm text-cv-body-muted">
                  {hobby.description}
                </span>
              ) : null}
              {/* Année APRÈS le détail (ordre DOM cohérent avec Études). */}
              {period ? (
                <span className="cv-entry-year tabular-nums text-orange-300 print:!text-orange-300">
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
