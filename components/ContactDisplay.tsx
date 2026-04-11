'use client';

import React from 'react';
import { buildContactLocationHref } from '@/lib/contact-maps';
import { contactLocationLinkTitle } from '@/lib/contact-location-labels';
import { useContactLocation } from '@/components/ContactLocationProvider';
import type { Locale } from 'i18n-config';

export interface ContactData {
  title?: string;
  phoneTitle: string;
  phone: string;
  emailTitle: string;
  email: string;
  locationTitle: string;
  location: string;
}

interface ContactDisplayProps {
  contact: ContactData;
  compact?: boolean;
  /**
   * CV court : chaque ligne = libellé à gauche / valeur à droite (mobile, tablette, impression).
   */
  cvShortInlineRows?: boolean;
  /**
   * Masquer les libellés visuellement (sr-only pour accessibilité / LLM).
   * Les valeurs sont affichées seules, alignées à gauche, avec une couleur plus marquée.
   */
  showLabels?: boolean;
  locale?: Locale;
}

function LocationLinkBlock({
  location,
  locale,
  className,
}: {
  location: string;
  locale: Locale;
  className?: string;
}) {
  const ctx = useContactLocation();
  const mapsHref = ctx?.mapsHref ?? buildContactLocationHref();
  const commuteLabel = ctx?.commuteLabel;
  const isDirections = ctx?.isDirections ?? false;
  const loc = ctx?.locale ?? locale;
  const title = contactLocationLinkTitle(loc, isDirections);

  return (
    <div
      className={`flex w-full min-w-0 flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 ${
        className ?? ''
      }`.trim()}
    >
      <a
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:decoration-current/70 min-w-0 break-words text-inherit no-underline hover:underline hover:underline-offset-2"
        title={title}
      >
        {location}
      </a>
      {commuteLabel ? (
        <span className="shrink-0 text-xs font-normal text-slate-500 print:hidden">
          {commuteLabel}
        </span>
      ) : null}
    </div>
  );
}

export default function ContactDisplay({
  contact,
  compact = false,
  cvShortInlineRows = false,
  showLabels = true,
  locale = 'fr',
}: ContactDisplayProps) {
  const ctx = useContactLocation();

  if (cvShortInlineRows) {
    // Mode sans labels : valeurs seules, alignées à gauche, couleur rose-300.
    // Structure identique aux autres listes simples (Études, Projets) :
    // <ul cv-section-simple-list> → <li> → <a> (pas de wrapper div).
    if (!showLabels) {
      const sizeToken = compact
        ? 'cv-contact-value-compact'
        : 'cv-contact-value';
      const valueCls = `${sizeToken} text-rose-300`;
      const linkCls =
        'no-underline hover:underline hover:decoration-rose-300/50 hover:underline-offset-2';
      const mapsHref = ctx?.mapsHref ?? buildContactLocationHref();
      const isDirections = ctx?.isDirections ?? false;
      const loc = ctx?.locale ?? locale;
      const locationTitle = contactLocationLinkTitle(loc, isDirections);

      return (
        <ul className="cv-short-contact-rows cv-section-simple-list">
          <li className="cv-row-simple-item">
            <span className="sr-only">{contact.emailTitle} : </span>
            <a
              href={`mailto:${contact.email}`}
              className={`${valueCls} ${linkCls} break-all`}
            >
              {contact.email}
            </a>
          </li>
          <li className="cv-row-simple-item">
            <span className="sr-only">{contact.phoneTitle} : </span>
            <a
              href={`tel:${contact.phone.replace(/\s/g, '')}`}
              className={`${valueCls} ${linkCls} tabular-nums`}
            >
              {contact.phone}
            </a>
          </li>
          <li className="cv-row-simple-item">
            <span className="sr-only">{contact.locationTitle} : </span>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${valueCls} ${linkCls}`}
              title={locationTitle}
            >
              {contact.location}
            </a>
          </li>
        </ul>
      );
    }

    const row =
      'flex w-full flex-row items-baseline justify-between gap-2 text-sm text-pink-200 md:gap-3 print:gap-2 print:text-[9px] print:leading-tight';
    const labelCls = 'shrink-0 font-semibold text-cv-jobs';
    const valueWrap = 'min-w-0 text-right';

    return (
      <ul className="cv-short-contact-rows cv-section-body-gap space-y-1.5 print:space-y-0.5 md:space-y-1">
        <li className={row}>
          <strong className={labelCls}>{contact.emailTitle}</strong>
          <a
            href={`mailto:${contact.email}`}
            className={`${valueWrap} break-all`}
          >
            {contact.email}
          </a>
        </li>
        <li className={row}>
          <strong className={labelCls}>{contact.phoneTitle}</strong>
          <a
            href={`tel:${contact.phone.replace(/\s/g, '')}`}
            className={`${valueWrap} tabular-nums`}
          >
            {contact.phone}
          </a>
        </li>
        <li className={row}>
          <strong className={labelCls}>{contact.locationTitle}</strong>
          <div className={valueWrap}>
            <LocationLinkBlock
              location={contact.location}
              locale={locale}
              className="justify-end"
            />
          </div>
        </li>
      </ul>
    );
  }

  if (compact) {
    const row =
      'flex flex-row items-baseline justify-between gap-2 text-sm text-pink-200 print:text-[10px] print:leading-tight';
    return (
      <ul className="mt-2 space-y-1 print:mt-0.5">
        <li className={row}>
          <strong className="shrink-0 text-cv-jobs">
            {contact.emailTitle || 'Email'}
          </strong>
          <span className="min-w-0 break-all text-right">{contact.email}</span>
        </li>
        <li className={row}>
          <strong className="shrink-0 text-cv-jobs">
            {contact.phoneTitle || 'Tél.'}
          </strong>
          <span className="min-w-0 text-right tabular-nums">
            {contact.phone}
          </span>
        </li>
        <li className={row}>
          <strong className="shrink-0 text-cv-jobs">
            {contact.locationTitle || 'Lieu'}
          </strong>
          <div className="min-w-0 text-right">
            <LocationLinkBlock
              location={contact.location}
              locale={locale}
              className="justify-end"
            />
          </div>
        </li>
      </ul>
    );
  }

  /** Mobile : libellé à gauche / valeur à droite ; `md+` : pile comme la colonne gauche ; print : pile dans chaque cellule de grille. */
  const stackLi =
    'mt-1 flex flex-row items-baseline justify-between gap-2 gap-x-3 text-pink-200 md:flex-col md:items-stretch md:gap-0';
  const stackLabel = 'shrink-0 text-base font-bold text-cv-jobs';
  const stackValue =
    'block min-w-0 text-right text-base md:mt-0 md:text-left print:text-left';

  return (
    <ul className="cv-contact-stack mr-1 mt-4 print:mt-2">
      <li className={stackLi}>
        <strong className={stackLabel}>{contact.emailTitle}</strong>
        <a
          href={`mailto:${contact.email}`}
          className={`${stackValue} break-all`}
        >
          {contact.email}
        </a>
      </li>
      <li className={stackLi}>
        <strong className={stackLabel}>{contact.phoneTitle}</strong>
        <a
          href={`tel:${contact.phone}`}
          className={`${stackValue} tabular-nums`}
        >
          {contact.phone}
        </a>
      </li>
      <li className={stackLi}>
        <strong className={stackLabel}>{contact.locationTitle}</strong>
        <div className="min-w-0 text-right print:text-left md:w-full md:text-left">
          <LocationLinkBlock
            location={contact.location}
            locale={locale}
            className="justify-end print:justify-between md:mt-0.5 md:justify-between"
          />
        </div>
      </li>
    </ul>
  );
}
