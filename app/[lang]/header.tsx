import LocaleSwitcher from '@/components/locale-switcher';
import Logos from '@/components/logos';
import { getDataWithLocal } from '@/lib/graphql-client';
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

export default async function Header(locale: Locale) {
  const data: any = await getDataWithLocal(locale, query);
  return (
    <header>
      <div className="flex flex-row justify-between">
        <LocaleSwitcher lang={locale} />
        <Logos />
      </div>

      <div className="flex justify-between py-14 md:py-20">
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
