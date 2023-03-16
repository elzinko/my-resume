import LogoGithub from '@/components/logoGithub';
import LogoLinkedin from '@/components/LogoLinkedin';
import LogoMalt from '@/components/logoMalt';
import { graphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import React from 'react';

const query = gql`
  {
    header {
      id
      name
      role
    }
  }
`;

async function getData() {
  const data: any = await graphQLClient.request(query);
  console.log(data);
  return data;
}

export default async function Header() {
  const data: any = await getData();
  return (
    <header>
      <ul className="flex flex-wrap justify-end gap-2">
        <li>
          <LogoLinkedin />
        </li>
        <li>
          <LogoGithub />
        </li>
        <li>
          <LogoMalt />
        </li>
      </ul>
      <div className="flex items-center justify-between py-20">
        <div className="grid justify-items-end">
          <h1 className="text-4xl font-extrabold md:text-5xl lg:text-7xl">
            {data?.header?.name}
          </h1>
          <p className="mt-5 text-xl">{data?.header?.role}</p>
        </div>
      </div>
    </header>
  );
}
