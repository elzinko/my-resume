import { graphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import { Locale } from 'i18n-config';
import React from 'react';

const query = gql`
  query getAbout($lang: SiteLocale) {
    about(locale: $lang) {
      id
      title
      text
    }
  }
`;

async function getData(locale: any) {
  const variables = {
    lang: locale.locale,
  };
  const data: any = await graphQLClient.request(query, variables);
  console.log(data);
  return data;
}

export default async function About(locale: Locale) {
  const data: any = await getData(locale);
  return (
    <section id="about" className="mt-10">
      <h2 className="border-b pb-1 text-2xl font-semibold text-teal-300">
        {data?.about?.title}
      </h2>
      <p className="mt-4">{data?.about?.text}</p>
    </section>
  );
}
