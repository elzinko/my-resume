'use client';

import React from 'react';
import Skill from './skill';
import Domain from './domain';
import ContactDisplay from './ContactDisplay';
import JobDisplay from './JobDisplay';
import StudyDisplay from './StudyDisplay';
import EducationLevel from './EducationLevel';
import type { EducationLevelContent } from '@/lib/education-level-content';

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
}

interface CompactCvLayoutProps {
  data: CompactCvData;
  lang: 'fr' | 'en';
  /** Bloc optionnel (ex. adéquation offre) inséré après les domaines, avant la grille. */
  children?: React.ReactNode;
}

export default function CompactCvLayout({
  data,
  lang,
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
      contact: 'Contact',
      present: 'Présent',
      moreExperience: "+20 ans d'expérience",
      moreExperienceTail: 'en développement fullstack et DevOps.',
      moreClients:
        'Autres clients : Edelia (EDF), JCDecaux, Lotsys (FDJ), Médiamétrie, Thales, Médiapost, BNP Paribas, Renault, SFR...',
    },
    en: {
      skills: 'Skills',
      experience: 'Experience',
      education: 'Education',
      expertise: 'Domains',
      about: 'Profile',
      contact: 'Contact',
      present: 'Now',
      moreExperience: '+20 years of experience',
      moreExperienceTail: 'in full-stack development and DevOps.',
      moreClients:
        'Other clients: Edelia (EDF), JCDecaux, Lotsys (FDJ), Médiamétrie, Thales, Médiapost, BNP Paribas, Renault, SFR...',
    },
  };

  const fallback = fallbackLabels[lang];

  // Use DatoCMS titles with fallback
  const t = {
    about: data.titles.about || fallback.about,
    skills: data.titles.skills || fallback.skills,
    contact: data.titles.contact || fallback.contact,
    education: data.titles.education || fallback.education,
    experience: data.titles.experience || fallback.experience,
    expertise: fallback.expertise,
    present: fallback.present,
    moreExperience: fallback.moreExperience,
    moreExperienceTail: fallback.moreExperienceTail,
    moreClients: fallback.moreClients,
  };

  // Missions récentes sans puces ; sans RelevanC (CV court) ; le bloc « +20 ans » reste en bas.
  const recentJobs = data.jobs
    .filter((job) => job.client !== 'RelevanC')
    .slice(0, 8);

  return (
    <div className="print:p-0">
      {/* About - Full width section (same style as full CV) */}
      <section className="mt-10 print:mt-4">
        <h2 className="border-b pb-1 text-2xl font-semibold text-cv-section print:text-base">
          {t.about}
        </h2>
        <p className="mt-4 text-cv-body-muted print:mt-2 print:text-[10px]">
          {data.about}
        </p>
      </section>

      {/* Domains - Full width (même grille 1/3 que le CV complet) */}
      <section id="domains" className="mt-10 print:mt-4">
        <div className="cv-domains-grid">
          {data.domains.map((domain) => (
            <Domain
              key={domain.id || domain.name}
              domain={domain}
              showTags={false}
              compact={true}
            />
          ))}
        </div>
      </section>

      {children}

      {/* Colonne gauche 1/3 + expériences 2/3 (grille alignée sur les domaines) */}
      <div className="cv-page-split mt-14 print:mt-6">
        <div
          id="left"
          className="order-last flex w-full min-w-0 flex-col print:order-first print:col-span-1 md:order-first md:col-span-1"
        >
          {/* Contact - Reusing ContactDisplay component */}
          <section className="mb-6 print:mb-4">
            <h2 className="border-b pb-1 text-2xl font-semibold text-cv-jobs print:text-sm">
              {t.contact}
            </h2>
            <ContactDisplay contact={data.contact} compact={true} />
          </section>

          {/* Skills - Reusing Skill component in compact mode */}
          <section className="mb-6 print:mb-4">
            <h2 className="border-b pb-1 text-2xl font-semibold text-cv-tag-text print:text-sm">
              {t.skills}
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5 print:mt-1 print:gap-1">
              {data.skills.slice(0, 10).map((skill) => (
                <Skill key={skill.id} skill={skill} compact={true} />
              ))}
            </div>
          </section>

          {/* Niveau de formation avant le détail des études (aligné CV long) */}
          <EducationLevel content={data.educationLevel} compact={true} />

          {/* Education - Reusing StudyDisplay component */}
          <section>
            <h2 className="border-b pb-1 text-2xl font-semibold text-teal-300 print:text-sm">
              {t.education}
            </h2>
            <ul className="mt-2 space-y-1 print:mt-1 print:space-y-0.5">
              {data.studies.map((study) => (
                <StudyDisplay key={study.id} study={study} compact={true} />
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
            <h2 className="border-b pb-1 text-2xl font-semibold text-cv-jobs print:text-sm">
              {t.experience}
            </h2>
            <ul className="mt-2 space-y-4 print:mt-1 print:space-y-3">
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

            {/* More experience note */}
            <div className="mt-4 border-l-4 border-teal-300/50 pl-3 print:mt-2">
              <p className="text-xs text-gray-400 print:text-[10px]">
                <strong className="text-teal-300">{t.moreExperience}</strong>{' '}
                {t.moreExperienceTail} {t.moreClients}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
