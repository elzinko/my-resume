'use client';

import React from 'react';
import Pill from '@/components/Pill';
import {
  buildEducationLevelRows,
  type EducationLevelRow,
} from '@/lib/education-level-rows';
import type { EducationLevelContent } from '@/lib/education-level-content';

interface EducationLevelProps {
  content: EducationLevelContent;
  /**
   * Classes sur la `<section>` (marges selon le parent : CV court vs CV long).
   * Défaut : marges haut + ordre d’impression comme sur le CV complet.
   */
  sectionClassName?: string;
  /**
   * Pastilles niveau / diplôme : `true` = taille compacte (CV court, colonne étroite), comme `Skill compact`.
   */
  pillsCompact?: boolean;
}

function EducationBlockRow({
  primaryRole,
  primary,
  secondary,
  pillLevelLabel,
  pillsCompact,
}: EducationLevelRow & { pillsCompact: boolean }) {
  const nonPillPrimaryClass =
    primaryRole === 'heading'
      ? 'cv-education-heading-compact'
      : 'cv-education-primary-compact';

  return (
    <div className="space-y-0.5">
      {pillLevelLabel ? (
        <p className="m-0 leading-snug">
          <Pill color="education" compact={pillsCompact}>
            {primary}
          </Pill>
        </p>
      ) : (
        <p className={`m-0 ${nonPillPrimaryClass}`}>{primary}</p>
      )}
      {secondary ? (
        <p className="cv-education-muted-narrow m-0 max-w-full">{secondary}</p>
      ) : null}
    </div>
  );
}

/**
 * CV long : colonne gauche (écran), blocs empilés en une colonne (écran + PDF / aperçu `?print`).
 * Pastille « niveau » à côté de Profil masquée en impression pour éviter le doublon.
 */
const DEFAULT_SECTION_CLASS =
  'mt-10 max-md:mt-0 max-md:order-[1] md:order-[1] print:order-[50] print-preview:order-[50]';

export default function EducationLevel({
  content,
  sectionClassName = DEFAULT_SECTION_CLASS,
  pillsCompact = false,
}: EducationLevelProps) {
  const rows = buildEducationLevelRows(content);

  return (
    <section id="education-level" className={sectionClassName}>
      <h2 className="border-b pb-1 text-2xl font-semibold text-purple-300">
        {content.title}
      </h2>
      <div className="cv-education-level-blocks mt-4 grid grid-cols-1 gap-y-3 font-normal">
        {rows.map((row) => (
          <EducationBlockRow
            key={row.id}
            {...row}
            pillsCompact={pillsCompact}
          />
        ))}
      </div>
    </section>
  );
}
