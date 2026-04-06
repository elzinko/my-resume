'use client';

import React, { useEffect, useId, useState } from 'react';
import type { Locale } from 'i18n-config';

export interface JobExperienceBodyProps {
  descriptionShort?: string | null;
  description: string;
  bullets?: Array<{ id: string; text: string }>;
  locale: Locale;
  compact?: boolean;
  /** Mobile : notifie l’ouverture du détail (ex. afficher les pastilles techno). */
  onExpandedChange?: (open: boolean) => void;
}

/**
 * Texte mission : desktop / print = tout visible ; viewport &lt; lg = replié : uniquement le bouton
 * « Plus de détails » tant qu’il y a du contenu ; déplié = texte + puces (plus de texte hors ligne poste/dates).
 */
export default function JobExperienceBody({
  descriptionShort,
  description,
  bullets,
  locale,
  compact = false,
  onExpandedChange,
}: JobExperienceBodyProps) {
  const detailId = useId();
  const [expanded, setExpanded] = useState(false);

  const shortText = (descriptionShort ?? '').trim();
  const longText = (description ?? '').trim();
  const isLegacy = !shortText;
  const hookLine = isLegacy ? longText : shortText;
  const hasBullets = Boolean(bullets?.length);
  const showToggle =
    Boolean(shortText) || Boolean(longText) || hasBullets;

  useEffect(() => {
    onExpandedChange?.(expanded);
  }, [expanded, onExpandedChange]);

  const t =
    locale === 'en'
      ? { more: 'More detail', less: 'Hide detail' }
      : { more: 'Plus de détails', less: 'Masquer les détails' };

  const pClass = compact ? 'cv-job-description mt-1' : 'cv-job-description';
  const pClassTight = compact
    ? 'cv-job-description mt-1'
    : 'cv-job-description mt-1';

  const bulletList = (extraClass: string) =>
    bullets && bullets.length > 0 ? (
      <ul className={`cv-job-description mx-4 my-2 list-disc ${extraClass}`}>
        {bullets.map((bullet) => (
          <li key={bullet.id}>{bullet.text}</li>
        ))}
      </ul>
    ) : null;

  return (
    <>
      {/* Écran large + impression : contenu complet */}
      <div className="hidden print:block lg:block">
        {isLegacy ? (
          hookLine ? (
            <p className={pClass}>{hookLine}</p>
          ) : null
        ) : (
          <>
            {hookLine ? <p className={pClass}>{hookLine}</p> : null}
            {longText ? <p className={pClassTight}>{longText}</p> : null}
          </>
        )}
        {bulletList('')}
      </div>

      {/* Mobile écran uniquement : replié = pas de texte, seulement le bouton si contenu */}
      <div className="print:hidden lg:hidden">
        {showToggle ? (
          <>
            <button
              type="button"
              className="mt-1 text-xs font-medium text-cv-jobs underline decoration-cv-jobs/50 underline-offset-2 hover:decoration-cv-jobs"
              aria-expanded={expanded}
              aria-controls={detailId}
              data-testid="job-detail-toggle"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? t.less : t.more}
            </button>
            {expanded ? (
              <div id={detailId} className="mt-1">
                {!isLegacy ? (
                  <>
                    {hookLine ? <p className={pClass}>{hookLine}</p> : null}
                    {longText ? (
                      <p className={pClassTight}>{longText}</p>
                    ) : null}
                  </>
                ) : longText ? (
                  <p className={pClass}>{longText}</p>
                ) : null}
                {bulletList('')}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </>
  );
}
