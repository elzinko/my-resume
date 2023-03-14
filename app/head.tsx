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
  const data = await graphQLClient.request(query);
  console.log(data);
  return data;
}

export default async function Head() {
  const data: any = await getData();
  const date = new Date();
  return (
    <>
      <title>{data?.head?.websiteName}</title>
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
      <link rel="canonical" href={data?.head?.websiteUrl} />
      <link rel="profile" href="http://gmpg.org/xfn/11" />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta name="description" content={data?.head?.websiteSeo?.description} />
      <meta
        property="og:description"
        content={data?.head?.websiteSeo?.description}
      />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={data?.head?.websiteLocale} />
      <meta property="og:url" content={data?.head?.websiteUrl} />
      <meta property="og:title" content={data?.head?.websiteSeo?.title} />
      <meta property="og:site_name" content={data?.head?.websiteName} />
      <meta property="article:modified_time" content={date.toISOString()} />
    </>
  );
}
