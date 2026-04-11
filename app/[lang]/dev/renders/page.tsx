'use client';

import React, { useCallback, useEffect, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type GenerateState = 'idle' | 'running' | 'done' | 'error';

/* ------------------------------------------------------------------ */
/*  Variant definitions — FR + EN grouped per variant                  */
/* ------------------------------------------------------------------ */

interface VariantLang {
  lang: string;
  screenPath: string;
  previewPath: string;
  screen: string;
  mobile: string;
  printPreview: string;
  pdf: string;
}

interface Variant {
  id: string;
  title: string;
  langs: VariantLang[];
}

const VARIANTS: Variant[] = [
  {
    id: 'short',
    title: 'Short CV',
    langs: [
      {
        lang: 'FR',
        screenPath: '/fr/short',
        previewPath: '/fr/short?print=1',
        screen: 'fr-short-screen.png',
        mobile: 'fr-short-mobile.png',
        printPreview: 'fr-short-print-preview.png',
        pdf: 'fr-short-print.pdf',
      },
      {
        lang: 'EN',
        screenPath: '/en/short',
        previewPath: '/en/short?print=1',
        screen: 'en-short-screen.png',
        mobile: 'en-short-mobile.png',
        printPreview: 'en-short-print-preview.png',
        pdf: 'en-short-print.pdf',
      },
    ],
  },
  {
    id: 'full',
    title: 'Full CV',
    langs: [
      {
        lang: 'FR',
        screenPath: '/fr',
        previewPath: '/fr?print=1',
        screen: 'fr-full-screen.png',
        mobile: 'fr-full-mobile.png',
        printPreview: 'fr-full-print-preview.png',
        pdf: 'fr-full-print.pdf',
      },
      {
        lang: 'EN',
        screenPath: '/en',
        previewPath: '/en?print=1',
        screen: 'en-full-screen.png',
        mobile: 'en-full-mobile.png',
        printPreview: 'en-full-print-preview.png',
        pdf: 'en-full-print.pdf',
      },
    ],
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
/*  Snapshot card                                                      */
/* ------------------------------------------------------------------ */

function SnapshotCard({
  label,
  tag,
  tagClass,
  file,
  bust,
  isPdf,
}: {
  label: string;
  tag: string;
  tagClass: string;
  file: string;
  bust: number;
  isPdf?: boolean;
}) {
  return (
    <div
      style={{
        background: '#16213e',
        borderRadius: '8px',
        padding: '0.75rem',
        overflow: 'hidden',
      }}
    >
      <h3
        style={{
          color: '#a5b4fc',
          fontSize: '0.95rem',
          marginBottom: '0.5rem',
        }}
      >
        {label}{' '}
        <span
          className={tagClass}
          style={{
            display: 'inline-block',
            padding: '1px 6px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 600,
          }}
        >
          {tag}
        </span>
      </h3>
      {isPdf ? (
        <embed
          src={renderFileUrl(file, bust)}
          type="application/pdf"
          style={{
            width: '100%',
            height: '800px',
            border: '1px solid #334155',
            borderRadius: '4px',
            background: 'white',
          }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={renderFileUrl(file, bust)}
          alt={label}
          style={{
            width: '100%',
            height: 'auto',
            border: '1px solid #334155',
            borderRadius: '4px',
            cursor: 'zoom-in',
          }}
          onClick={() => window.open(renderFileUrl(file, bust), '_blank')}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Live iframe card                                                   */
/* ------------------------------------------------------------------ */

function LiveCard({ label, src }: { label: string; src: string }) {
  return (
    <div
      style={{ background: '#16213e', borderRadius: '8px', padding: '0.75rem' }}
    >
      <h3
        style={{
          color: '#a5b4fc',
          fontSize: '0.95rem',
          marginBottom: '0.5rem',
        }}
      >
        {label}
      </h3>
      <iframe
        src={src}
        style={{
          width: '100%',
          height: '900px',
          border: '1px solid #334155',
          borderRadius: '4px',
          background: 'white',
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DevRendersPage() {
  const [genState, setGenState] = useState<GenerateState>('idle');
  const [genOutput, setGenOutput] = useState('');
  const [showLog, setShowLog] = useState(false);
  const [bust, setBust] = useState(Date.now());
  const [lastGenerated, setLastGenerated] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'snapshots' | 'live'>('snapshots');
  const [expandedVariant, setExpandedVariant] = useState<string | null>(
    'short',
  );

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', color: '#5eead4', margin: 0 }}>
            CV Renders Comparison
          </h1>
          <p
            style={{
              color: '#94a3b8',
              marginTop: '0.5rem',
              fontSize: '0.9rem',
            }}
          >
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
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-9-9" />
                  <polyline points="21 3 21 12 12 12" />
                </svg>
                Regenerate
              </>
            )}
          </button>
          {/* View log button */}
          {genOutput ? (
            <button
              onClick={() => setShowLog(true)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #334155',
                background: 'transparent',
                color: genState === 'error' ? '#fca5a5' : '#86efac',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              View log
            </button>
          ) : null}
        </div>
      </div>

      {/* Spinner keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Log modal */}
      {showLog && genOutput ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)',
          }}
          onClick={() => setShowLog(false)}
        >
          <div
            style={{
              background: '#0f172a',
              borderRadius: '8px',
              padding: '1.5rem',
              width: '90vw',
              maxWidth: '800px',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              border: `1px solid ${
                genState === 'error' ? '#7f1d1d' : '#14532d'
              }`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>
                Generation Log
              </h3>
              <button
                onClick={() => setShowLog(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0.25rem',
                }}
              >
                &times;
              </button>
            </div>
            <pre
              style={{
                fontSize: '0.8rem',
                color: genState === 'error' ? '#fca5a5' : '#86efac',
                overflow: 'auto',
                flex: 1,
                margin: 0,
              }}
            >
              {genOutput}
            </pre>
          </div>
        </div>
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
            onClick={() =>
              setExpandedVariant(expandedVariant === v.id ? null : v.id)
            }
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '4px',
              border: `1px solid ${
                expandedVariant === v.id ? '#5eead4' : '#334155'
              }`,
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
            display:
              expandedVariant === null || expandedVariant === v.id
                ? 'block'
                : 'none',
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
            onClick={() =>
              setExpandedVariant(expandedVariant === v.id ? null : v.id)
            }
          >
            {v.title}
          </h2>

          {activeTab === 'live' ? (
            /* -------- Live iframes -------- */
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {/* Row 1: Screen — FR | EN */}
              <div>
                <h3
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Screen
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                  }}
                >
                  {v.langs.map((l) => (
                    <LiveCard
                      key={l.lang}
                      label={`${l.lang} Screen`}
                      src={l.screenPath}
                    />
                  ))}
                </div>
              </div>
              {/* Row 2: Print Preview — FR | EN */}
              <div>
                <h3
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Print Preview
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                  }}
                >
                  {v.langs.map((l) => (
                    <LiveCard
                      key={l.lang}
                      label={`${l.lang} Print Preview`}
                      src={l.previewPath}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* -------- Snapshots -------- */
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {/* Row 1: Screen + Print Preview — 4 columns */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '1rem',
                }}
              >
                {v.langs.map((l) => (
                  <SnapshotCard
                    key={`${l.lang}-screen`}
                    label={`${l.lang} Screen`}
                    tag="desktop"
                    tagClass="tag-screen"
                    file={l.screen}
                    bust={bust}
                  />
                ))}
                {v.langs.map((l) => (
                  <SnapshotCard
                    key={`${l.lang}-preview`}
                    label={`${l.lang} Print Preview`}
                    tag="?print=1"
                    tagClass="tag-preview"
                    file={l.printPreview}
                    bust={bust}
                  />
                ))}
              </div>
              {/* Row 2: Mobile + PDF — 4 columns */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '1rem',
                }}
              >
                {v.langs.map((l) => (
                  <SnapshotCard
                    key={`${l.lang}-mobile`}
                    label={`${l.lang} Mobile`}
                    tag="390px"
                    tagClass="tag-mobile"
                    file={l.mobile}
                    bust={bust}
                  />
                ))}
                {v.langs.map((l) => (
                  <SnapshotCard
                    key={`${l.lang}-pdf`}
                    label={`${l.lang} PDF`}
                    tag="A4"
                    tagClass="tag-pdf"
                    file={l.pdf}
                    bust={bust}
                    isPdf
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      ))}

      {/* Tag color classes */}
      <style>{`
        .tag-screen { background: #14532d; color: #86efac; }
        .tag-preview { background: #1e3a5f; color: #93c5fd; }
        .tag-pdf { background: #7f1d1d; color: #fca5a5; }
        .tag-mobile { background: #4a1d96; color: #c4b5fd; }
      `}</style>
    </div>
  );
}
