import Study from '@/components/study';
import { graphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import React from 'react';

const query = gql`
  {
    allStudiesModels {
      id
      name
      startDate
      endDate
      establishment
      location
    }
  }
`;

async function getData() {
  const data: any = await graphQLClient.request(query);
  console.log(data);
  return data;
}

export default async function studies() {
  const data = await getData();
  return (
    <section id="studies" className="mt-10 break-before-page">
      <h2 className="border-b pb-1 text-2xl font-semibold">Studies</h2>
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
