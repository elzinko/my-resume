import CustomLink from '@/components/customLink';
import { getCvData } from '@/lib/cv-data';
import { learningLinkLabel } from '@/lib/learning-label';
import { Locale } from 'i18n-config';
import React from 'react';

export type LearningsContentLayout = 'list' | 'inline';

export default async function learnings({
  locale,
  sectionId = 'learnings',
  className = '',
  contentLayout = 'list',
}: {
  locale: Locale;
  sectionId?: string | false;
  className?: string;
  /** `inline` : liens séparés par un slash teal. */
  contentLayout?: LearningsContentLayout;
}) {
  const data: any = await getCvData(locale);
  const items = data?.allLearningsModels ?? [];

  const sectionClass =
    className && className.length > 0
      ? `${className} print:order-[100]`
      : 'mt-10 print:order-[100]';

  return (
    <section
      id={sectionId === false ? undefined : sectionId}
      className={sectionClass}
    >
      <h2 className="border-b pb-1 text-2xl font-semibold text-teal-300">
        {data?.learningsTitle?.title}
      </h2>
      {contentLayout === 'inline' ? (
        <div className="mt-4 flex flex-wrap items-baseline gap-x-0.5 text-sm leading-relaxed text-teal-300 print:mt-2 md:mt-4 md:text-base">
          {items.map((learning: any, i: number) => (
            <span key={learning.id} className="inline">
              {i > 0 ? (
                <span className="mx-1 text-teal-500/80 print:text-teal-400/90" aria-hidden>
                  /
                </span>
              ) : null}
              <CustomLink
                name={learningLinkLabel(learning)}
                link={learning.link}
                className="text-teal-300 print:!text-teal-300"
              />
            </span>
          ))}
        </div>
      ) : (
        <ul className="cv-section-simple-list">
          {items.map((learning: any) => (
            <li className="text-teal-300" key={learning.id}>
              <CustomLink
                name={learningLinkLabel(learning)}
                link={learning.link}
                className="text-teal-300 print:!text-teal-300"
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
