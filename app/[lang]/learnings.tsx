import LearningsDisplay from '@/components/LearningsDisplay';
import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function learnings({
  locale,
  sectionId = 'learnings',
  className = '',
}: {
  locale: Locale;
  sectionId?: string | false;
  className?: string;
}) {
  const data: any = await getCvData(locale);
  const items = data?.allLearningsModels ?? [];

  const sectionClass =
    className && className.length > 0
      ? `${className} print:order-[110] print-preview:order-[110]`
      : 'mt-10 print:order-[110] print-preview:order-[110]';

  return (
    <section
      id={sectionId === false ? undefined : sectionId}
      data-cv-section="learnings"
      className={`cv-cq-section ${sectionClass}`}
    >
      <LearningsDisplay
        title={data?.learningsTitle?.title}
        items={items}
      />
    </section>
  );
}
