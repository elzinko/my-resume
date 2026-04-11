'use client';

import React, { createContext, useContext, type ReactNode } from 'react';
import type { ContactLocationOverlay } from '@/lib/offer-contact-from-params';
import type { Locale } from 'i18n-config';

export type ContactLocationContextValue = ContactLocationOverlay & {
  locale: Locale;
};

const ContactLocationContext =
  createContext<ContactLocationContextValue | null>(null);

export function useContactLocation(): ContactLocationContextValue | null {
  return useContext(ContactLocationContext);
}

export default function ContactLocationProvider({
  value,
  locale,
  children,
}: {
  value: Omit<ContactLocationContextValue, 'locale'>;
  locale: Locale;
  children: ReactNode;
}) {
  const merged: ContactLocationContextValue = { ...value, locale };
  return (
    <ContactLocationContext.Provider value={merged}>
      {children}
    </ContactLocationContext.Provider>
  );
}
