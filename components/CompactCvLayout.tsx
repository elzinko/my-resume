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
}

export default function CompactCvLayout({ data, lang }: CompactCvLayoutProps) {
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
      present: 'Present',
      moreExperience: '+20 years of experience',
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
    moreClients: fallback.moreClients,
  };

  // Six most recent jobs — tient sur une page A4 avec le reste du CV court
  const recentJobs = data.jobs.slice(0, 6);

  return (
    <div className="print:p-0">
      {/* About - Full width section (same style as full CV) */}
      <section className="mt-10 print:mt-4">
        <h2 className="border-b pb-1 text-2xl font-semibold text-cv-section print:text-base">
          {t.about}
        </h2>
        <p className="mt-4 print:mt-2 print:text-[10px]">{data.about}</p>
      </section>

      {/* Domains - Full width (same style as full CV, reusing Domain component) */}
      <section className="mt-10 print:mt-4">
        <div className="flex w-full flex-col print:flex-row print:space-x-4 md:flex-row md:space-x-6">
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

      {/* Two column layout */}
      <div className="mt-14 flex flex-col gap-6 print:mt-6 print:flex-row print:gap-6 md:flex-row md:gap-10">
        {/* Left Column */}
        <div className="print:w-1/3 md:w-1/3">
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

          {/* Education Level */}
          <EducationLevel content={data.educationLevel} compact={true} />
        </div>

        {/* Right Column */}
        <div className="print:w-2/3 md:w-2/3">
          {/* Experience - Reusing JobDisplay component */}
          <section>
            <h2 className="border-b pb-1 text-2xl font-semibold text-cv-jobs print:text-sm">
              {t.experience}
            </h2>
            <ul className="mt-2 space-y-3 print:mt-1 print:space-y-1.5">
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
                <strong className="text-teal-300">{t.moreExperience}</strong> en
                développement fullstack et DevOps. {t.moreClients}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
