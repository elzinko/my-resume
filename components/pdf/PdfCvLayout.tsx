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

export default function PdfCvLayout({ data, lang }: PdfCvLayoutProps) {
  const labels = {
    fr: {
      contact: 'Contact',
      skills: 'Technologies',
      experience: 'Expériences',
      education: 'Formation',
      expertise: 'Expertise',
    },
    en: {
      contact: 'Contact',
      skills: 'Technologies',
      experience: 'Experience',
      education: 'Education',
      expertise: 'Expertise',
    },
  };

  const t = labels[lang];

  // Limit to fit on ONE A4 page - only show 5 recent jobs
  const recentJobs = data.jobs.slice(0, 5);
  // Only 2 studies
  const mainStudies = data.studies.slice(0, 2);

  return (
    <div
      id="pdf-cv-layout"
      style={{
        fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
        fontSize: '8pt',
        lineHeight: '1.25',
        color: '#1f2937',
        backgroundColor: '#ffffff',
        width: '210mm',
        height: '297mm',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Compact Header */}
      <div
        style={{
          backgroundColor: '#0f172a',
          color: 'white',
          padding: '8mm 10mm 6mm 10mm',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '20pt',
              fontWeight: '700',
              margin: '0',
              letterSpacing: '0.3px',
            }}
          >
            {data.header.name}
          </h1>
          <p
            style={{
              fontSize: '10pt',
              margin: '1mm 0 0 0',
              color: '#38bdf8',
              fontWeight: '500',
            }}
          >
            {data.header.role}
          </p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '7.5pt', color: '#e2e8f0' }}>
          <p style={{ margin: '0' }}>{data.contact.phone}</p>
          <p style={{ margin: '0.5mm 0' }}>{data.contact.email}</p>
          <p style={{ margin: '0' }}>{data.contact.location}</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'flex', height: 'calc(297mm - 32mm)' }}>
        {/* Left Sidebar - narrower */}
        <div
          style={{
            width: '58mm',
            backgroundColor: '#f8fafc',
            padding: '4mm 5mm',
            borderRight: '1px solid #e2e8f0',
          }}
        >
          {/* Skills/Technologies */}
          <section style={{ marginBottom: '4mm' }}>
            <h2
              style={{
                fontSize: '8pt',
                fontWeight: '700',
                color: '#0f172a',
                borderBottom: '1.5px solid #0f172a',
                paddingBottom: '1mm',
                marginBottom: '2mm',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {t.skills}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
              {data.skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: '#0f172a',
                    color: 'white',
                    padding: '0.8mm 2mm',
                    borderRadius: '1.5mm',
                    fontSize: '6pt',
                    fontWeight: '500',
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>

          {/* Expertise Domains */}
          <section style={{ marginBottom: '4mm' }}>
            <h2
              style={{
                fontSize: '8pt',
                fontWeight: '700',
                color: '#0f172a',
                borderBottom: '1.5px solid #0f172a',
                paddingBottom: '1mm',
                marginBottom: '2mm',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {t.expertise}
            </h2>
            {data.domains.map((domain, idx) => (
              <div key={idx} style={{ marginBottom: '2mm' }}>
                <h3
                  style={{
                    fontSize: '7pt',
                    fontWeight: '600',
                    color: '#334155',
                    margin: '0 0 0.5mm 0',
                  }}
                >
                  {domain.title}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8mm' }}>
                  {domain.tags.slice(0, 4).map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      style={{
                        backgroundColor: '#e2e8f0',
                        color: '#475569',
                        padding: '0.3mm 1.5mm',
                        borderRadius: '1mm',
                        fontSize: '5.5pt',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Education - compact */}
          <section>
            <h2
              style={{
                fontSize: '8pt',
                fontWeight: '700',
                color: '#0f172a',
                borderBottom: '1.5px solid #0f172a',
                paddingBottom: '1mm',
                marginBottom: '2mm',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {t.education}
            </h2>
            {mainStudies.map((study, idx) => (
              <div key={idx} style={{ marginBottom: '1.5mm' }}>
                <p
                  style={{
                    fontSize: '6.5pt',
                    fontWeight: '600',
                    color: '#334155',
                    margin: '0',
                    lineHeight: '1.2',
                  }}
                >
                  {study.name}
                </p>
                <p
                  style={{
                    fontSize: '5.5pt',
                    color: '#64748b',
                    margin: '0',
                  }}
                >
                  {study.establishment}
                </p>
              </div>
            ))}
          </section>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '4mm 6mm', overflow: 'hidden' }}>
          {/* About - very compact */}
          <p
            style={{
              fontSize: '7pt',
              color: '#475569',
              margin: '0 0 3mm 0',
              lineHeight: '1.3',
              fontStyle: 'italic',
              borderLeft: '2px solid #38bdf8',
              paddingLeft: '2mm',
            }}
          >
            {data.about}
          </p>

          {/* Experience */}
          <h2
            style={{
              fontSize: '8pt',
              fontWeight: '700',
              color: '#0f172a',
              borderBottom: '1.5px solid #0f172a',
              paddingBottom: '1mm',
              marginBottom: '2mm',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {t.experience}
          </h2>

          {recentJobs.map((job, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '2mm',
                paddingBottom: '1.5mm',
                borderBottom:
                  idx < recentJobs.length - 1
                    ? '0.5px solid #e5e7eb'
                    : 'none',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontSize: '7.5pt',
                      fontWeight: '700',
                      color: '#0f172a',
                    }}
                  >
                    {job.client}
                  </span>
                  <span
                    style={{
                      fontSize: '6.5pt',
                      color: '#0891b2',
                      marginLeft: '2mm',
                      fontWeight: '500',
                    }}
                  >
                    {job.role}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '6pt',
                    color: '#64748b',
                    flexShrink: 0,
                  }}
                >
                  {job.startDate}
                  {job.endDate ? ` - ${job.endDate}` : ''} | {job.location}
                </span>
              </div>

              <p
                style={{
                  fontSize: '6pt',
                  color: '#4b5563',
                  margin: '0.3mm 0',
                  lineHeight: '1.2',
                }}
              >
                {job.description.length > 100
                  ? job.description.substring(0, 100) + '...'
                  : job.description}
              </p>

              {job.frameworks.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.8mm',
                    marginTop: '0.8mm',
                  }}
                >
                  {job.frameworks.slice(0, 6).map((fw, fwIdx) => (
                    <span
                      key={fwIdx}
                      style={{
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        padding: '0.3mm 1.5mm',
                        borderRadius: '1mm',
                        fontSize: '5pt',
                        fontWeight: '500',
                      }}
                    >
                      {fw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
