import React from 'react';

export interface ExperienceClosingBlockProps {
  moreExperience: string;
  moreExperienceTail: string;
  /** Phrase optionnelle (ex. liste dynamique des missions hors CV court). */
  moreClientsLine?: string | null;
  /** Lien inline optionnel (ex. « see full resume ») prolongeant le paragraphe — un seul bloc. */
  inlineLink?: React.ReactNode;
}

/**
 * Bloc de synthèse sous les expériences (bordure + emphase alignées sur la couleur « jobs » / rose) — CV court et CV complet.
 */
export default function ExperienceClosingBlock({
  moreExperience,
  moreExperienceTail,
  moreClientsLine,
  inlineLink,
}: ExperienceClosingBlockProps) {
  return (
    <div
      id="experience-footer"
      className="cv-experience-footer mt-4 border-l-4 border-pink-300/50 pl-3 print:mt-2"
    >
      <p className="text-xs text-gray-400 print:text-[10px]">
        <strong className="text-cv-jobs">{moreExperience}</strong>{' '}
        {moreExperienceTail}
        {moreClientsLine ? <> {moreClientsLine}</> : null}
        {inlineLink}
      </p>
    </div>
  );
}
