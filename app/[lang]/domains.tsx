import Domain from '@/components/domain';
import Skill from '@/components/domain';
import { getDataWithLocal } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import { Locale } from 'i18n-config';
import React from 'react';

const query = gql`
  query getAllDomains($lang: SiteLocale) {
    allDomainsModels(locale: $lang) {
      id
      name
      description
      position
      competencies {
        id
        name
        link
      }
    }
  }
`;

export default async function domains(locale: Locale) {
  const data = await getDataWithLocal(locale, query);
  return (
    <section id="domains" className="mt-10">
      <div className="flex w-full columns-1 flex-col md:columns-3 md:flex-row md:space-x-6">
        {data?.allDomainsModels?.map((domain: any) => (
          <Domain key={domain.id} domain={domain} />
        ))}
      </div>
    </section>
  );
}
