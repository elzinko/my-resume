'use client';

import { buildContactLocationHref } from '@/lib/contact-maps';
import { contactLocationLinkTitle } from '@/lib/contact-location-labels';
import { useContactLocation } from '@/components/ContactLocationProvider';
import type { Locale } from 'i18n-config';

/**
 * Coordonnées compactes sous le rôle : e-mail, tél., lieu (lien Maps / itinéraire), sans libellés.
 * CV court : sous le sous-titre (écran + impression). CV long : coordonnées dans la colonne Contact uniquement.
 */
export default function HeaderDesktopContactStrip({
  email,
  phone,
  location,
  locale,
  align = 'left',
}: {
  email: string;
  phone: string;
  location: string;
  locale: Locale;
  /** Alignement du texte. Par défaut `'left'`. */
  align?: 'left' | 'right';
}) {
  const ctx = useContactLocation();
  const mapsHref = ctx?.mapsHref ?? buildContactLocationHref();
  const commuteLabel = ctx?.commuteLabel;
  const isDirections = ctx?.isDirections ?? false;
  const loc = ctx?.locale ?? locale;
  const locationTitle = contactLocationLinkTitle(loc, isDirections);

  if (!email && !phone && !location) return null;

  const alignItems = align === 'right' ? 'items-end' : 'items-start';
  const textAlign = align === 'right' ? 'text-right' : 'text-left';

  return (
    <div
      className={`cv-header-contact-strip mt-2 flex w-full flex-col ${alignItems} gap-0.5 ${textAlign} text-sm leading-snug text-pink-200 md:mt-0 md:pb-1 md:text-lg md:leading-snug print:mt-0 print:flex print:items-start print:gap-0.5 print:pb-0.5 print:text-left print:text-xs print:leading-snug print:text-pink-200`}
      aria-label="Contact"
    >
      {email ? (
        <a href={`mailto:${email}`} className="break-all text-inherit">
          {email}
        </a>
      ) : null}
      {phone ? (
        <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-inherit">
          {phone}
        </a>
      ) : null}
      {location ? (
        <div className={`flex w-full max-w-full flex-wrap items-baseline ${align === 'right' ? 'justify-end' : 'justify-start'} gap-x-2 gap-y-0.5 print:justify-start`}>
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-inherit no-underline hover:underline hover:decoration-pink-200 hover:underline-offset-2"
            title={locationTitle}
          >
            {location}
          </a>
          {commuteLabel ? (
            <span className="shrink-0 text-xs font-normal text-slate-400">
              {commuteLabel}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
