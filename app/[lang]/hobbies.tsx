import CustomLink from '@/components/customLink';
import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function hobbies({ locale }: { locale: Locale }) {
  const data: any = await getCvData(locale);
  const items = data?.allHobbiesModels ?? [];
  return (
    <section id="hobbies" className="mt-10">
      <h2 className="border-b pb-1 text-2xl font-semibold text-orange-300">
        {data?.hobbiesTitle?.title}
      </h2>
      <ul className="cv-section-simple-list">
        {items.map((hobby: any) => (
          <li className="text-orange-300" key={hobby.id}>
            <CustomLink name={hobby.name} link={hobby.link} />
          </li>
        ))}
      </ul>
    </section>
  );
}
