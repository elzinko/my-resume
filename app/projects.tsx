import Project from '@/components/project';
import { graphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import React from 'react';

const query = gql`
  {
    allProjectsModels {
      id
      name
      link
      startDate
      endDate
      description
      frameworks {
        id
        name
        link
      }
      bullets {
        id
        text
      }
      tags {
        id
        name
      }
    }
  }
`;

async function getData() {
  const data: any = await graphQLClient.request(query);
  console.log(data);
  return data;
}

export default async function projects() {
  const data = await getData();
  return (
    <>
      <section id="projects" className="mt-10 break-before-page">
        <h2 className="border-b pb-1 text-2xl font-semibold text-blue-300">
          Projects
        </h2>
        <ul className="mt-4">
          {data?.allProjectsModels?.map((project: any) => (
            <li key={project.id} className="py-2">
              <Project project={project} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
