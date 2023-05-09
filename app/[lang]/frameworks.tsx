import React from 'react';
import { getData } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import Framework from '@/components/framework';

const query = gql`
  query getAllFrameworks($lang: SiteLocale) {
    allFrameworksModels(locale: $lang) {
      name
      link
    }
  }
`;

export default async function frameworks() {
  const data: any = await getData(query);
  return (
    <>
      <strong className="text-xl font-medium">Skills</strong>
      <ul className="mb-10 mt-4">
        {data?.allFrameworksModels.map((framework: any) => (
          <li className="mt-1 px-2" key={framework.id}>
            <Framework framework={framework} key={framework.id} />
          </li>
        ))}
      </ul>
    </>
  );
}
