import CustomLink from '@/components/customLink';
import { graphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import React from 'react';

const query = gql`
  {
    allLearningsModels {
      id
      name
      link
    }
  }
`;

async function getData() {
  const data: any = await graphQLClient.request(query);
  console.log(data);
  return data;
}

export default async function learnings() {
  const data: any = await getData();
  return (
    <section id="learning" className="mt-10">
      <h2 className="border-b pb-1 text-2xl font-semibold text-teal-300">
        Learnings
      </h2>
      <ul className="mt-4">
        {data?.allLearningsModels.map((learning: any) => (
          <li className="mt-1" key={learning.id}>
            <CustomLink name={learning.name} link={learning.link} />
          </li>
        ))}
      </ul>
    </section>
  );
}