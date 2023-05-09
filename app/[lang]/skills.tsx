import Skill from '@/components/skill';
import { getDataWithLocal, graphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import { Locale } from 'i18n-config';
import React from 'react';

const query = gql`
  query getAllSkills($lang: SiteLocale) {
    skillsTitle(locale: $lang) {
      title
    }
    allSkillsModels(locale: $lang) {
      id
      name
      link
    }
  }
`;

export default async function skills(locale: Locale) {
  const data = await getDataWithLocal(locale, query);
  return (
    <section id="skills" className="mt-10">
      <h2 className="border-b pb-1 text-2xl font-semibold text-blue-300">
        {data?.skillsTitle?.title}
      </h2>
      <div className="mt-4 grid grid-cols-3 gap-x-4 gap-y-4 md:grid-cols-1">
        {data?.allSkillsModels?.map((skill: any) => (
          <Skill key={skill.id} skill={skill} />
        ))}
      </div>
    </section>
  );
}
