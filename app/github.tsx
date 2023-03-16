import { graphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import React from 'react';

const query = gql`
  {
    github {
      url
    }
  }
`;

async function getData() {
  const data: any = await graphQLClient.request(query);
  console.log(data);
  return data;
}

export default async function Github() {
  const data: any = await getData();
  return (
    <>
      <strong className="text-xl font-medium">Github</strong>
      <a href={data.github?.url}>
        <ul className="mt-2 mb-10 flex w-full">
          <li className="mt-2 w-3/12 rounded-tl-lg rounded-bl-lg bg-pink-600 px-2 text-center text-white">
            BACK
          </li>
          <li className="mt-2 w-3/12 bg-blue-600 px-2 text-center text-white">
            FRONT
          </li>
          <li className="mt-2 w-3/12 rounded-tr-lg rounded-br-lg bg-yellow-500 px-2 text-center text-white">
            DEVOPS
          </li>
        </ul>
      </a>
    </>
  );
}
