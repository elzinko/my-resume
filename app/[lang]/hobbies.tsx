import CustomLink from '@/components/customLink';
import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function hobbies({
  locale,
  sectionId = 'hobbies',
  className = '',
}: {
  locale: Locale;
  sectionId?: string | false;
  className?: string;
}) {
  const data: any = await getCvData(locale);
  const items = data?.allHobbiesModels ?? [];

  const sectionClass =
    className && className.length > 0
      ? `${className} print:order-[120] print-preview:order-[120]`
      : 'mt-10 print:order-[120] print-preview:order-[120]';

  return (
    <section
      id={sectionId === false ? undefined : sectionId}
      data-cv-section="hobbies"
      className={`cv-cq-section ${sectionClass}`}
    >
      <h2 className="border-b pb-1 text-2xl font-semibold text-orange-300">
        {data?.hobbiesTitle?.title}
      </h2>
      <ul className="cv-section-simple-list cv-cq-link-list max-md:mt-6">
        {items.map((hobby: any) => (
          <li className="text-orange-300" key={hobby.id}>
            <CustomLink
              name={hobby.name}
              link={hobby.link}
              className="text-orange-300 print:!text-orange-300"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
