'use client';

import React, { Suspense } from 'react';
import Skill from './skill';
import Domain from './domain';
import ContactDisplay from './ContactDisplay';
import JobDisplay from './JobDisplay';
import StudyDisplay from './StudyDisplay';
import JobFitSection from './JobFitSection';
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
  /** Emplacement réservé pour extensions — non utilisé par défaut. */
  children?: React.ReactNode;
}

export default function CompactCvLayout({
  data,
  lang,
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

      {/* Mobile-only : Adéquation poste + Coordonnées, hors grille, avant Expérience. */}
      <div className="mt-6 space-y-6 md:hidden print:hidden">
        <Suspense fallback={null}>
          <JobFitSection
            lang={lang}
            educationLevel={data.educationLevel}
            variant="compact"
          />
        </Suspense>
        <section>
          <div className="border-b pb-1">
            <h2 className="min-w-0 text-2xl font-semibold text-rose-300">
              {data.titles.contact || (lang === 'fr' ? 'Coordonnées' : 'Contact')}
            </h2>
          </div>
          <ContactDisplay
            contact={data.contact}
            cvShortInlineRows
            showLabels={false}
            compact={true}
            locale={lang}
          />
        </section>
      </div>

      {/* Colonne gauche 1/3 + expériences 2/3 (grille alignée sur les domaines) */}
      <div className="cv-page-split mt-8">
        <div
          id="left"
          className="order-last flex w-full min-w-0 flex-col md:order-first md:col-span-1 print:order-first print:col-span-1"
        >
          {/* Adéquation poste : masqué en mobile (dupliqué hors grille). */}
          <div className="hidden md:block print:block">
            <Suspense fallback={null}>
              <JobFitSection
                lang={lang}
                educationLevel={data.educationLevel}
                variant="compact"
              />
            </Suspense>
          </div>

          {/* Coordonnées (label : valeur) dans la colonne gauche — masqué en mobile (dupliqué hors grille). */}
          <section id="cv-short-contact" className="mb-6 hidden md:block print:block">
            <div className="border-b pb-1">
              <h2 className="min-w-0 text-2xl font-semibold text-rose-300">
                {data.titles.contact || (lang === 'fr' ? 'Coordonnées' : 'Contact')}
              </h2>
            </div>
            <ContactDisplay
              contact={data.contact}
              cvShortInlineRows
              showLabels={false}
              compact={true}
              locale={lang}
            />
          </section>

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
            <h2 className="border-b pb-1 text-2xl font-semibold text-purple-300">
              {t.education}
            </h2>
            <ul className="cv-section-simple-list">
              {data.studies.map((study) => (
                <StudyDisplay key={study.id} study={study} compact={true} color="text-purple-300" />
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
            <ul className="cv-section-simple-list">
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
              />
            </Suspense>
          </section>
        </div>
      </div>
    </div>
  );
}
