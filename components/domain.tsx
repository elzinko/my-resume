'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Pill from './Pill';
import {
  DEV_PRESETS,
  isDevDomainId,
  resolveDevDomainTagsFromSearchParams,
} from '@/lib/dev-domain-tags';

/** Trait sous le titre (comportement historique) ou barre verticale à gauche du libellé. */
export type DomainTitleAccent = 'underline' | 'verticalBar';

/**
 * Bascule globale sans modifier les parents (`domains.tsx`, `CompactCvLayout`).
 * Passer à `'verticalBar'` pour activer la barre à gauche partout.
 */
export const DOMAIN_TITLE_ACCENT_DEFAULT: DomainTitleAccent = 'verticalBar';

function DevDomainTagsRow({
  tags,
  compact,
}: {
  tags: readonly string[];
  compact: boolean;
}) {
  const rowClass = compact
    ? 'mt-2 flex min-w-0 flex-nowrap items-center gap-x-1 gap-y-0 overflow-x-auto py-1 print:mt-1 print:py-0.5'
    : 'mt-1.5 hidden min-w-0 flex-nowrap items-center gap-x-1.5 gap-y-0 overflow-x-auto py-2 print:flex print:flex-nowrap md:flex';

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

function DevDomainTagsFromUrl({ compact }: { compact: boolean }) {
  const sp = useSearchParams();
  const tags = resolveDevDomainTagsFromSearchParams(sp);
  return <DevDomainTagsRow tags={tags} compact={compact} />;
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

  const titleTypo = compact
    ? 'text-2xl font-semibold text-cv-section print:text-sm'
    : 'text-base font-semibold text-cv-section md:text-justify md:text-2xl';

  const titleBlock =
    accent === 'verticalBar' ? (
      <div
        className={`flex items-stretch gap-1.5 text-cv-section ${compact ? 'print:gap-1' : ''}`}
      >
        <span
          className="shrink-0 self-stretch w-0.5 rounded-full bg-current print:w-px"
          aria-hidden
        />
        <h2 className={`min-w-0 flex-1 leading-tight ${titleTypo}`}>{domain.name}</h2>
      </div>
    ) : (
      <h2 className={`border-b pb-0.5 md:pb-1 ${titleTypo}`}>{domain.name}</h2>
    );

  return (
    <div
      className={
        compact
          ? 'mt-4 min-w-0 print:mt-1.5'
          : 'mt-0 min-w-0 md:mt-4'
      }
    >
      {titleBlock}
      <p
        className={
          compact
            ? 'mt-4 text-cv-body-muted print:mt-1 print:text-[8px] print:leading-tight'
            : 'cv-about-domain-print-body mt-1.5 text-sm leading-snug text-cv-body-muted print:mt-4 print:min-h-0 md:mt-4 md:min-h-[100px] md:text-base md:leading-normal'
        }
      >
        {domain.description}
      </p>
      {showTags && domain?.competencies && domain.competencies.length > 0 && (
        <>
          {isDevDomainId(domain.id) ? (
            <Suspense
              fallback={
                <DevDomainTagsRow tags={DEV_PRESETS.default} compact={compact} />
              }
            >
              <DevDomainTagsFromUrl compact={compact} />
            </Suspense>
          ) : (
            <p className="hidden flex-wrap gap-x-2 gap-y-2 whitespace-nowrap py-2 print:flex print:flex-wrap print:whitespace-normal md:flex">
              {domain.competencies.map((competency) => (
                <Pill key={competency.id} color="domain" compact={compact}>
                  {competency.name.toLowerCase()}
                </Pill>
              ))}
            </p>
          )}
        </>
      )}
    </div>
  );
}
