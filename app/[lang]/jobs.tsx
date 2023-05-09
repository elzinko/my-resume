import Job from '@/components/job';
import { getDataWithLocal, graphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import { Locale } from 'i18n-config';
import React from 'react';

const query = gql`
  query getAllJobs($lang: SiteLocale) {
    allJobsModels(locale: $lang) {
      client
      location
      startDate
      endDate
      description
      bullets {
        id
        text
      }
      frameworks {
        id
        name
        link
      }
      role {
        name
        id
      }
    }
  }
`;

export default async function jobs(locale: Locale) {
  const data = await getDataWithLocal(locale, query);
  return (
    <>
      <section id="jobs" className="mt-10 break-before-page">
        <h2 className="mt-4 border-b pb-1 text-2xl font-semibold text-pink-300">
          Jobs
        </h2>
        <ul className="mt-4">
          {data?.allJobsModels?.map((job: any) => (
            <li key={job.id} className="py-4">
              <Job job={job} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
