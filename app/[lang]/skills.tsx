import Pill from '@/components/Pill';
import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function skills({
  locale,
  sectionId = 'skills',
  className = '',
}: {
  locale: Locale;
  sectionId?: string | false;
  className?: string;
}) {
  const data: any = await getCvData(locale);
  const sectionClass = [
    className || 'mt-10',
    /** Desktop colonne gauche ; masqué mobile (tags sous domaines) ; masqué PDF / aperçu `?print`. */
    'max-md:hidden max-md:mt-0 md:order-[2] md:block print:hidden print-preview:hidden',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      id={sectionId === false ? undefined : sectionId}
      className={sectionClass}
    >
      <h2 className="border-b pb-1 text-2xl font-semibold text-cv-tag-text">
        {data?.skillsTitle?.title}
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {data?.allSkillsModels?.map((skill: any) => (
          <Pill key={skill.id} color="skill" href={skill.link}>{skill.name}</Pill>
        ))}
      </div>
    </section>
  );
}
