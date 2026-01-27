'use client';

import React from 'react';

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
    title: string;
    description: string;
    tags: string[];
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
      moreExperience: '+20 ans d\'expérience',
      moreClients: 'Autres clients : Edelia (EDF), JCDecaux, Lotsys (FDJ), Médiamétrie, Thales, Médiapost, BNP Paribas, Renault, SFR...',
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
      moreClients: 'Other clients: Edelia (EDF), JCDecaux, Lotsys (FDJ), Médiamétrie, Thales, Médiapost, BNP Paribas, Renault, SFR...',
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

  // Only show 5 most recent jobs
  const recentJobs = data.jobs.slice(0, 5);

  return (
    <div className="print:p-0">
      {/* About - Full width section */}
      <section className="mb-8 print:mb-4">
        <h2 className="border-b border-teal-300/50 pb-1 text-2xl font-semibold text-teal-300 print:text-base">
          {t.about}
        </h2>
        <p className="mt-3 text-sm print:mt-2 print:text-[10px]">
          {data.about}
        </p>
      </section>

      {/* Domains - Full width, like main CV but compact */}
      <section className="mb-10 print:mb-5">
        <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6 print:flex-row print:gap-4">
          {data.domains.map((domain, idx) => (
            <div key={idx} className="flex-1">
              <h3 className="border-b border-blue-500/50 pb-1 text-xl font-semibold text-blue-500 print:text-sm">
                {domain.title}
              </h3>
              <p className="mt-2 text-xs print:mt-1 print:text-[9px] print:leading-tight">
                {domain.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Two column layout */}
      <div className="flex flex-col gap-6 md:flex-row md:gap-10 print:flex-row print:gap-6">
        {/* Left Column */}
        <div className="md:w-1/3 print:w-1/3">
          {/* Contact */}
          <section className="mb-6 print:mb-4">
            <h2 className="border-b border-pink-300/50 pb-1 text-xl font-semibold text-pink-300 print:text-sm">
              {t.contact}
            </h2>
            <ul className="mt-2 space-y-0.5 print:mt-1">
              <li className="text-sm text-pink-200 print:text-xs">
                <strong className="text-pink-300">{data.contact.phoneTitle || 'Tél.'}</strong>
                <span className="ml-2">{data.contact.phone}</span>
              </li>
              <li className="text-sm text-pink-200 print:text-xs">
                <strong className="text-pink-300">{data.contact.emailTitle || 'Email'}</strong>
                <span className="ml-2">{data.contact.email}</span>
              </li>
              <li className="text-sm text-pink-200 print:text-xs">
                <strong className="text-pink-300">{data.contact.locationTitle || 'Lieu'}</strong>
                <span className="ml-2">{data.contact.location}</span>
              </li>
            </ul>
          </section>

          {/* Skills - Simple style without gradient */}
          <section className="mb-6 print:mb-4">
            <h2 className="border-b border-blue-300/50 pb-1 text-xl font-semibold text-blue-300 print:text-sm">
              {t.skills}
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5 print:mt-1 print:gap-1">
              {data.skills.slice(0, 10).map((skill) => (
                <span
                  key={skill.id}
                  className="whitespace-nowrap rounded border border-blue-400/50 px-2 py-0.5 text-xs text-blue-300 print:px-1.5 print:text-[10px]"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>

          {/* Education - Complete with dates */}
          <section>
            <h2 className="border-b border-teal-300/50 pb-1 text-xl font-semibold text-teal-300 print:text-sm">
              {t.education}
            </h2>
            <ul className="mt-2 space-y-1 print:mt-1 print:space-y-0.5">
              {data.studies.map((study) => {
                // Extract year from endDate (format: YYYY-MM-DD or similar)
                const endYear = study.endDate ? new Date(study.endDate).getFullYear() : null;
                return (
                  <li key={study.id} className="flex items-start justify-between gap-2">
                    <span className="text-xs text-teal-300 print:text-[10px]">
                      {study.name}
                    </span>
                    {endYear && (
                      <span className="whitespace-nowrap text-[10px] text-gray-400 print:text-[8px]">
                        {endYear}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* Right Column */}
        <div className="md:w-2/3 print:w-2/3">
          {/* Experience */}
          <section>
            <h2 className="border-b border-pink-300/50 pb-1 text-xl font-semibold text-pink-300 print:text-sm">
              {t.experience}
            </h2>
            <ul className="mt-2 space-y-3 print:mt-1 print:space-y-2">
              {recentJobs.map((job, idx) => (
                <li key={idx}>
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-sky-300 print:text-xs">
                      {job.client}
                    </span>
                    <span className="text-xs text-fuchsia-300 print:text-[10px]">
                      {job.location}
                    </span>
                  </div>
                  <div className="text-xs text-sky-300 print:text-[10px]">
                    {job.startDate} - {job.endDate || t.present}
                  </div>
                  <p className="mt-1 text-xs print:text-[10px]">
                    {job.description}
                  </p>
                  {job.frameworks.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {job.frameworks.slice(0, 5).map((fw) => (
                        <span
                          key={fw.id}
                          className="whitespace-nowrap rounded bg-fuchsia-200 px-1 py-0.5 text-[9px] text-white print:text-[8px]"
                        >
                          {fw.name.toLowerCase()}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* More experience note */}
            <div className="mt-4 border-l-4 border-teal-300/50 pl-3 print:mt-2">
              <p className="text-xs text-gray-400 print:text-[10px]">
                <strong className="text-teal-300">{t.moreExperience}</strong>{' '}
                en développement fullstack et DevOps. {t.moreClients}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
