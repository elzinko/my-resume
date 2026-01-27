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
      {/* Header - Same style as main site */}
      <div className="mb-6 print:mb-4">
        <h1 className="text-4xl font-extrabold text-blue-600 md:text-5xl print:text-3xl">
          {data.header.name}
        </h1>
        <p className="mt-2 text-2xl text-teal-300 md:text-3xl print:mt-1 print:text-xl">
          {data.header.role}
        </p>
      </div>

      {/* Two column layout */}
      <div className="flex flex-col gap-6 md:flex-row print:flex-row print:gap-4">
        {/* Left Column */}
        <div className="md:w-1/3 print:w-1/3">
          {/* Contact */}
          <section className="mb-6 print:mb-4">
            <h2 className="border-b pb-1 text-xl font-semibold text-pink-300 print:text-base">
              {t.contact}
            </h2>
            <ul className="mt-3 space-y-1 print:mt-2">
              <li className="text-sm text-pink-200 print:text-xs">
                <strong>Tél.</strong>
                <span className="ml-2">{data.contact.phone}</span>
              </li>
              <li className="text-sm text-pink-200 print:text-xs">
                <strong>Email</strong>
                <span className="ml-2">{data.contact.email}</span>
              </li>
              <li className="text-sm text-pink-200 print:text-xs">
                <strong>Lieu</strong>
                <span className="ml-2">{data.contact.location}</span>
              </li>
            </ul>
          </section>

          {/* Skills */}
          <section className="mb-6 print:mb-4">
            <h2 className="border-b pb-1 text-xl font-semibold text-blue-300 print:text-base">
              {t.skills}
            </h2>
            <div className="mt-3 flex flex-wrap gap-1.5 print:mt-2 print:gap-1">
              {data.skills.slice(0, 10).map((skill) => (
                <span
                  key={skill.id}
                  className="whitespace-nowrap rounded bg-gradient-to-r from-cyan-500 to-blue-500 px-1.5 py-0.5 text-[10px] text-white md:px-2 md:py-1 md:text-xs print:px-1 print:py-0.5 print:text-[8px]"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>

          {/* Domains */}
          <section className="mb-6 print:mb-4">
            <h2 className="border-b pb-1 text-xl font-semibold text-blue-500 print:text-base">
              {t.expertise}
            </h2>
            <div className="mt-3 space-y-3 print:mt-2 print:space-y-2">
              {data.domains.map((domain, idx) => (
                <div key={idx}>
                  <h3 className="text-sm font-semibold text-blue-400 print:text-xs">
                    {domain.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {domain.tags.slice(0, 4).map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="text-xs text-gray-400 print:text-[9px]"
                      >
                        {tag}{tagIdx < Math.min(domain.tags.length, 4) - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="border-b pb-1 text-xl font-semibold text-teal-300 print:text-base">
              {t.education}
            </h2>
            <ul className="mt-3 space-y-2 print:mt-2">
              {data.studies.slice(0, 3).map((study) => (
                <li key={study.id}>
                  <strong className="text-sm text-teal-300 print:text-xs">
                    {study.name}
                  </strong>
                  <span className="block text-xs text-gray-400 print:text-[9px]">
                    {study.establishment}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column */}
        <div className="md:w-2/3 print:w-2/3">
          {/* Experience */}
          <section>
            <h2 className="border-b pb-1 text-xl font-semibold text-pink-300 print:text-base">
              {t.experience}
            </h2>
            <ul className="mt-3 space-y-4 print:mt-2 print:space-y-2">
              {recentJobs.map((job, idx) => (
                <li key={idx} className="print:pb-1">
                  <div className="flex justify-between">
                    <small className="font-bold text-sky-300 print:text-xs">
                      {job.client}
                    </small>
                    <small className="text-sky-300 print:text-xs">
                      {job.startDate} - {job.endDate || t.present}
                    </small>
                  </div>
                  <p className="flex justify-between">
                    <small className="text-teal-300 print:text-xs">{job.role}</small>
                    <small className="text-fuchsia-300 print:text-xs">{job.location}</small>
                  </p>
                  <p className="mt-1 text-xs text-gray-300 print:text-[10px]">
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
            <div className="mt-4 border-l-2 border-teal-300 pl-3 print:mt-2">
              <p className="text-xs text-gray-400 print:text-[10px]">
                <strong className="text-teal-300">{t.moreExperience}</strong>{' '}
                en développement fullstack et DevOps. {t.moreClients}
              </p>
            </div>
          </section>

          {/* About */}
          <section className="mt-6 print:mt-3">
            <h2 className="border-b pb-1 text-xl font-semibold text-teal-300 print:text-base">
              {t.about}
            </h2>
            <p className="mt-3 text-sm print:mt-2 print:text-xs">
              {data.about}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
