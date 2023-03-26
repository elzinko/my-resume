import Skill from '@/components/skill';
import { graphQLClient } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import React from 'react';

const query = gql`
  {
    allSkillsModels {
      id
      name
      link
    }
  }
`;

async function getData() {
  const data: any = await graphQLClient.request(query);
  console.log(data);
  return data;
}

export default async function skills() {
  const data = await getData();
  return (
    <section id="skills" className="mt-10">
      <h2 className="border-b pb-1 text-2xl font-semibold text-blue-300">
        Skills
      </h2>
      <div className="mt-4 grid grid-cols-3 gap-x-4 gap-y-4 md:grid-cols-1">
        {data?.allSkillsModels?.map((skill: any) => (
          <Skill key={skill.id} skill={skill} />
        ))}
      </div>
    </section>
  );
}
