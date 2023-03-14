import React from "react";
import { gql } from "graphql-request";
import { graphQLClient } from "@/lib/graphql-client";

const query = gql`
  {
    head {
      websiteUrl
      websiteName
      websiteLocal
      websiteSeo {
        __typename
        description
        title
      }
    }
  }
`;

async function getData() {
  const header = await graphQLClient.request(query);
  console.log(header);
  return header;
}

export default async function Head() {
  const result: any = await getData();
  const date = new Date();
  return (
    <>
      <title>{result?.head?.websiteName}</title>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="canonical" href={result?.head?.websiteUrl} />
      <link rel="profile" href="http://gmpg.org/xfn/11" />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta
        name="description"
        content={result?.head?.websiteSeo?.description}
      />
      <meta
        property="og:description"
        content={result?.head?.websiteSeo?.description}
      />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={result?.head?.websiteLocale} />
      <meta property="og:url" content={result?.head?.websiteUrl} />
      <meta property="og:title" content={result?.head?.websiteSeo?.title} />
      <meta property="og:site_name" content={result?.head?.websiteName} />
      <meta property="article:modified_time" content={date.toISOString()} />
    </>
  );
}
