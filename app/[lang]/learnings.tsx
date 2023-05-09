import CustomLink from '@/components/customLink';
import { getData } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import React from 'react';

const query = gql`
  {
    allLearningsModels {
      id
      name
      link
    }
  }
`;

export default async function learnings() {
  const data: any = await getData(query);
  return (
    <section id="learning" className="mt-10">
      <h2 className="border-b pb-1 text-2xl font-semibold text-teal-300">
        Learnings
      </h2>
      <ul className="mt-4">
        {data?.allLearningsModels.map((learning: any) => (
          <li className="mt-1" key={learning.id}>
            <CustomLink name={learning.name} link={learning.link} />
          </li>
        ))}
      </ul>
    </section>
  );
}
