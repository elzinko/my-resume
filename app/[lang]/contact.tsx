import { getData } from '@/lib/graphql-client';
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

export default async function contact() {
  const data: any = await getData(query);
  return (
    <section id="contact" className="mt-10 ">
      <h2 className="border-b pb-1 text-2xl font-semibold text-pink-300">
        Contact
      </h2>
      <ul className="mb-10 mr-1 mt-4">
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
