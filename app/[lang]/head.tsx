import React from 'react';
import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';

export default async function Head({ locale }: { locale: Locale }) {
  const data: any = await getCvData(locale);
  const date = new Date();
  return (
    <>
      <title>{data?.head?.name}</title>
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
      <link rel="canonical" href={data?.head?.url} />
      <link rel="profile" href="http://gmpg.org/xfn/11" />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta name="description" content={data?.head?.seo?.description} />
      <meta property="og:description" content={data?.head?.seo?.description} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={data?.head?.locale} />
      <meta property="og:url" content={data?.head?.url} />
      <meta property="og:title" content={data?.head?.seo?.title} />
      <meta property="og:site_name" content={data?.head?.name} />
      <meta property="article:modified_time" content={date.toISOString()} />
    </>
  );
}
