'use client';

import React, { useLayoutEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Pill from './Pill';
import {
  DEV_PRESETS,
  type DevTagFive,
  isDevDomainId,
  resolveDevDomainTagsFromSearchParams,
} from '@/lib/dev-domain-tags';
import {
  OPS_PRESETS,
  type OpsTagFive,
  isOpsDomainId,
  resolveOpsDomainTagsFromSearchParams,
} from '@/lib/ops-domain-tags';

/** Trait sous le titre (comportement historique) ou barre verticale à gauche du libellé. */
export type DomainTitleAccent = 'underline' | 'verticalBar';

/**
 * Bascule globale sans modifier les parents (`domains.tsx`, `CompactCvLayout`).
 * Passer à `'verticalBar'` pour activer la barre à gauche partout.
 */
export const DOMAIN_TITLE_ACCENT_DEFAULT: DomainTitleAccent = 'verticalBar';

function DomainFiveTagsRow({
  tags,
  compact,
}: {
  tags: readonly string[];
  compact: boolean;
}) {
  const rowClass = compact
    ? 'mt-auto flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 py-1 print:mt-1 print:gap-x-1 print:py-0.5'
    : 'mt-auto flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 py-1';

  return (
    <div className={rowClass}>
      {tags.map((name) => (
        <Pill key={name} color="domain" compact={compact}>
          {name.toLowerCase()}
        </Pill>
      ))}
    </div>
  );
}

/**
 * Même rendu SSR / premier paint client que l’ancien fallback Suspense, puis synchro URL
 * en `useLayoutEffect` pour éviter les erreurs d’hydratation (Suspense + useSearchParams dans un client).
 */
function DevDomainTagsFromUrl({ compact }: { compact: boolean }) {
  const sp = useSearchParams();
  const queryKey = sp.toString();
  const [tags, setTags] = useState<DevTagFive>(() => DEV_PRESETS.default);

  useLayoutEffect(() => {
    setTags(
      resolveDevDomainTagsFromSearchParams(new URLSearchParams(queryKey)),
    );
  }, [queryKey]);

  return <DomainFiveTagsRow tags={tags} compact={compact} />;
}

function OpsDomainTagsFromUrl({ compact }: { compact: boolean }) {
  const sp = useSearchParams();
  const queryKey = sp.toString();
  const [tags, setTags] = useState<OpsTagFive>(() => OPS_PRESETS.aws);

  useLayoutEffect(() => {
    setTags(
      resolveOpsDomainTagsFromSearchParams(new URLSearchParams(queryKey)),
    );
  }, [queryKey]);

  return <DomainFiveTagsRow tags={tags} compact={compact} />;
}

interface DomainProps {
  domain: {
    id?: string;
    name: string;
    description: string;
    competencies?: Array<{
      id: string;
      name: string;
      link?: string;
    }>;
  };
  showTags?: boolean;
  compact?: boolean;
  /** Surcharge ponctuelle ; sinon {@link DOMAIN_TITLE_ACCENT_DEFAULT}. */
  titleAccent?: DomainTitleAccent;
}

export default function Domain({
  domain,
  showTags = true,
  compact = false,
  titleAccent,
}: DomainProps) {
  const accent = titleAccent ?? DOMAIN_TITLE_ACCENT_DEFAULT;

  // CV court : domaines en SOUS-titres (text-lg) → ils se lisent comme une
  // partie du Profil, pas comme des sections (text-2xl). Taille unique écran
  // ET impression. CV complet : niveau section (text-2xl).
  const titleTypo = compact
    ? 'text-lg font-semibold text-blue-400'
    : 'text-2xl font-semibold text-blue-400';

  const titleBlock =
    accent === 'verticalBar' ? (
      <div
        className={`flex items-stretch gap-1.5 text-blue-400 ${
          compact ? 'print:gap-1' : ''
        }`}
      >
        <span
          className="w-0.5 shrink-0 self-stretch rounded-full bg-current print:w-px"
          aria-hidden
        />
        <h2 className={`min-w-0 flex-1 leading-tight ${titleTypo}`}>
          {domain.name}
        </h2>
      </div>
    ) : (
      <h2 className={`border-b pb-0.5 md:pb-1 ${titleTypo}`}>{domain.name}</h2>
    );

  return (
    <div className="cv-section-body-gap flex min-w-0 flex-col">
      {titleBlock}
      <p
        className={
          compact
            ? // Corps = même taille que les descriptions d'Expérience
              // (réutilise .cv-job-description, sans justifier ni densifier à part).
              'cv-job-description mt-1 flex-1 text-left'
            : 'cv-job-description mt-4 flex-1 text-left'
        }
      >
        {domain.description}
      </p>
      {showTags && domain?.competencies && domain.competencies.length > 0 && (
        <>
          {isDevDomainId(domain.id) ? (
            <DevDomainTagsFromUrl compact={compact} />
          ) : isOpsDomainId(domain.id) ? (
            <OpsDomainTagsFromUrl compact={compact} />
          ) : (
            <div
              className={
                compact
                  ? 'mt-auto flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 py-1 print:mt-1 print:gap-x-1 print:py-0.5'
                  : 'mt-auto flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 py-1'
              }
            >
              {domain.competencies.map((competency) => (
                <Pill key={competency.id} color="domain" compact={compact}>
                  {competency.name.toLowerCase()}
                </Pill>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
