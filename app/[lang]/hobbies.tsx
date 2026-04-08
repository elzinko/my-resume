import CustomLink from '@/components/customLink';
import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';

export type HobbiesContentLayout = 'list' | 'inline';

export default async function hobbies({
  locale,
  sectionId = 'hobbies',
  className = '',
  contentLayout = 'list',
}: {
  locale: Locale;
  sectionId?: string | false;
  className?: string;
  /** `inline` : loisirs séparés par un slash (accent chaud). */
  contentLayout?: HobbiesContentLayout;
}) {
  const data: any = await getCvData(locale);
  const items = data?.allHobbiesModels ?? [];

  const sectionClass =
    className && className.length > 0
      ? `${className} print:order-[110]`
      : 'mt-10 print:order-[110]';

  return (
    <section
      id={sectionId === false ? undefined : sectionId}
      className={sectionClass}
    >
      <h2 className="border-b pb-1 text-2xl font-semibold text-orange-300">
        {data?.hobbiesTitle?.title}
      </h2>
      {contentLayout === 'inline' ? (
        <div className="mt-4 flex flex-wrap items-baseline gap-x-0.5 text-sm leading-relaxed text-orange-300 print:mt-2 md:mt-4 md:text-base">
          {items.map((hobby: any, i: number) => (
            <span key={hobby.id} className="inline">
              {i > 0 ? (
                <span
                  className="mx-1 text-amber-400/90 print:text-amber-300/95"
                  aria-hidden
                >
                  /
                </span>
              ) : null}
              <CustomLink
                name={hobby.name}
                link={hobby.link}
                className="text-orange-300 print:!text-orange-300"
              />
            </span>
          ))}
        </div>
      ) : (
        <ul className="cv-section-simple-list">
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
      )}
    </section>
  );
}
