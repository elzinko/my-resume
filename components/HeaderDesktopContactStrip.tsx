'use client';

import { buildContactLocationHref } from '@/lib/contact-maps';
import { contactLocationLinkTitle } from '@/lib/contact-location-labels';
import { useContactLocation } from '@/components/ContactLocationProvider';
import type { Locale } from 'i18n-config';

/**
 * Coordonnées compactes sous le rôle : e-mail, tél., lieu (lien Maps / itinéraire), sans libellés.
 * Desktop écran + même bloc à l’impression du CV long (sous le sous-titre).
 */
export default function HeaderDesktopContactStrip({
  email,
  phone,
  location,
  locale,
}: {
  email: string;
  phone: string;
  location: string;
  locale: Locale;
}) {
  const ctx = useContactLocation();
  const mapsHref = ctx?.mapsHref ?? buildContactLocationHref();
  const commuteLabel = ctx?.commuteLabel;
  const isDirections = ctx?.isDirections ?? false;
  const loc = ctx?.locale ?? locale;
  const locationTitle = contactLocationLinkTitle(loc, isDirections);

  if (!email && !phone && !location) return null;

  return (
    <div
      className="mt-2 flex w-full flex-col items-end gap-0.5 text-right text-sm leading-snug text-pink-200 md:mt-3 md:text-lg md:leading-snug print:flex print:items-end print:gap-0.5 print:text-xs print:leading-snug print:text-pink-200"
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
        <div className="flex w-full max-w-full flex-wrap items-baseline justify-end gap-x-2 gap-y-0.5">
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-inherit underline decoration-pink-200/50 underline-offset-2 hover:decoration-pink-200"
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
