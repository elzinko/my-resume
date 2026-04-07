'use client';

import React from 'react';
import Pill from './Pill';

/** Trait sous le titre (comportement historique) ou barre verticale à gauche du libellé. */
export type DomainTitleAccent = 'underline' | 'verticalBar';

/**
 * Bascule globale sans modifier les parents (`domains.tsx`, `CompactCvLayout`).
 * Passer à `'verticalBar'` pour activer la barre à gauche partout.
 */
export const DOMAIN_TITLE_ACCENT_DEFAULT: DomainTitleAccent = 'verticalBar';

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
          ? 'mt-4 min-w-0 print:mt-2'
          : 'mt-0 min-w-0 md:mt-4'
      }
    >
      {titleBlock}
      <p
        className={
          compact
            ? 'mt-4 text-cv-body-muted print:mt-2 print:text-[9px] print:leading-tight'
            : 'mt-1.5 text-sm leading-snug text-cv-body-muted print:mt-4 print:min-h-0 print:text-base md:mt-4 md:min-h-[100px] md:text-base md:leading-normal'
        }
      >
        {domain.description}
      </p>
      {showTags && domain?.competencies && domain.competencies.length > 0 && (
        <p className="hidden flex-wrap gap-x-2 gap-y-2 whitespace-nowrap py-2 print:flex print:flex-wrap print:whitespace-normal md:flex">
          {domain.competencies.map((competency) => (
            <Pill key={competency.id} color="domain">
              {competency.name.toLowerCase()}
            </Pill>
          ))}
        </p>
      )}
    </div>
  );
}
