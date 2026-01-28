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
}

export default function ContactDisplay({ contact, compact = false }: ContactDisplayProps) {
  if (compact) {
    return (
      <ul className="mt-2 space-y-0.5 print:mt-1">
        <li className="text-sm text-pink-200 print:text-xs">
          <strong className="text-pink-300">{contact.phoneTitle || 'Tél.'}</strong>
          <span className="ml-2">{contact.phone}</span>
        </li>
        <li className="text-sm text-pink-200 print:text-xs">
          <strong className="text-pink-300">{contact.emailTitle || 'Email'}</strong>
          <span className="ml-2">{contact.email}</span>
        </li>
        <li className="text-sm text-pink-200 print:text-xs">
          <strong className="text-pink-300">{contact.locationTitle || 'Lieu'}</strong>
          <span className="ml-2">{contact.location}</span>
        </li>
      </ul>
    );
  }

  return (
    <ul className="mb-10 mr-1 mt-4">
      <li className="mt-1 text-pink-200">
        <strong>{contact.phoneTitle}</strong>
        <a href={`tel:${contact.phone}`} className="block">
          {contact.phone}
        </a>
      </li>
      <li className="mt-1 text-pink-200">
        <strong>{contact.emailTitle}</strong>
        <a href={`mailto:${contact.email}`} className="block">
          {contact.email}
        </a>
      </li>
      <li className="mt-1 text-pink-200">
        <strong>{contact.locationTitle}</strong>
        <span className="block">{contact.location}</span>
      </li>
    </ul>
  );
}
