import { getData } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import React from 'react';

const query = gql`
  {
    github {
      url
    }
  }
`;

export default async function Github() {
  const data: any = await getData(query);
  return (
    <>
      <strong className="text-xl font-medium">Github</strong>
      <a href={data.github?.url}>
        <ul className="mb-10 mt-4 flex w-full">
          <li className="mt-4 w-3/12 rounded-bl-lg rounded-tl-lg bg-pink-600 px-2 text-center text-white">
            BACK
          </li>
          <li className="mt-4 w-3/12 bg-blue-400 px-2 text-center text-white">
            FRONT
          </li>
          <li className="mt-4 w-3/12 rounded-br-lg rounded-tr-lg bg-yellow-500 px-2 text-center text-white">
            DEVOPS
          </li>
        </ul>
      </a>
    </>
  );
}
