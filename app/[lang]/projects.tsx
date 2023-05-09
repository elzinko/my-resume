import Project from '@/components/project';
import { getDataWithLocal } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import { Locale } from 'i18n-config';
import React from 'react';

const query = gql`
  query getAllProjects($lang: SiteLocale) {
    projectsTitle(locale: $lang) {
      title
    }
    allProjectsModels(locale: $lang) {
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

export default async function projects(locale: Locale) {
  const data = await getDataWithLocal(locale, query);
  return (
    <>
      <section id="projects" className="mt-10 break-before-page">
        <h2 className="border-b pb-1 text-2xl font-semibold text-blue-300">
          Projects
        </h2>
        <ul className="mt-4">
          {data?.allProjectsModels?.map((project: any) => (
            <li key={project.id} className="py-4">
              <Project project={project} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
