'use client';

import React from 'react';

export interface PdfCvData {
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
  skills: Array<{ name: string }>;
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
    frameworks: string[];
  }>;
  studies: Array<{
    name: string;
    establishment: string;
  }>;
}

interface PdfCvLayoutProps {
  data: PdfCvData;
  lang: 'fr' | 'en';
}

// Main technologies to highlight (filter from frameworks)
const MAIN_TECHS = [
  'react',
  'vue.js',
  'angular',
  'typescript',
  'java',
  'spring boot',
  'kotlin',
  'go',
  'python',
  'rust',
  'kubernetes',
  'docker',
  'aws',
  'gcp',
  'azure',
  'terraform',
];

export default function PdfCvLayout({ data, lang }: PdfCvLayoutProps) {
  const labels = {
    fr: {
      skills: 'Technologies',
      experience: 'Expériences clés',
      education: 'Formation',
      expertise: 'Expertise',
      clients: 'Clients',
    },
    en: {
      skills: 'Technologies',
      experience: 'Key Experience',
      education: 'Education',
      expertise: 'Expertise',
      clients: 'Clients',
    },
  };

  const t = labels[lang];

  // Only 3 most recent jobs for 1 page
  const recentJobs = data.jobs.slice(0, 3);

  // Filter main technologies from job frameworks
  const filterMainTechs = (frameworks: string[]) => {
    return frameworks
      .filter((fw) => MAIN_TECHS.some((tech) => fw.toLowerCase().includes(tech)))
      .slice(0, 4);
  };

  return (
    <div
      id="pdf-cv-layout"
      style={{
        fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
        fontSize: '7pt',
        lineHeight: '1.15',
        color: '#1f2937',
        backgroundColor: '#ffffff',
        width: '794px', // A4 at 96 DPI
        maxHeight: '1123px', // A4 at 96 DPI
        boxSizing: 'border-box',
        padding: '0',
      }}
    >
      {/* Header - compact */}
      <div
        style={{
          backgroundColor: '#0f172a',
          color: 'white',
          padding: '12px 20px 10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: '0' }}>
            {data.header.name}
          </h1>
          <p style={{ fontSize: '11px', margin: '2px 0 0 0', color: '#38bdf8', fontWeight: '500' }}>
            {data.header.role}
          </p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '9px', color: '#e2e8f0' }}>
          <p style={{ margin: '0' }}>{data.contact.phone}</p>
          <p style={{ margin: '1px 0' }}>{data.contact.email}</p>
          <p style={{ margin: '0' }}>{data.contact.location}</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'flex' }}>
        {/* Left Sidebar */}
        <div
          style={{
            width: '200px',
            backgroundColor: '#f8fafc',
            padding: '8px 10px',
            borderRight: '1px solid #e2e8f0',
          }}
        >
          {/* About - compact */}
          <p
            style={{
              fontSize: '8px',
              color: '#475569',
              margin: '0 0 8px 0',
              lineHeight: '1.2',
              fontStyle: 'italic',
            }}
          >
            {data.about.length > 120 ? data.about.substring(0, 120) + '...' : data.about}
          </p>

          {/* Skills/Technologies */}
          <section style={{ marginBottom: '8px' }}>
            <h2
              style={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#0f172a',
                borderBottom: '1px solid #0f172a',
                paddingBottom: '2px',
                marginBottom: '4px',
                textTransform: 'uppercase',
              }}
            >
              {t.skills}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
              {data.skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: '#0f172a',
                    color: 'white',
                    padding: '1px 4px',
                    borderRadius: '2px',
                    fontSize: '7px',
                    fontWeight: '500',
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>

          {/* Expertise Domains */}
          <section style={{ marginBottom: '8px' }}>
            <h2
              style={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#0f172a',
                borderBottom: '1px solid #0f172a',
                paddingBottom: '2px',
                marginBottom: '4px',
                textTransform: 'uppercase',
              }}
            >
              {t.expertise}
            </h2>
            {data.domains.map((domain, idx) => (
              <div key={idx} style={{ marginBottom: '3px' }}>
                <span style={{ fontSize: '8px', fontWeight: '600', color: '#334155' }}>
                  {domain.title}:{' '}
                </span>
                <span style={{ fontSize: '7px', color: '#64748b' }}>
                  {domain.tags.slice(0, 3).join(', ')}
                </span>
              </div>
            ))}
          </section>

          {/* Education */}
          <section style={{ marginBottom: '8px' }}>
            <h2
              style={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#0f172a',
                borderBottom: '1px solid #0f172a',
                paddingBottom: '2px',
                marginBottom: '4px',
                textTransform: 'uppercase',
              }}
            >
              {t.education}
            </h2>
            <p style={{ fontSize: '7px', color: '#334155', margin: '0', lineHeight: '1.3' }}>
              • Licence Pro Systèmes Info.
              <br />• DUT Informatique
              <br />• Machine Learning (Stanford)
            </p>
          </section>

          {/* Clients */}
          <section>
            <h2
              style={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#0f172a',
                borderBottom: '1px solid #0f172a',
                paddingBottom: '2px',
                marginBottom: '4px',
                textTransform: 'uppercase',
              }}
            >
              {t.clients}
            </h2>
            <p style={{ fontSize: '7px', color: '#64748b', margin: '0', lineHeight: '1.3' }}>
              BlablaCar, SNCF, LeBonCoin, Thales, JCDecaux, FDJ, BNP, Renault...
            </p>
          </section>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '8px 12px' }}>
          {/* Experience */}
          <h2
            style={{
              fontSize: '10px',
              fontWeight: '700',
              color: '#0f172a',
              borderBottom: '1.5px solid #0f172a',
              paddingBottom: '2px',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}
          >
            {t.experience}
          </h2>

          {recentJobs.map((job, idx) => {
            const mainFrameworks = filterMainTechs(job.frameworks);
            return (
              <div
                key={idx}
                style={{
                  marginBottom: '6px',
                  paddingBottom: '4px',
                  borderBottom:
                    idx < recentJobs.length - 1 ? '0.5px solid #e5e7eb' : 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#0f172a' }}>
                      {job.client}
                    </span>
                    <span
                      style={{
                        fontSize: '8px',
                        color: '#0891b2',
                        marginLeft: '6px',
                        fontWeight: '500',
                      }}
                    >
                      {job.role}
                    </span>
                  </div>
                  <span style={{ fontSize: '7px', color: '#64748b' }}>
                    {job.startDate}
                    {job.endDate ? ` - ${job.endDate}` : ''}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '8px',
                    color: '#4b5563',
                    margin: '2px 0 3px 0',
                    lineHeight: '1.2',
                  }}
                >
                  {job.description.length > 80
                    ? job.description.substring(0, 80) + '...'
                    : job.description}
                </p>

                {mainFrameworks.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                    {mainFrameworks.map((fw, fwIdx) => (
                      <span
                        key={fwIdx}
                        style={{
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          padding: '1px 4px',
                          borderRadius: '2px',
                          fontSize: '6px',
                          fontWeight: '600',
                        }}
                      >
                        {fw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Summary */}
          <div
            style={{
              marginTop: '6px',
              padding: '6px',
              backgroundColor: '#f1f5f9',
              borderRadius: '3px',
            }}
          >
            <p style={{ fontSize: '8px', color: '#475569', margin: '0', lineHeight: '1.25' }}>
              <strong>+20 ans d&apos;expérience</strong> en développement fullstack et DevOps.
              Autres clients : Edelia (EDF), Médiamétrie, Thales, Médiapost, SFR...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
