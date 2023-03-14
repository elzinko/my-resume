import { graphQLClient } from "@/lib/graphql-client";
import { gql } from "graphql-request";
import React from "react";
import Skill from "@/components/Skill";

const query = gql`
  {
    allSkillsModels {
      id
      __typename
      skillTitle
      skillDescription
    }
  }
`;

async function getData() {
  const data: any = await graphQLClient.request(query);
  console.log(data);
  return data;
}

export default async function SkillsSection() {
  const data: any = await getData();
  return (
    <section id="skills" className="mt-10">
      <div className="flex w-full columns-1 flex-col  md:columns-3 md:flex-row md:space-x-6">
        {data?.allSkillsModels?.map((skill: any) => (
          <Skill skill={skill} key={skill.id} />
        ))}
      </div>
    </section>
  );
}
