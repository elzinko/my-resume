import Study from '@/components/study';
import { getDataWithLocal, graphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import { Locale } from 'i18n-config';
import React from 'react';

const query = gql`
  query getAllStudies($lang: SiteLocale) {
    allStudiesModels(locale: $lang) {
      id
      name
      startDate
      endDate
      establishment
      location
    }
  }
`;

export default async function studies(locale: Locale) {
  const data = await getDataWithLocal(locale, query);
  return (
    <section id="studies" className="mt-10 break-before-page">
      <h2 className="border-b pb-1 text-2xl font-semibold text-teal-300">
        Studies
      </h2>
      <ul className="mt-4">
        {data?.allStudiesModels?.map((study: any) => (
          <li key={study.id} className="pt-2">
            <Study study={study} />
          </li>
        ))}
      </ul>
    </section>
  );
}
