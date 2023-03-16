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
    <>
      <strong className="text-xl font-medium">Currently learning</strong>
      <ul className="mt-2 mb-10">
        {data?.allLearningsModels.map((learning: any) => (
          <li className="mt-1 px-2" key={learning.id}>
            <CustomLink name={learning.name} link={learning.link} />
          </li>
        ))}
      </ul>
    </>
  );
}
