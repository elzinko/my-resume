'use client';

import React from 'react';

export interface CompactCvData {
  header: {
    name: string;
    role: string;
  };
  contact: {
    phone: string;
    email: string;
    location: string;
  };
  about: string;
  skills: Array<{ id: string; name: string }>;
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
  }>;
}

interface CompactCvLayoutProps {
  data: CompactCvData;
  lang: 'fr' | 'en';
}

export default function CompactCvLayout({ data, lang }: CompactCvLayoutProps) {
  const labels = {
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

  const t = labels[lang];

  // Only show 4 most recent jobs
  const recentJobs = data.jobs.slice(0, 4);

  return (
    <div className="print:p-0">
      {/* About - Full width section */}
      <section className="mb-8 print:mb-5">
        <h2 className="border-b border-teal-300/30 pb-2 text-xl font-semibold text-teal-300 md:text-2xl print:text-lg">
          {t.about}
        </h2>
        <p className="mt-4 text-sm md:text-base print:mt-3 print:text-sm">
          {data.about}
        </p>
      </section>

      {/* Two column layout */}
      <div className="flex flex-col gap-8 md:flex-row md:gap-10 print:flex-row print:gap-6">
        {/* Left Column */}
        <div className="md:w-1/3 print:w-1/3">
          {/* Contact */}
          <section className="mb-6 print:mb-4">
            <h2 className="border-b border-pink-300/30 pb-2 text-xl font-semibold text-pink-300 md:text-2xl print:text-lg">
              {t.contact}
            </h2>
            <ul className="mt-3 space-y-1 print:mt-2">
              <li className="text-sm text-pink-200 md:text-base print:text-sm">
                <strong>Tél.</strong>
                <span className="ml-2">{data.contact.phone}</span>
              </li>
              <li className="text-sm text-pink-200 md:text-base print:text-sm">
                <strong>Email</strong>
                <span className="ml-2">{data.contact.email}</span>
              </li>
              <li className="text-sm text-pink-200 md:text-base print:text-sm">
                <strong>Lieu</strong>
                <span className="ml-2">{data.contact.location}</span>
              </li>
            </ul>
          </section>

          {/* Domains - simplified, titles only */}
          <section className="mb-6 print:mb-4">
            <h2 className="border-b border-blue-500/30 pb-2 text-xl font-semibold text-blue-500 md:text-2xl print:text-lg">
              {t.expertise}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2 print:mt-2 print:gap-1.5">
              {data.domains.map((domain, idx) => (
                <span
                  key={idx}
                  className="text-sm font-semibold text-blue-400 md:text-base print:text-sm"
                >
                  {domain.title}{idx < data.domains.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section className="mb-6 print:mb-4">
            <h2 className="border-b border-blue-300/30 pb-2 text-xl font-semibold text-blue-300 md:text-2xl print:text-lg">
              {t.skills}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2 print:mt-2 print:gap-1.5">
              {data.skills.slice(0, 10).map((skill) => (
                <span
                  key={skill.id}
                  className="whitespace-nowrap rounded bg-gradient-to-r from-cyan-500 to-blue-500 px-2 py-1 text-xs text-white md:px-3 md:text-sm print:px-2 print:py-0.5 print:text-xs"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>

          {/* Education - compact in left column */}
          <section>
            <h2 className="border-b border-teal-300/30 pb-2 text-xl font-semibold text-teal-300 md:text-2xl print:text-lg">
              {t.education}
            </h2>
            <ul className="mt-3 space-y-2 print:mt-2 print:space-y-1">
              {data.studies.slice(0, 4).map((study) => (
                <li key={study.id} className="text-sm text-teal-300 md:text-base print:text-xs">
                  {study.name}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column */}
        <div className="md:w-2/3 print:w-2/3">
          {/* Experience - simplified without role */}
          <section>
            <h2 className="border-b border-pink-300/30 pb-2 text-xl font-semibold text-pink-300 md:text-2xl print:text-lg">
              {t.experience}
            </h2>
            <ul className="mt-3 space-y-4 print:mt-2 print:space-y-2">
              {recentJobs.map((job, idx) => (
                <li key={idx} className="print:pb-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-sky-300 md:text-lg print:text-sm">
                      {job.client}
                    </span>
                    <span className="text-xs text-fuchsia-300 md:text-sm print:text-xs">
                      {job.location}
                    </span>
                  </div>
                  <div className="text-xs text-sky-300 md:text-sm print:text-xs">
                    {job.startDate} - {job.endDate || t.present}
                  </div>
                  <p className="mt-1 text-sm text-gray-300 md:text-base print:text-xs">
                    {job.description}
                  </p>
                  {job.frameworks.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {job.frameworks.slice(0, 5).map((fw) => (
                        <span
                          key={fw.id}
                          className="whitespace-nowrap rounded bg-fuchsia-200 px-1 py-0.5 text-[9px] text-white md:px-1.5 md:text-[10px] print:text-[8px]"
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
            <div className="mt-4 border-l-4 border-teal-300 pl-3 print:mt-3">
              <p className="text-xs text-gray-400 md:text-sm print:text-xs">
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
