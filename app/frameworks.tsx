import React from 'react';
import { graphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import MainSkill from '@/components/skill';
import Framework from '@/components/framework';

const query = gql`
  {
    allFrameworksModels {
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

export default async function frameworks() {
  const data: any = await getData();
  return (
    <>
      <strong className="text-xl font-medium">Skills</strong>
      <ul className="mt-2 mb-10">
        {data?.allFrameworksModels.map((framework: any) => (
          <li className="mt-1 px-2" key={framework.id}>
            <Framework framework={framework} key={framework.id} />
          </li>
        ))}
      </ul>
    </>
  );
}
