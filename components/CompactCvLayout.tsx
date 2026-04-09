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
  /** `SHORT_CV_OFFER_ID` : lien « CV en ligne » même sans `?offer=` dans l'URL. */
  defaultOfferId?: string | null;
  /** Contenu injecté après la pastille niveau (ex. pastilles adéquation offre). */
  afterBadge?: React.ReactNode;
  /** Emplacement réservé pour extensions (ex. adéquation offre) — non utilisé par défaut. */
  children?: React.ReactNode;
}

export default function CompactCvLayout({
  data,
  lang,
  defaultOfferId = null,
  afterBadge,
  children,
}: CompactCvLayoutProps) {
  // Fallback labels if bundle.json titles are empty
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

  // Use bundle.json titles with fallback
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
    <div className="cv-layout-short">
      {/* About - Full width section (same style as full CV) */}
      <section
        id="cv-short-about"
        className="cv-short-about mt-4 pb-1 mb-1"
      >
        <div className="border-b pb-1">
          <h2 className="min-w-0 text-2xl font-semibold text-cv-section">
            {t.about}
          </h2>
        </div>
        <p className="mt-4 text-cv-body-muted">{data.about}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 py-1">
          <ProfileEducationBadge label={profileBadgeLabel} />
          {afterBadge}
        </div>
      </section>

      {/* Domains - Full width (même grille 1/3 que le CV complet) */}
      <section id="domains" className="mt-2">
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
      <div className="cv-page-split mt-6">
        <div
          id="left"
          className="order-last flex w-full min-w-0 flex-col md:order-first md:col-span-1 print:order-first print:col-span-1"
        >
          {/* Niveau de formation : même bloc que le CV long (une colonne, y compris à l'impression). */}
          <EducationLevel
            content={data.educationLevel}
            sectionClassName="mb-6"
            pillsCompact
          />

          {/* Skills — masqué pour le moment (écran + impression). */}
          <section className="cv-short-skills-block mb-6 hidden">
            <h2 className="border-b pb-1 text-2xl font-semibold text-cv-tag-text">
              {t.skills}
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {data.skills.slice(0, 10).map((skill) => (
                <Skill key={skill.id} skill={skill} compact={true} />
              ))}
            </div>
          </section>

          {/* Études sans détail (établissement masqué) — même titre que le CV long (#studies). */}
          <section
            id="studies"
            className="cv-short-studies-section mb-6"
          >
            <h2 className="border-b pb-1 text-2xl font-semibold text-teal-300">
              {t.education}
            </h2>
            <ul className="cv-section-body-gap space-y-1">
              {data.studies.map((study) => (
                <StudyDisplay key={study.id} study={study} compact={true} />
              ))}
            </ul>
          </section>

          {/* Projets : même structure flex que les études (compact). */}
          <section
            id="projects"
            data-cv-section="projects"
            className="mb-6"
          >
            <h2 className="border-b pb-1 text-2xl font-semibold text-cv-tag-text">
              {data.projectsTitle}
            </h2>
            <ul className="cv-section-body-gap space-y-1">
              {data.projects.map((project: any) => (
                <li key={project.id}>
                  <Project project={project} compact />
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div id="main" className="w-full min-w-0 md:col-span-2 print:col-span-2">
          {/* Experience - Reusing JobDisplay component */}
          <section>
            <h2 className="border-b pb-1 text-2xl font-semibold text-cv-jobs">
              {t.experience}
            </h2>
            <ul className="cv-section-body-gap space-y-4">
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
