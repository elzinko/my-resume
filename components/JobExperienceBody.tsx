'use client';

import React, { useEffect, useId, useState } from 'react';
import type { DetailLevel } from '@/lib/cv-detail-level';
import type { Locale } from 'i18n-config';

export interface JobExperienceBodyProps {
  descriptionShort?: string | null;
  description: string;
  bullets?: Array<{ id: string; text: string; link?: string }>;
  locale: Locale;
  compact?: boolean;
  /**
   * Niveau de détail (param `?detail=`) :
   *  - `full`    : accroche + détails (description longue) + puces ;
   *  - `summary` : accroche seule, sans les détails ni les puces ;
   *  - `minimal` : aucune description.
   * Pilote l'écran ET l'impression (le PDF suit ce choix).
   */
  detailLevel?: DetailLevel;
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
  detailLevel = 'full',
  onExpandedChange,
}: JobExperienceBodyProps) {
  const detailId = useId();
  const [expanded, setExpanded] = useState(false);

  const shortText = (descriptionShort ?? '').trim();
  const longText = (description ?? '').trim();
  const isLegacy = !shortText;
  const hookLine = isLegacy ? longText : shortText;
  /** CV court (compact) : pas de puces, écran comme impression. */
  const showBullets = !compact && Boolean(bullets?.length);
  /** Accroche (« les textes ») : visible sauf en mode `minimal`. */
  const showAccroche = detailLevel !== 'minimal' && Boolean(hookLine);
  /** Détails (description longue + puces) : uniquement en mode `full`. */
  const showDetails = detailLevel === 'full';
  const showToggle =
    detailLevel === 'full' &&
    (Boolean(shortText) || Boolean(longText) || showBullets);

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
    showBullets && bullets && bullets.length > 0 ? (
      <ul className={`cv-job-description mx-4 my-2 list-disc ${extraClass}`}>
        {bullets.map((bullet) => (
          <li key={bullet.id}>
            {bullet.link ? (
              <a href={bullet.link} target="_blank" rel="noopener noreferrer">
                {bullet.text}
              </a>
            ) : (
              bullet.text
            )}
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <>
      {/* Écran large + impression : contenu selon le niveau de détail.
          La description longue + les puces sont dans `.cv-job-detail` :
          cible du bouton écran « Masquer les détails » (ignoré à l'impression). */}
      <div className="hidden print:block lg:block">
        {showAccroche ? <p className={pClass}>{hookLine}</p> : null}
        {showDetails ? (
          <div className="cv-job-detail">
            {!isLegacy && longText ? (
              <p className={pClassTight}>{longText}</p>
            ) : null}
            {bulletList('')}
          </div>
        ) : null}
      </div>

      {/* Mobile écran uniquement */}
      <div className="print:hidden lg:hidden">
        {detailLevel === 'minimal' ? null : detailLevel === 'summary' ? (
          showAccroche ? (
            <p className={`${pClass} mt-1`}>{hookLine}</p>
          ) : null
        ) : showToggle ? (
          /* Mode `full` : replié = seulement le bouton ; déplié = accroche + détails. */
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
