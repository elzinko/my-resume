'use client';

import React, { Suspense } from 'react';
import Pill from './Pill';
import Domain from './Domain';
import ContactDisplay from './ContactDisplay';
import JobDisplay from './JobDisplay';
import StudyDisplay from './StudyDisplay';
import JobFitSection from './JobFitSection';
import ExperienceClosingBlock from './ExperienceClosingBlock';
import ShortCvOnlineDetailLink from './ShortCvOnlineDetailLink';
import Project from './Project';
import SectionHeadingAts from './SectionHeadingAts';
import type { EducationLevelContent } from '@/lib/education-level-content';
import {
  formatRemainingClientsForShortCv,
  getExperienceClosingLabels,
  SHORT_CV_EXCLUDED_CLIENTS,
  SHORT_CV_MAX_JOBS,
} from '@/lib/cv-experience-footer';
import {
  buildJobSections,
  type FeaturedSection,
  type JobSection,
  type StubSection,
} from '@/lib/job-selection';

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
    slug?: string;
    client: string;
    clientUrl?: string;
    role: string;
    location: string;
    startDate: string;
    endDate?: string;
    description: string;
    descriptionShort?: string;
    bullets?: Array<{ id: string; text: string; link?: string }>;
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
  /** Slugs de missions à mettre en avant (ex. "jpb-systeme"). Vide = comportement chrono par défaut. */
  highlightedJobSlugs?: string[];
  /** Affiche la pastille « Bac+5 / Master's-level » dans la section adéquation. Opt-in via `?edu=1`. */
  showEducationLevel?: boolean;
  /** Emplacement réservé pour extensions — non utilisé par défaut. */
  children?: React.ReactNode;
}

export default function CompactCvLayout({
  data,
  lang,
  highlightedJobSlugs,
  showEducationLevel = false,
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
      otherExperience: 'Autres expériences',
    },
    en: {
      skills: 'Skills',
      experience: 'Experience',
      education: 'Education',
      expertise: 'Domains',
      about: 'Profile',
      present: 'Present',
      otherExperience: 'Other experience',
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
    otherExperience: fallback.otherExperience,
  };

  const closing = getExperienceClosingLabels(lang);
  const moreClientsLine = formatRemainingClientsForShortCv(data.jobs, lang);

  // Missions : mode mis-en-avant (featured + reste compressé) ou chronologique (défaut).
  type Job = (typeof data.jobs)[number];
  const jobSections: JobSection<Job>[] | null = buildJobSections(
    data.jobs,
    highlightedJobSlugs,
  );
  // Missions détaillées (dans l'ordre fourni) + unique bloc « Autres expériences ».
  const featuredSections = jobSections
    ? (jobSections.filter(
        (s) => s.type === 'featured',
      ) as FeaturedSection<Job>[])
    : null;
  const otherJobs =
    (
      jobSections?.find((s) => s.type === 'stub') as
        | StubSection<Job>
        | undefined
    )?.jobs ?? [];

  // Fallback : première tranche chronologique (comportement historique).
  const recentJobs = jobSections
    ? null
    : data.jobs
        .filter((job) => !SHORT_CV_EXCLUDED_CLIENTS.has(job.client))
        .slice(0, SHORT_CV_MAX_JOBS);

  return (
    <div className="cv-layout-short flex flex-col gap-[var(--cv-section-gap)]">
      {/* About - Full width section (same style as full CV) */}
      <section
        id="cv-short-about"
        className="cv-short-about mt-[var(--cv-section-gap)] pb-1"
      >
        <SectionHeadingAts
          section="about"
          locale={lang}
          title={t.about}
          accent="blue"
          className="min-w-0"
        />
        <p className="mt-4 text-cv-body-muted">{data.about}</p>
      </section>

      {/* Domains - Full width (même grille 1/3 que le CV complet) */}
      <section id="domains">
        {/* Ancre « Compétences / Skills » réservée à l'impression (anchor ATS au
            dessus des compétences) ; masquée à l'écran. */}
        <div className="mb-2 hidden">
          <SectionHeadingAts
            section="skills"
            locale={lang}
            title={t.skills}
            accent="tag"
            className="min-w-0"
          />
        </div>
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
      <div className="space-y-[var(--cv-section-gap)] print:hidden md:hidden">
        <Suspense fallback={null}>
          <JobFitSection
            lang={lang}
            educationLevel={data.educationLevel}
            variant="compact"
            showEducationLevel={showEducationLevel}
          />
        </Suspense>
        <section>
          <SectionHeadingAts
            section="contact"
            locale={lang}
            title={
              data.titles.contact || (lang === 'fr' ? 'Coordonnées' : 'Contact')
            }
            accent="emerald"
            className="min-w-0"
          />
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
      <div className="cv-page-split">
        <div
          id="left"
          className="order-last flex w-full min-w-0 flex-col gap-[var(--cv-section-gap)] print:order-first print:col-span-1 md:order-first md:col-span-1"
        >
          {/* Adéquation poste : masqué en mobile (dupliqué hors grille). */}
          <div className="hidden print:block md:block">
            <Suspense fallback={null}>
              <JobFitSection
                lang={lang}
                educationLevel={data.educationLevel}
                variant="compact"
                showEducationLevel={showEducationLevel}
              />
            </Suspense>
          </div>

          {/* Coordonnées (label : valeur) dans la colonne gauche — masqué en mobile (dupliqué hors grille). */}
          <section
            id="cv-short-contact"
            className="hidden print:block md:block"
          >
            <SectionHeadingAts
              section="contact"
              locale={lang}
              title={
                data.titles.contact ||
                (lang === 'fr' ? 'Coordonnées' : 'Contact')
              }
              accent="emerald"
              className="min-w-0"
            />
            <ContactDisplay
              contact={data.contact}
              cvShortInlineRows
              showLabels={false}
              compact={true}
              locale={lang}
            />
          </section>

          {/* Skills — masqué pour le moment (écran + impression). */}
          <section className="cv-short-skills-block hidden">
            <h2 className="border-b pb-1 text-2xl font-semibold text-cv-tag-text">
              {t.skills}
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {data.skills.slice(0, 10).map((skill) => (
                <Pill key={skill.id} color="skill" compact href={skill.link}>
                  {skill.name}
                </Pill>
              ))}
            </div>
          </section>

          {/* Études sans détail (établissement masqué) — même titre que le CV long (#studies). */}
          <section id="studies" className="cv-short-studies-section">
            <SectionHeadingAts
              section="studies"
              locale={lang}
              title={t.education}
              accent="purple"
            />
            <ul className="cv-section-simple-list">
              {data.studies.map((study) => (
                <StudyDisplay
                  key={study.id}
                  study={study}
                  compact={true}
                  color="text-purple-300"
                />
              ))}
            </ul>
          </section>

          {/* Projets : même structure flex que les études (compact). */}
          <section id="projects" data-cv-section="projects">
            <SectionHeadingAts
              section="projects"
              locale={lang}
              title={data.projectsTitle}
              accent="tag"
            />
            <ul className="cv-section-simple-list">
              {data.projects.map((project: any) => (
                <li key={project.id}>
                  <Project project={project} compact />
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
            <SectionHeadingAts
              section="jobs"
              locale={lang}
              title={t.experience}
              accent="pink"
            />

            {jobSections ? (
              /* ── Mode mis-en-avant : missions détaillées dans l'ordre fourni ── */
              <>
                <ul className="cv-section-body-gap space-y-4">
                  {featuredSections!.map((section, idx) => (
                    <li key={`f-${idx}`}>
                      <JobDisplay
                        job={section.job}
                        compact={true}
                        presentLabel={t.present}
                        locale={lang}
                      />
                    </li>
                  ))}
                </ul>
                {otherJobs.length > 0 ? (
                  /* ── « Autres expériences » : reste compressé (client · rôle · période) ── */
                  <div className="mt-6">
                    <h3 className="border-b border-cv-jobs/25 pb-1 text-base font-semibold text-cv-jobs print:text-[10px]">
                      {t.otherExperience}
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {otherJobs.map((j, i) => (
                        <li
                          key={`o-${i}`}
                          className="border-l-2 border-slate-600/40 py-0.5 pl-3 text-xs leading-relaxed text-cv-body-muted/70 print:text-[9px]"
                        >
                          <span className="font-medium text-cv-body-muted">
                            {j.clientUrl ? (
                              <a
                                href={j.clientUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {j.client}
                              </a>
                            ) : (
                              j.client
                            )}
                          </span>
                          {j.role ? (
                            <span className="text-slate-400"> · {j.role}</span>
                          ) : null}
                          {j.startDate ? (
                            <span className="ml-1 text-slate-500">
                              ({j.startDate}
                              {j.endDate ? ` – ${j.endDate}` : ''})
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            ) : (
              /* ── Mode chronologique par défaut ── */
              <ul className="cv-section-body-gap space-y-4">
                {recentJobs!.map((job, idx) => (
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
            )}

            <ExperienceClosingBlock
              moreExperience={closing.moreExperience}
              moreExperienceTail={closing.moreExperienceTail}
              moreClientsLine={jobSections ? null : moreClientsLine}
            />
            <Suspense fallback={null}>
              <ShortCvOnlineDetailLink lang={lang} />
            </Suspense>
          </section>
        </div>
      </div>
    </div>
  );
}
