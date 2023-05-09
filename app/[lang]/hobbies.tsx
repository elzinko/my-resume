import CustomLink from '@/components/customLink';
import { getDataWithLocal, graphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import { Locale } from 'i18n-config';
import React from 'react';

const query = gql`
  query getAllHobbies($lang: SiteLocale) {
    hobbiesTitle(locale: $lang) {
      title
    }
    allHobbiesModels(locale: $lang) {
      id
      name
      link
    }
  }
`;

export default async function hobbies(locale: Locale) {
  const data: any = await getDataWithLocal(locale, query);
  return (
    <section id="hobbies" className="mt-10">
      <h2 className="border-b pb-1 text-2xl font-semibold text-orange-300">
        {data?.hobbiesTitle?.title}
      </h2>
      <ul className="mt-4">
        {data.allHobbiesModels.map((hobby: any) => (
          <li className="mt-1" key={hobby.id}>
            <CustomLink name={hobby.name} link={hobby.link} />
          </li>
        ))}
      </ul>
    </section>
  );
}
