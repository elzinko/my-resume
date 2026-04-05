import CustomLink from '@/components/customLink';
import { getCvData } from '@/lib/cv-data';
import { learningLinkLabel } from '@/lib/learning-label';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function learnings({ locale }: { locale: Locale }) {
  const data: any = await getCvData(locale);
  const items = data?.allLearningsModels ?? [];
  return (
    <section id="learnings" className="mt-10">
      <h2 className="border-b pb-1 text-2xl font-semibold text-teal-300">
        {data?.learningsTitle?.title}
      </h2>
      <ul className="cv-section-simple-list">
        {items.map((learning: any) => (
          <li className="text-teal-300" key={learning.id}>
            <CustomLink
              name={learningLinkLabel(learning)}
              link={learning.link}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
