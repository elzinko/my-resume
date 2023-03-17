import Job from '@/components/job';
import { graphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import React from 'react';

const query = gql`
  {
    allJobsModels {
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

async function getData() {
  const data: any = await graphQLClient.request(query);
  console.log(data);
  return data;
}

export default async function jobs() {
  const data = await getData();
  return (
    <>
      <section id="jobs" className="mt-10">
        <h2 className="mt-12 border-b pb-1 text-2xl font-semibold">Jobs</h2>
        <ul className="mt-4">
          {data?.allJobsModels?.map((job: any) => (
            <li key={job.id} className="py-2">
              <Job job={job} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}