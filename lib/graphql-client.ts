import "server-only";

import { GraphQLClient } from "graphql-request";


export const graphQLClient = new GraphQLClient(
  process.env.DATOCMS_API_URL as string,
  {
    headers: {
      authorization: "Bearer " + process.env.DATOCMS_API_KEY,
    },
  }
);

export async function getData(query: any) {
  const data: any = await graphQLClient.request(query);
  if (process.env.NODE_ENV !== "production") {
    console.log(data);
  }
  return data;
}

export async function getDataWithLocal(locale: any, query: any) {
  const variables = {
    lang: locale.locale,
  };
  const data: any = await graphQLClient.request(query, variables);
  if (process.env.NODE_ENV !== "production") {
    console.log(data);
  }
  return data;
}
