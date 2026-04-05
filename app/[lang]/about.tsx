import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function About({ locale }: { locale: Locale }) {
  const data: any = await getCvData(locale);
  return (
    <section id="about" className="mt-10">
      <h2 className="border-b pb-1 text-2xl font-semibold text-cv-section">
        {data?.about?.title}
      </h2>
      <p className="mt-3 md:mt-4">{data?.about?.text}</p>
    </section>
  );
}
