'use client';

import React from 'react';

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
   * `grid` : trois champs en colonnes (comme la grille domaines) dès `md`.
   * `stack` : liste verticale classique.
   */
  fieldsLayout?: 'grid' | 'stack';
}

export default function ContactDisplay({
  contact,
  compact = false,
  fieldsLayout = 'grid',
}: ContactDisplayProps) {
  if (compact) {
    return (
      <ul className="mt-2 space-y-0.5 print:mt-0.5">
        <li className="text-sm text-pink-200 print:text-[10px] print:leading-tight">
          <strong className="text-cv-jobs">
            {contact.phoneTitle || 'Tél.'}
          </strong>
          <span className="ml-2">{contact.phone}</span>
        </li>
        <li className="text-sm text-pink-200 print:text-[10px] print:leading-tight">
          <strong className="text-cv-jobs">
            {contact.emailTitle || 'Email'}
          </strong>
          <span className="ml-2">{contact.email}</span>
        </li>
        <li className="text-sm text-pink-200 print:text-[10px] print:leading-tight">
          <strong className="text-cv-jobs">
            {contact.locationTitle || 'Lieu'}
          </strong>
          <span className="ml-2">{contact.location}</span>
        </li>
      </ul>
    );
  }

  if (fieldsLayout === 'grid') {
    return (
      <div className="mt-4 grid grid-cols-1 gap-4 print:mt-2 print:grid-cols-3 print:gap-2 md:mt-4 md:grid-cols-3 md:gap-x-10 md:gap-y-2 md:items-start">
        <div className="min-w-0 text-pink-200">
          <strong className="block text-base font-bold text-cv-jobs print:text-sm">
            {contact.phoneTitle}
          </strong>
          <a
            href={`tel:${contact.phone}`}
            className="mt-0.5 block text-base print:text-sm"
          >
            {contact.phone}
          </a>
        </div>
        <div className="min-w-0 text-pink-200">
          <strong className="block text-base font-bold text-cv-jobs print:text-sm">
            {contact.emailTitle}
          </strong>
          <a
            href={`mailto:${contact.email}`}
            className="mt-0.5 block break-all text-base print:text-sm"
          >
            {contact.email}
          </a>
        </div>
        <div className="min-w-0 text-pink-200">
          <strong className="block text-base font-bold text-cv-jobs print:text-sm">
            {contact.locationTitle}
          </strong>
          <span className="mt-0.5 block text-base print:text-sm">
            {contact.location}
          </span>
        </div>
      </div>
    );
  }

  return (
    <ul className="mr-1 mt-4">
      <li className="mt-1 text-pink-200">
        <strong className="text-base font-bold text-cv-jobs">
          {contact.phoneTitle}
        </strong>
        <a href={`tel:${contact.phone}`} className="block text-base">
          {contact.phone}
        </a>
      </li>
      <li className="mt-1 text-pink-200">
        <strong className="text-base font-bold text-cv-jobs">
          {contact.emailTitle}
        </strong>
        <a href={`mailto:${contact.email}`} className="block text-base">
          {contact.email}
        </a>
      </li>
      <li className="mt-1 text-pink-200">
        <strong className="text-base font-bold text-cv-jobs">
          {contact.locationTitle}
        </strong>
        <span className="block text-base">{contact.location}</span>
      </li>
    </ul>
  );
}
