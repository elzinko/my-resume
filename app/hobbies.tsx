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

export default async function hobbies() {
  const data: any = await getData();
  return (
    <section id="hobbies" className="mt-10">
      <h2 className="border-b pb-1 text-2xl font-semibold">Hobbies</h2>
      <ul className="mt-2">
        {data.allHobbiesModels.map((hobby: any) => (
          <li className="mt-1 px-2" key={hobby.id}>
            <CustomLink name={hobby.name} link={hobby.link} />
          </li>
        ))}
      </ul>
    </section>
  );
}
