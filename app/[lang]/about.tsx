import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function About({ locale }: { locale: Locale }) {
  const data: any = await getCvData(locale);
  return (
    <section id="about" className="mt-4 md:mt-10">
      <h2 className="border-b pb-1 text-xl font-semibold text-cv-section md:text-2xl">
        {data?.about?.title}
      </h2>
      <p className="mt-2 text-sm leading-snug md:mt-4 md:text-base md:leading-normal">
        {data?.about?.text}
      </p>
    </section>
  );
}
