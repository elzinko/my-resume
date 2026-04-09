'use client';

import React, { useCallback, useEffect, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface RenderFile {
  name: string;
  mtime: number;
}

type GenerateState = 'idle' | 'running' | 'done' | 'error';

/* ------------------------------------------------------------------ */
/*  Variant definitions                                                */
/* ------------------------------------------------------------------ */

interface Variant {
  id: string;
  title: string;
  /** Live page path for iframe (screen). */
  screenPath: string;
  /** Live page path for iframe (print-preview). */
  previewPath: string;
  /** Generated screenshot filenames. */
  screenshots: { label: string; file: string; tag: string; tagClass: string }[];
  /** Generated PDF filenames. */
  pdfs: { label: string; file: string; tag: string; tagClass: string }[];
}

const VARIANTS: Variant[] = [
  {
    id: 'fr-short',
    title: 'FR Short /fr/short',
    screenPath: '/fr/short',
    previewPath: '/fr/short?print=1',
    screenshots: [
      { label: 'Screen', file: 'fr-short-screen.png', tag: 'live', tagClass: 'tag-screen' },
      { label: 'Print Preview', file: 'fr-short-print-preview.png', tag: '?print=1', tagClass: 'tag-preview' },
    ],
    pdfs: [
      { label: 'PDF (CSS 1mm)', file: 'fr-short-print.pdf', tag: '1mm', tagClass: 'tag-pdf' },
      { label: 'PDF (Chrome 10mm)', file: 'fr-short-print-chrome.pdf', tag: '10mm', tagClass: 'tag-chrome' },
    ],
  },
  {
    id: 'en-short',
    title: 'EN Short /en/short',
    screenPath: '/en/short',
    previewPath: '/en/short?print=1',
    screenshots: [
      { label: 'Screen', file: 'en-short-screen.png', tag: 'live', tagClass: 'tag-screen' },
      { label: 'Print Preview', file: 'en-short-print-preview.png', tag: '?print=1', tagClass: 'tag-preview' },
    ],
    pdfs: [
      { label: 'PDF (CSS 1mm)', file: 'en-short-print.pdf', tag: '1mm', tagClass: 'tag-pdf' },
      { label: 'PDF (Chrome 10mm)', file: 'en-short-print-chrome.pdf', tag: '10mm', tagClass: 'tag-chrome' },
    ],
  },
  {
    id: 'fr-full',
    title: 'FR Full /fr',
    screenPath: '/fr',
    previewPath: '/fr?print=1',
    screenshots: [
      { label: 'Screen', file: 'fr-full-screen.png', tag: 'live', tagClass: 'tag-screen' },
      { label: 'Print Preview', file: 'fr-full-print-preview.png', tag: '?print=1', tagClass: 'tag-preview' },
    ],
    pdfs: [
      { label: 'PDF', file: 'fr-full-print.pdf', tag: '@media print', tagClass: 'tag-pdf' },
    ],
  },
  {
    id: 'en-full',
    title: 'EN Full /en',
    screenPath: '/en',
    previewPath: '/en?print=1',
    screenshots: [
      { label: 'Screen', file: 'en-full-screen.png', tag: 'live', tagClass: 'tag-screen' },
      { label: 'Print Preview', file: 'en-full-print-preview.png', tag: '?print=1', tagClass: 'tag-preview' },
    ],
    pdfs: [
      { label: 'PDF', file: 'en-full-print.pdf', tag: '@media print', tagClass: 'tag-pdf' },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile (390px)',
    screenPath: '/fr',
    previewPath: '/en',
    screenshots: [
      { label: 'FR Mobile', file: 'fr-full-mobile.png', tag: '390px', tagClass: 'tag-mobile' },
      { label: 'EN Mobile', file: 'en-full-mobile.png', tag: '390px', tagClass: 'tag-mobile' },
    ],
    pdfs: [],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function renderFileUrl(name: string, bust: number) {
  return `/api/renders/file?name=${encodeURIComponent(name)}&t=${bust}`;
}

function timeAgo(ms: number): string {
  const sec = Math.round((Date.now() - ms) / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}min ago`;
  const hr = Math.round(min / 60);
  return `${hr}h ago`;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DevRendersPage() {
  const [genState, setGenState] = useState<GenerateState>('idle');
  const [genOutput, setGenOutput] = useState('');
  const [bust, setBust] = useState(Date.now());
  const [lastGenerated, setLastGenerated] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'snapshots' | 'live'>('snapshots');
  const [expandedVariant, setExpandedVariant] = useState<string | null>('fr-short');

  // Fetch last generated time
  const refreshList = useCallback(() => {
    fetch('/api/renders/list')
      .then((r) => r.json())
      .then((d) => {
        if (d.lastGenerated) setLastGenerated(d.lastGenerated);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshList();
  }, [refreshList, bust]);

  const handleGenerate = async () => {
    setGenState('running');
    setGenOutput('');
    try {
      const res = await fetch('/api/renders/generate', { method: 'POST' });
      const data = await res.json();
      setGenOutput(data.output || data.error || 'Unknown result');
      setGenState(data.ok ? 'done' : 'error');
      // Bust cache for images/PDFs
      setBust(Date.now());
    } catch (err: any) {
      setGenOutput(err.message);
      setGenState('error');
    }
  };

  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#1a1a2e',
        color: '#e0e0e0',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#5eead4', margin: 0 }}>
            CV Renders Comparison
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Compare screen, print-preview, and PDF output side by side.
            {lastGenerated ? (
              <span style={{ marginLeft: '1rem', color: '#64748b' }}>
                Last generated: {timeAgo(lastGenerated)}
              </span>
            ) : null}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Tab switcher */}
          <div
            style={{
              display: 'flex',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '1px solid #334155',
            }}
          >
            {(['snapshots', 'live'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.4rem 1rem',
                  background: activeTab === tab ? '#334155' : 'transparent',
                  color: activeTab === tab ? '#5eead4' : '#94a3b8',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                {tab === 'snapshots' ? 'Snapshots' : 'Live'}
              </button>
            ))}
          </div>
          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={genState === 'running'}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '6px',
              border: 'none',
              background: genState === 'running' ? '#475569' : '#059669',
              color: 'white',
              fontWeight: 600,
              cursor: genState === 'running' ? 'wait' : 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {genState === 'running' ? (
              <>
                <span
                  style={{
                    display: 'inline-block',
                    width: 14,
                    height: 14,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                Generating...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9" />
                  <polyline points="21 3 21 12 12 12" />
                </svg>
                Regenerate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Spinner keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Generate output */}
      {genOutput ? (
        <pre
          style={{
            background: '#0f172a',
            padding: '1rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            color: genState === 'error' ? '#fca5a5' : '#86efac',
            marginBottom: '1.5rem',
            maxHeight: '200px',
            overflow: 'auto',
            border: `1px solid ${genState === 'error' ? '#7f1d1d' : '#14532d'}`,
          }}
        >
          {genOutput}
        </pre>
      ) : null}

      {/* Nav links */}
      <nav
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <a
          href="../components"
          style={{
            padding: '0.3rem 0.75rem',
            borderRadius: '4px',
            border: '1px solid #334155',
            color: '#94a3b8',
            textDecoration: 'none',
            fontSize: '0.8rem',
          }}
        >
          Components Storybook
        </a>
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            onClick={() => setExpandedVariant(expandedVariant === v.id ? null : v.id)}
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '4px',
              border: `1px solid ${expandedVariant === v.id ? '#5eead4' : '#334155'}`,
              background: expandedVariant === v.id ? '#1e3a5f' : 'transparent',
              color: expandedVariant === v.id ? '#5eead4' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            {v.id}
          </button>
        ))}
      </nav>

      {/* Variants */}
      {VARIANTS.map((v) => (
        <section
          key={v.id}
          style={{
            marginBottom: '2rem',
            display: expandedVariant === null || expandedVariant === v.id ? 'block' : 'none',
          }}
        >
          <h2
            style={{
              fontSize: '1.3rem',
              color: '#93c5fd',
              borderBottom: '1px solid #334155',
              paddingBottom: '0.5rem',
              marginBottom: '1rem',
              cursor: 'pointer',
            }}
            onClick={() => setExpandedVariant(expandedVariant === v.id ? null : v.id)}
          >
            {v.title}
          </h2>

          {activeTab === 'live' ? (
            /* -------- Live iframes -------- */
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: '#16213e', borderRadius: '8px', padding: '0.75rem' }}>
                <h3 style={{ color: '#a5b4fc', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  Screen
                </h3>
                <iframe
                  src={v.screenPath}
                  style={{
                    width: '100%',
                    height: '900px',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    background: 'white',
                  }}
                />
              </div>
              <div style={{ background: '#16213e', borderRadius: '8px', padding: '0.75rem' }}>
                <h3 style={{ color: '#a5b4fc', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  Print Preview
                </h3>
                <iframe
                  src={v.previewPath}
                  style={{
                    width: '100%',
                    height: '900px',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    background: 'white',
                  }}
                />
              </div>
            </div>
          ) : (
            /* -------- Snapshots (screenshots + PDFs) -------- */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${v.screenshots.length + v.pdfs.length}, 1fr)`,
                gap: '1rem',
              }}
            >
              {v.screenshots.map((s) => (
                <div
                  key={s.file}
                  style={{ background: '#16213e', borderRadius: '8px', padding: '0.75rem', overflow: 'hidden' }}
                >
                  <h3 style={{ color: '#a5b4fc', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                    {s.label}{' '}
                    <span
                      className={s.tagClass}
                      style={{
                        display: 'inline-block',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      }}
                    >
                      {s.tag}
                    </span>
                  </h3>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={renderFileUrl(s.file, bust)}
                    alt={s.label}
                    style={{
                      width: '100%',
                      height: 'auto',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      cursor: 'zoom-in',
                    }}
                    onClick={() => window.open(renderFileUrl(s.file, bust), '_blank')}
                  />
                </div>
              ))}
              {v.pdfs.map((p) => (
                <div
                  key={p.file}
                  style={{ background: '#16213e', borderRadius: '8px', padding: '0.75rem', overflow: 'hidden' }}
                >
                  <h3 style={{ color: '#a5b4fc', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                    {p.label}{' '}
                    <span
                      className={p.tagClass}
                      style={{
                        display: 'inline-block',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      }}
                    >
                      {p.tag}
                    </span>
                  </h3>
                  <embed
                    src={renderFileUrl(p.file, bust)}
                    type="application/pdf"
                    style={{
                      width: '100%',
                      height: '800px',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      background: 'white',
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      {/* Tag color classes */}
      <style>{`
        .tag-screen { background: #14532d; color: #86efac; }
        .tag-preview { background: #1e3a5f; color: #93c5fd; }
        .tag-pdf { background: #7f1d1d; color: #fca5a5; }
        .tag-chrome { background: #78350f; color: #fde68a; }
        .tag-mobile { background: #4a1d96; color: #c4b5fd; }
      `}</style>
    </div>
  );
}
