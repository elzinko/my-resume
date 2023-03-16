import Domain from '@/components/domain';
import Skill from '@/components/domain';
import { graphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import React from 'react';

const query = gql`
  {
    allDomainsModels {
      id
      name
      description
      position
    }
  }
`;

async function getData() {
  const data: any = await graphQLClient.request(query);
  console.log(data);
  return data;
}

export default async function domains() {
  const data = await getData();
  return (
    <section id="skills" className="mt-10">
      <div className="flex w-full columns-1 flex-col md:columns-3 md:flex-row md:space-x-6">
        {data?.allDomainsModels?.map((domain: any) => (
          <Domain key={domain.id} domain={domain} />
        ))}
      </div>
    </section>
  );
}
