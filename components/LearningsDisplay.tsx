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
        className="border-b border-teal-300/50 pb-1 text-2xl font-semibold text-teal-300"
      />
      <ul className="cv-section-simple-list cv-cq-link-list max-md:mt-6">
        {items.map((learning) => (
          <li className="text-teal-300" key={learning.id}>
            <CustomLink
              name={learningLinkLabel(learning)}
              link={learning.link}
              className="text-teal-300 print:!text-teal-300"
            />
            {learning.description ? (
              <span className="cv-learning-desc ml-1 text-sm text-cv-body-muted">
                — {learning.description}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
