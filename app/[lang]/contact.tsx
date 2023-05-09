import { getDataWithLocal } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import { Locale } from 'i18n-config';
import React from 'react';

const query = gql`
  query getContact($lang: SiteLocale) {
    contact(locale: $lang) {
      title
      phoneTitle
      phone
      emailTitle
      email
      locationTitle
      location
    }
  }
`;

export default async function contact(locale: Locale) {
  const data: any = await getDataWithLocal(locale, query);
  return (
    <section id="contact" className="mt-10 ">
      <h2 className="border-b pb-1 text-2xl font-semibold text-pink-300">
        Contact
      </h2>
      <ul className="mb-10 mr-1 mt-4">
        <li className="mt-1 text-pink-200">
          <strong>{data?.contact?.phoneTitle}</strong>
          <a href={`tel:${data?.contact?.phone}`} className="block">
            {data?.contact?.phone}
          </a>
        </li>
        <li className="mt-1 text-pink-200">
          <strong>{data?.contact?.emailTitle}</strong>
          <a href={`mailto:${data?.contact?.email}`} className="block">
            {data?.contact?.email}
          </a>
        </li>
        <li className="mt-1 text-pink-200">
          <strong>{data?.contact?.locationTitle}</strong>
          <span className="block">{data?.contact?.location}</span>
        </li>
      </ul>
    </section>
  );
}
