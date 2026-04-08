'use client';

import React, { Suspense } from 'react';
import ProfileEducationBadge from '@/components/ProfileEducationBadge';
import { getProfileEducationBadgeLabel } from '@/lib/education-level-content';
import Skill from './skill';
import Domain from './domain';
import JobDisplay from './JobDisplay';
import StudyDisplay from './StudyDisplay';
import EducationLevel from './EducationLevel';
import ExperienceClosingBlock from './ExperienceClosingBlock';
import ShortCvOnlineDetailLink from './ShortCvOnlineDetailLink';
import Project from './project';
import type { EducationLevelContent } from '@/lib/education-level-content';
import {
  formatRemainingClientsForShortCv,
  getExperienceClosingLabels,
  SHORT_CV_EXCLUDED_CLIENTS,
  SHORT_CV_MAX_JOBS,
} from '@/lib/cv-experience-footer';

export interface CompactCvData {
  header: {
    name: string;
    role: string;
  };
  titles: {
    about: string;
    skills: string;
    contact: string;
    education: string;
    experience: string;
  };
  contact: {
    phoneTitle: string;
    phone: string;
    emailTitle: string;
    email: string;
    locationTitle: string;
    location: string;
  };
  about: string;
  skills: Array<{ id: string; name: string; link?: string }>;
  domains: Array<{
    id?: string;
    name: string;
    description: string;
    competencies?: Array<{ id: string; name: string }>;
  }>;
  jobs: Array<{
    client: string;
    role: string;
    location: string;
    startDate: string;
    endDate?: string;
    description: string;
    descriptionShort?: string;
    bullets?: Array<{ id: string; text: string }>;
    frameworks: Array<{ id: string; name: string }>;
  }>;
  studies: Array<{
    id: string;
    name: string;
    establishment: string;
    startDate?: string;
    endDate?: string;
  }>;
  educationLevel: EducationLevelContent;
  projectsTitle: string;
  projects: any[];
}

interface CompactCvLayoutProps {
  data: CompactCvData;
  lang: 'fr' | 'en';
  /** `SHORT_CV_OFFER_ID` : lien « CV en ligne » même sans `?offer=` dans l’URL. */
  defaultOfferId?: string | null;
  /** Emplacement réservé pour extensions (ex. adéquation offre) — non utilisé par défaut. */
  children?: React.ReactNode;
}

export default function CompactCvLayout({
  data,
  lang,
  defaultOfferId = null,
  children,
}: CompactCvLayoutProps) {
  // Fallback labels if DatoCMS titles are empty
  const fallbackLabels = {
    fr: {
      skills: 'Compétences',
      experience: 'Expériences',
      education: 'Formation',
      expertise: 'Domaines',
      about: 'Profil',
      present: 'Présent',
    },
    en: {
      skills: 'Skills',
      experience: 'Experience',
      education: 'Education',
      expertise: 'Domains',
      about: 'Profile',
      present: 'Now',
    },
  };

  const fallback = fallbackLabels[lang];

  // Use DatoCMS titles with fallback
  const t = {
    about: data.titles.about || fallback.about,
    skills: data.titles.skills || fallback.skills,
    education: data.titles.education || fallback.education,
    experience: data.titles.experience || fallback.experience,
    expertise: fallback.expertise,
    present: fallback.present,
  };

  const closing = getExperienceClosingLabels(lang);
  const moreClientsLine = formatRemainingClientsForShortCv(data.jobs, lang);

  // Missions récentes sans puces ; fenêtre alignée sur `lib/cv-experience-footer`.
  const recentJobs = data.jobs
    .filter((job) => !SHORT_CV_EXCLUDED_CLIENTS.has(job.client))
    .slice(0, SHORT_CV_MAX_JOBS);

  const profileBadgeLabel = getProfileEducationBadgeLabel(
    data.educationLevel,
    lang,
  );

  return (
    <div className="cv-layout-short print:p-0">
      {/* About - Full width section (same style as full CV) */}
      <section
        id="cv-short-about"
        className="cv-short-about mt-10 print:mt-2 pb-6 print:pb-4 mb-6 print:mb-5"
      >
        <div className="border-b pb-1 print:pb-0.5">
          <h2 className="min-w-0 text-2xl font-semibold text-cv-section print:text-sm">
            {t.about}
          </h2>
        </div>
        <p className="mt-4 text-cv-body-muted print:mt-1 print:text-[10px]">
          {data.about}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-1 gap-y-1 py-1 print:mt-1 print:py-0.5">
          <ProfileEducationBadge label={profileBadgeLabel} />
        </div>
      </section>

      {/* Domains - Full width (même grille 1/3 que le CV complet) */}
      <section id="domains" className="mt-8 print:mt-3">
        <div className="cv-domains-grid">
          {data.domains.map((domain) => (
            <Domain
              key={domain.id || domain.name}
              domain={domain}
              showTags={true}
              compact={true}
            />
          ))}
        </div>
      </section>

      {children}

      {/* Colonne gauche 1/3 + expériences 2/3 (grille alignée sur les domaines) */}
      <div className="cv-page-split mt-14 print:mt-1">
        <div
          id="left"
          className="order-last flex w-full min-w-0 flex-col print:order-first print:col-span-1 md:order-first md:col-span-1"
        >
          {/* Niveau de formation : même bloc que le CV long (une colonne, y compris à l’impression). */}
          <EducationLevel
            content={data.educationLevel}
            sectionClassName="mb-6 print:mb-2 print:order-[60] print-preview:order-[60]"
            pillsCompact
          />

          {/* Skills : écran uniquement (tags domaines en impression / aperçu). */}
          <section className="mb-6 print:mb-2 print:hidden print-preview:hidden print:order-[70] print-preview:order-[70]">
            <h2 className="border-b pb-1 text-2xl font-semibold text-cv-tag-text print:pb-0.5 print:text-sm">
              {t.skills}
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5 print:mt-1 print:gap-1">
              {data.skills.slice(0, 10).map((skill) => (
                <Skill key={skill.id} skill={skill} compact={true} />
              ))}
            </div>
          </section>

          {/* Études sans détail (établissement masqué) — même titre que le CV long (#studies). */}
          <section
            id="studies"
            className="cv-short-studies-section mb-6 print:mb-2 print:order-[95] print-preview:order-[95]"
          >
            <h2 className="border-b pb-1 text-2xl font-semibold text-teal-300 print:pb-0.5 print:text-sm">
              {t.education}
            </h2>
            <ul className="mt-2 space-y-1 print:mt-1 print:space-y-0">
              {data.studies.map((study) => (
                <StudyDisplay key={study.id} study={study} compact={true} />
              ))}
            </ul>
          </section>

          {/* Projets : mêmes composants / classes que le CV long (`cv-cq-section`, `Project`). */}
          <section
            id="projects"
            data-cv-section="projects"
            className="cv-cq-section mb-6 print:mb-2 print:order-[100] print-preview:order-[100]"
          >
            <h2 className="border-b pb-1 text-2xl font-semibold text-cv-tag-text print:pb-0.5 print:text-sm">
              {data.projectsTitle}
            </h2>
            <ul className="cv-section-simple-list cv-cq-project-list max-md:mt-6">
              {data.projects.map((project: any) => (
                <li key={project.id}>
                  <Project project={project} />
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div
          id="main"
          className="w-full min-w-0 print:col-span-2 md:col-span-2"
        >
          {/* Experience - Reusing JobDisplay component */}
          <section>
            <h2 className="border-b pb-1 text-2xl font-semibold text-cv-jobs print:pb-0.5 print:text-sm">
              {t.experience}
            </h2>
            <ul className="mt-2 space-y-4 print:mt-1 print:space-y-1.5">
              {recentJobs.map((job, idx) => (
                <li key={idx}>
                  <JobDisplay
                    job={job}
                    compact={true}
                    presentLabel={t.present}
                    locale={lang}
                  />
                </li>
              ))}
            </ul>

            <ExperienceClosingBlock
              moreExperience={closing.moreExperience}
              moreExperienceTail={closing.moreExperienceTail}
              moreClientsLine={moreClientsLine}
            />
            <Suspense fallback={null}>
              <ShortCvOnlineDetailLink
                lang={lang}
                defaultOfferId={defaultOfferId}
              />
            </Suspense>
          </section>
        </div>
      </div>
    </div>
  );
}
