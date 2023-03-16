import { graphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import React from 'react';

const query = gql`
  {
    contact {
      id
      phone
      email
      location
    }
  }
`;

async function getData() {
  const data: any = await graphQLClient.request(query);
  console.log(data);
  return data;
}

export default async function contact() {
  const data: any = await getData();
  return (
    <>
      <strong className="text-xl font-medium">Contact Details</strong>
      <ul className="mt-2 mb-10">
        <li className="mt-1 px-4">
          <strong className="mr-1">Phone </strong>
          <a href={`tel:${data?.contact?.phone}`} className="block">
            {data?.contact?.phone}
          </a>
        </li>
        <li className="mt-1 px-4">
          <strong className="mr-1">E-mail </strong>
          <a href={`mailto:${data?.contact?.email}`} className="block">
            {data.contact?.email}
          </a>
        </li>
        <li className="mt-1 px-4">
          <strong className="mr-1">Location</strong>
          <span className="block">{data.contact?.location}</span>
        </li>
      </ul>
    </>
  );
}