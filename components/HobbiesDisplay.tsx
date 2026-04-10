'use client';

import React from 'react';
import CustomLink from '@/components/customLink';

export interface HobbyItem {
  id: string;
  name: string;
  link: string;
  description?: string;
}

interface HobbiesDisplayProps {
  title: string;
  items: HobbyItem[];
}

export default function HobbiesDisplay({ title, items }: HobbiesDisplayProps) {
  return (
    <>
      <h2 className="border-b pb-1 text-2xl font-semibold text-orange-300">
        {title}
      </h2>
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
