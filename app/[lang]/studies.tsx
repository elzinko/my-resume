import Study from '@/components/study';
import { getCvData } from '@/lib/cv-data';
import {
  byEndThenStart,
  sortChronologicalDesc,
} from '@/lib/sort-chronological';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function studies({
  locale,
  condensed = false,
}: {
  locale: Locale;
  /** `true` : ligne unique titre/lieu/établissement. `false` : rendu classique. */
  condensed?: boolean;
}) {
  const data: any = await getCvData(locale);
  const studiesOrdered = sortChronologicalDesc(
    data?.allStudiesModels || [],
    byEndThenStart,
  );
  return (
    <section
      id="studies"
      className="mt-10 print:order-[95] print-preview:order-[95]"
    >
      <h2 className="border-b pb-1 text-2xl font-semibold text-cv-section">
        {data?.studiesTitle?.title}
      </h2>
      <ul className="cv-section-simple-list">
        {studiesOrdered.map((study: any) => (
          <li key={study.id}>
            <Study study={study} condensed={condensed} />
          </li>
        ))}
      </ul>
    </section>
  );
}
