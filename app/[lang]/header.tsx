import LocaleSwitcher from '@/components/locale-switcher';
import Logos from '@/components/logos';
import HeaderContent from '@/components/HeaderContent';
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
    <header className="print:mb-2">
      <div className="flex flex-row justify-between print:hidden">
        <LocaleSwitcher lang={locale} />
        <Logos />
      </div>

      <HeaderContent name={data?.header?.name} role={data?.header?.role} />
    </header>
  );
}
