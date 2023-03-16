import CustomLink from '@/components/customLink';
import { graphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import React from 'react';

const query = gql`
  {
    allHobbiesModels {
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

export default async function interests() {
  const data: any = await getData();
  return (
    <>
      <strong className="text-xl font-medium">Interests & Hobbies</strong>
      <ul className="mt-2">
        {data.allHobbiesModels.map((hobby: any) => (
          <li className="mt-1 px-2" key={hobby.id}>
            <CustomLink name={hobby.name} link={hobby.link} />
          </li>
        ))}
      </ul>
    </>
  );
}
