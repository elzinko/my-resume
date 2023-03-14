import { graphQLClient } from "@/lib/graphql-client";
import { gql } from "graphql-request";
import React from "react";

const query = gql`
  {
    about {
      id
      title
      text
    }
  }
`;

async function getData() {
  const data: any = await graphQLClient.request(query);
  console.log(data);
  return data;
}

export default async function AboutSection() {
  const data: any = await getData();
  return (
    <section id={data?.about?.id} className="mt-10">
      <h2 className="border-b pb-1 text-2xl font-semibold">
        {data?.about?.title}
      </h2>
      <p className="mt-4">{data?.about?.text}</p>
    </section>
  );
}
