'use client';

import React from 'react';
import CustomLink from '@/components/CustomLink';
import SectionHeadingAts from '@/components/SectionHeadingAts';
import type { Locale } from 'i18n-config';

export interface HobbyItem {
  id: string;
  name: string;
  link: string;
  description?: string;
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
        className="border-b pb-1 text-2xl font-semibold text-orange-300"
      />
      <ul className="cv-section-simple-list cv-cq-link-list max-md:mt-6">
        {items.map((hobby) => (
          <li className="text-orange-300" key={hobby.id}>
            <CustomLink
              name={hobby.name}
              link={hobby.link}
              className="text-orange-300 print:!text-orange-300"
            />
            {hobby.description ? (
              <span className="cv-hobby-desc ml-1 text-sm text-cv-body-muted">
                — {hobby.description}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
