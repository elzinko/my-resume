import HobbiesDisplay from '@/components/HobbiesDisplay';
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
      <HobbiesDisplay
        title={data?.hobbiesTitle?.title}
        items={items}
      />
    </section>
  );
}
