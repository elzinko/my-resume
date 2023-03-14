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
