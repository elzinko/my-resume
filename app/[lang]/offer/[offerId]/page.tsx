import '../../../../styles/globals.css';

import About from '@/app/[lang]/about';
import Headers from '@/app/[lang]/header';
import { Locale } from '../../../../i18n-config';
import { i18n } from '../../../../i18n-config';
import Contact from '@/app/[lang]/contact';
import Studies from '@/app/[lang]/studies';
import Skills from '@/app/[lang]/skills';
import Domains from '@/app/[lang]/domains';
import Learnings from '@/app/[lang]/learnings';
import Hobbies from '@/app/[lang]/hobbies';
import Jobs from '@/app/[lang]/jobs';
import Projects from '@/app/[lang]/projects';
import EducationLevel from '@/components/EducationLevel';
import TechMatch from './tech-match';
import { getDataWithLocal } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import { getAllOfferIds, getOffer } from '@/data/offers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const headerQuery = gql`
  query getHeader($lang: SiteLocale) {
    header(locale: $lang) {
      name
    }
  }
`;

function generateOfferTitle(
  name: string,
  lang: string,
  company: string
): string {
  const prefix = lang === 'fr' ? 'cv' : 'resume';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const safeName = name.toLowerCase().replace(/\s+/g, '_');
  const safeCompany = company.toLowerCase().replace(/\s+/g, '_');
  return `${prefix}_${safeName}_${safeCompany}_${date}`;
}

export async function generateStaticParams() {
  const offerIds = getAllOfferIds();
  return offerIds.flatMap((offerId) =>
    i18n.locales.map((lang) => ({ lang, offerId }))
  );
}

export async function generateMetadata({
  params: { lang, offerId },
}: {
  params: { lang: Locale; offerId: string };
}): Promise<Metadata> {
  const data: any = await getDataWithLocal(
    { locale: lang } as any,
    headerQuery
  );
  const name = data?.header?.name || 'CV';
  const offer = getOffer(offerId);
  const company = offer?.company || offerId;

  return {
    title: generateOfferTitle(name, lang, company),
  };
}

export default async function OfferPage({
  params: { lang, offerId },
}: {
  params: { lang: Locale; offerId: string };
}) {
  const offer = getOffer(offerId);
  if (!offer) notFound();

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Headers locale={lang} />

      {/* @ts-expect-error Server Component */}
      <About locale={lang} />
      {/* @ts-expect-error Server Component */}
      <Domains locale={lang} />

      {/* @ts-expect-error Server Component */}
      <TechMatch locale={lang} offerId={offerId} />

      <div className="mt-10 flex columns-1 flex-col md:columns-2 md:flex-row print:mt-4 print:flex-row">
        <div
          id="left"
          className="order-last md:order-first md:w-1/3 md:pr-10 print:order-first print:w-1/3 print:pr-4"
        >
          {/* @ts-expect-error Server Component */}
          <Contact locale={lang} />
          {/* @ts-expect-error Server Component */}
          <Skills locale={lang} />
          <EducationLevel lang={lang} />
          {/* @ts-expect-error Server Component */}
          <Learnings locale={lang} />
          {/* @ts-expect-error Server Component */}
          <Hobbies locale={lang} />
        </div>
        <div
          id="main"
          className="md:w-2/3 md:pr-10 print:w-2/3 print:pr-4"
        >
          {/* @ts-expect-error Server Component */}
          <Jobs locale={lang} />
          {/* @ts-expect-error Server Component */}
          <Projects locale={lang} />
          {/* @ts-expect-error Server Component */}
          <Studies locale={lang} />
        </div>
      </div>
    </>
  );
}
