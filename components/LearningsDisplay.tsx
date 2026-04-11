'use client';

import React from 'react';
import CustomLink from '@/components/CustomLink';
import { learningLinkLabel } from '@/lib/learning-label';

export interface LearningItem {
  id: string;
  name: string;
  link: string;
  description?: string;
}

interface LearningsDisplayProps {
  title: string;
  items: LearningItem[];
}

export default function LearningsDisplay({
  title,
  items,
}: LearningsDisplayProps) {
  return (
    <>
      <h2 className="border-b pb-1 text-2xl font-semibold text-teal-300">
        {title}
      </h2>
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
