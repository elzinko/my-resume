import Skill from '@/components/skill';
import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function skills({ locale }: { locale: Locale }) {
  const data: any = await getCvData(locale);
  return (
    <section id="skills" className="mt-10">
      <h2 className="border-b pb-1 text-2xl font-semibold text-cv-tag-text">
        {data?.skillsTitle?.title}
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {data?.allSkillsModels?.map((skill: any) => (
          <Skill key={skill.id} skill={skill} />
        ))}
      </div>
    </section>
  );
}
