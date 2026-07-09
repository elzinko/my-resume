import SectionHeadingAts from '@/components/SectionHeadingAts';
import { getCvData } from '@/lib/cv-data';
import type { CvMode } from '@/lib/cv-contract-text';
import {
  byEndThenStart,
  sortChronologicalDesc,
} from '@/lib/sort-chronological';
import { capitalizeFirstLetter } from '@/lib/capitalize-first';
import { Locale } from 'i18n-config';
import React from 'react';

export default async function projects({
  locale,
  sectionId = 'projects',
  className = '',
  mode,
}: {
  locale: Locale;
  sectionId?: string | false;
  className?: string;
  mode?: CvMode;
}) {
  const data: any = await getCvData(locale);
  const visibleProjects = (data?.allProjectsModels || []).filter(
    (p: { display?: boolean; displayMode?: string }) => {
      if (p.display === false) return false;
      if (p.displayMode && p.displayMode !== mode) return false;
      return true;
    },
  );
  const projectsOrdered = sortChronologicalDesc(
    visibleProjects,
    byEndThenStart,
  );

  const sectionClass =
    className && className.length > 0
      ? `${className} print:order-[100] print-preview:order-[100]`
      : 'mt-10 print:order-[100] print-preview:order-[100]';

  return (
    <section
      id={sectionId === false ? undefined : sectionId}
      data-cv-section="projects"
      className={`cv-cq-section ${sectionClass}`}
    >
      <SectionHeadingAts
        section="projects"
        locale={locale}
        title={data?.projectsTitle?.title ?? 'Projects'}
        accent="tag"
      />
      {/* Une ligne par projet : titre (lien coloré) — description inline (desktop),
          masquée en colonne étroite (mobile). Même pattern que Learnings/Hobbies. */}
      <ul className="cv-section-simple-list cv-cq-link-list max-md:mt-6">
        {projectsOrdered.map((project: any) => {
          const name =
            (typeof project.title === 'string' && project.title.trim()) ||
            (project.name ? capitalizeFirstLetter(project.name) : '');
          const description =
            typeof project.description === 'string'
              ? project.description.trim()
              : '';
          const year =
            (project.endDate && new Date(project.endDate).getFullYear()) ||
            (project.startDate && new Date(project.startDate).getFullYear()) ||
            '';
          // Markup : titre → détail → année (cf. `.cv-entry`) : desktop inline,
          // mobile en 2 lignes avec l'année à droite de la ligne 1.
          return (
            <li className="cv-entry text-cv-tag-text" key={project.id}>
              <span className="cv-entry-title">
                {project.link ? (
                  <a
                    href={project.link}
                    className="text-cv-tag-text underline-offset-2 hover:underline print:!text-cv-tag-text"
                  >
                    {name}
                  </a>
                ) : (
                  <span className="text-cv-tag-text print:!text-cv-tag-text">
                    {name}
                  </span>
                )}
              </span>
              {description ? (
                <span className="cv-entry-detail text-sm text-cv-body-muted">
                  {description}
                </span>
              ) : null}
              {year ? (
                // Date à la couleur de la section (comme les dates d'expérience).
                <span className="cv-entry-year cv-date tabular-nums text-cv-tag-text print:!text-cv-tag-text">
                  {year}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
