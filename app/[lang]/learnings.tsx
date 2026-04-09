import CustomLink from '@/components/customLink';
import { getCvData } from '@/lib/cv-data';
import { learningLinkLabel } from '@/lib/learning-label';
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
      <h2 className="border-b pb-1 text-2xl font-semibold text-teal-300">
        {data?.learningsTitle?.title}
      </h2>
      <ul className="cv-section-simple-list cv-cq-link-list max-md:mt-6">
        {items.map((learning: any) => (
          <li className="text-teal-300" key={learning.id}>
            <CustomLink
              name={learningLinkLabel(learning)}
              link={learning.link}
              className="text-teal-300 print:!text-teal-300"
            />
            {learning.description ? (
              <span className="cv-learning-desc ml-1 text-sm text-cv-body-muted">
                — {learning.description}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
