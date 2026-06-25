import Study from '@/components/Study';
import SectionHeadingAts from '@/components/SectionHeadingAts';
import { getCvData } from '@/lib/cv-data';
import {
  byEndThenStart,
  sortChronologicalDesc,
} from '@/lib/sort-chronological';
import { Locale } from 'i18n-config';
import React from 'react';

function studyMetaLine(study: any): string {
  return [study.location, study.establishment]
    .filter((p: unknown) => Boolean(p && String(p).trim()))
    .join(' / ');
}

function studyYear(study: any): string {
  const end = study.endDate ? new Date(study.endDate).getFullYear() : null;
  if (end) return `${end}`;
  const start = study.startDate
    ? new Date(study.startDate).getFullYear()
    : null;
  return start ? `${start}` : '';
}

export default async function studies({
  locale,
  condensed = false,
}: {
  locale: Locale;
  /** `true` : rendu compact (CV court). `false` : une ligne inline (CV complet). */
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
      className="cv-cq-section mt-10 print-preview:order-[95] print:order-[95]"
    >
      <SectionHeadingAts
        section="studies"
        locale={locale}
        title={data?.studiesTitle?.title}
        className="border-b border-purple-300/50 pb-1 text-2xl font-semibold text-purple-300"
      />
      {/* Une ligne par diplôme : intitulé — lieu / établissement, année (inline
          desktop, masqué mobile). Même pattern que Learnings/Projets. */}
      <ul className="cv-section-simple-list cv-cq-link-list">
        {studiesOrdered.map((study: any) => {
          if (condensed) {
            return (
              <li key={study.id}>
                <Study study={study} condensed />
              </li>
            );
          }
          const meta = studyMetaLine(study);
          const year = studyYear(study);
          const tail = [meta, year].filter(Boolean).join(' · ');
          return (
            <li className="text-purple-300" key={study.id}>
              <span className="text-purple-300">{study.name}</span>
              {tail ? (
                <span className="cv-row-inline-desc ml-1 text-sm text-cv-body-muted">
                  {'—'} {tail}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
