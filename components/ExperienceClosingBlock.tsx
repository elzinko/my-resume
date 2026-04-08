import React from 'react';

export interface ExperienceClosingBlockProps {
  moreExperience: string;
  moreExperienceTail: string;
  /** Phrase optionnelle (ex. liste dynamique des missions hors CV court). */
  moreClientsLine?: string | null;
}

/**
 * Bloc de synthèse sous les expériences (bordure teal, typo discrète) — CV court et CV complet.
 */
export default function ExperienceClosingBlock({
  moreExperience,
  moreExperienceTail,
  moreClientsLine,
}: ExperienceClosingBlockProps) {
  return (
    <div className="cv-experience-footer mt-4 border-l-4 border-teal-300/50 pl-3 print:mt-2">
      <p className="text-xs text-gray-400 print:text-[10px]">
        <strong className="text-teal-300">{moreExperience}</strong>{' '}
        {moreExperienceTail}
        {moreClientsLine ? <> {moreClientsLine}</> : null}
      </p>
    </div>
  );
}
