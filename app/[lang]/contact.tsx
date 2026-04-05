import { getCvData } from '@/lib/cv-data';
import { Locale } from 'i18n-config';
import React from 'react';
import ContactDisplay from '@/components/ContactDisplay';

export default async function Contact({ locale }: { locale: Locale }) {
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

  return (
    <section id="contact" className="mt-10">
      <h2 className="border-b pb-1 text-2xl font-semibold text-cv-jobs">
        {contactData.title || 'Contact'}
      </h2>
      <ContactDisplay contact={contactData} />
    </section>
  );
}
