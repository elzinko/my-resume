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
    <section id="contact" className="mt-10">
      <h2 className="border-b pb-1 text-2xl font-semibold">Contact</h2>
      <ul className="mt-4 mb-10 mr-1">
        <li className="mt-1">
          <strong>Phone </strong>
          <a href={`tel:${data?.contact?.phone}`} className="block">
            {data?.contact?.phone}
          </a>
        </li>
        <li className="mt-1">
          <strong>E-mail </strong>
          <a href={`mailto:${data?.contact?.email}`} className="block">
            {data.contact?.email}
          </a>
        </li>
        <li className="mt-1">
          <strong>Location</strong>
          <span className="block">{data.contact?.location}</span>
        </li>
      </ul>
    </section>
  );
}
