import CustomLink from '@/components/customLink';
import { getDataWithLocal } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import { Locale } from 'i18n-config';
import React from 'react';

const query = gql`
  query getAllLearnings($lang: SiteLocale) {
    learningsTitle(locale: $lang) {
      title
    }
    allLearningsModels(locale: en) {
      id
      name
      link
    }
  }
`;

export default async function learnings(locale: Locale) {
  const data: any = await getDataWithLocal(locale, query);
  return (
    <section id="learnings" className="mt-10">
      <h2 className="border-b pb-1 text-2xl font-semibold text-teal-300">
        {data?.learningsTitle?.title}
      </h2>
      <ul className="mt-4">
        {data?.allLearningsModels.map((learning: any) => (
          <li className="mt-1 text-teal-300" key={learning.id}>
            <CustomLink name={learning.name} link={learning.link} />
          </li>
        ))}
      </ul>
    </section>
  );
}
