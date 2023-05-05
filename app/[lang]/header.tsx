import LogoGithub from '@/components/logoGithub';
import LogoLinkedin from '@/components/LogoLinkedin';
import LogoMalt from '@/components/logoMalt';
import { graphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import { i18n, Locale } from 'i18n-config';
import React from 'react';

const query = gql`
  query getHeader($lang: SiteLocale) {
    header(locale: $lang) {
      id
      name
      role
    }
  }
`;

async function getData(locale: any) {
  // get   locale from i18n
  // const locale = i18n.locale;
  // get string value from locale parameter
  // const locale = localeVar.locale;
  const loc = locale.locale;
  const variables = {
    'lang': loc,
  };
  const data: any = await graphQLClient.request(query, variables);
  console.log(data);
  return data;
}

export default async function Header(locale : Locale) {
  const data: any = await getData(locale);
  // console.log('lang : ' + lang);
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
      <div className="flex items-center justify-between py-14 md:py-20">
        <div className="grid justify-items-end">
          <h1 className="text-4xl font-extrabold text-blue-600 md:text-5xl lg:text-7xl">
            {data?.header?.name}
          </h1>
          <p className="mt-5 text-2xl text-teal-300 md:text-3xl">
            {data?.header?.role}
          </p>
        </div>
      </div>
    </header>
  );
}
