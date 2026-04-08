import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';
import ContactDisplay from '@/components/ContactDisplay';

export default async function Contact({
  locale,
  sectionId = 'contact',
  className = '',
  condensed = false,
}: {
  locale: Locale;
  /** `false` : pas d’id (doublon mobile / sidebar). */
  sectionId?: string | false;
  className?: string;
  /**
   * `true` : grille 3 champs dès `md` (utile si le bloc est dans une zone large).
   * `false` : liste verticale comme la colonne gauche (recommandé en pile mobile une colonne).
   */
  condensed?: boolean;
}) {
  const data: any = await getCvData(locale);
  const contactData = {
    title: data?.contact?.title,
    phoneTitle: data?.contact?.phoneTitle || '',
    phone: data?.contact?.phone || '',
    emailTitle: data?.contact?.emailTitle || '',
    email: data?.contact?.email || '',
    locationTitle: data?.contact?.locationTitle || '',
    location: data?.contact?.location || '',
  };

  const sectionClass = [
    className || 'mt-10',
    'print:order-[40] print-preview:order-[40]',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      id={sectionId === false ? undefined : sectionId}
      className={sectionClass}
    >
      <h2 className="border-b pb-1 text-2xl font-semibold text-cv-jobs">
        {contactData.title || 'Contact'}
      </h2>
      <ContactDisplay
        contact={contactData}
        condensed={condensed}
        locale={locale}
      />
    </section>
  );
}
