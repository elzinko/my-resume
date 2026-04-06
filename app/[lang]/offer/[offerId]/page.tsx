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
import { getCvData } from '@/lib/cv-data';
import { getEducationLevelContent } from '@/lib/education-level-content';
import { pickCvHeaderRole } from '@/lib/query-offer-params';
import { getAllOfferIds, getOffer } from '@/data/offers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

function generateOfferTitle(
  name: string,
  lang: string,
  company: string,
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
    i18n.locales.map((lang) => ({ lang, offerId })),
  );
}

export async function generateMetadata({
  params: { lang, offerId },
}: {
  params: { lang: Locale; offerId: string };
}): Promise<Metadata> {
  const data: any = await getCvData(lang);
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

  const data: Record<string, unknown> = (await getCvData(lang)) as Record<
    string,
    unknown
  >;
  const educationLevel = getEducationLevelContent(data, lang);
  const headerRoleOverride = pickCvHeaderRole(offer, lang);

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Headers locale={lang} headerRoleOverride={headerRoleOverride} />

      {/* @ts-expect-error Server Component */}
      <About locale={lang} />
      {/* @ts-expect-error Server Component */}
      <Domains locale={lang} />

      {/* @ts-expect-error Server Component */}
      <TechMatch locale={lang} offerId={offerId} />

      <div className="flex flex-col print:flex-row md:flex-row">
        <div
          id="left"
          className="order-last flex w-full flex-col print:order-first print:w-1/3 print:pr-4 md:order-first md:w-1/3 md:shrink-0 md:pr-10"
        >
          {/* @ts-expect-error Server Component */}
          <Contact locale={lang} />
          {/* @ts-expect-error Server Component */}
          <Skills locale={lang} />
          <EducationLevel content={educationLevel} />
          {/* @ts-expect-error Server Component */}
          <Studies locale={lang} />
          {/* @ts-expect-error Server Component */}
          <Projects locale={lang} />
          {/* @ts-expect-error Server Component */}
          <Learnings locale={lang} />
          {/* @ts-expect-error Server Component */}
          <Hobbies locale={lang} />
        </div>
        <div
          id="main"
          className="w-full print:w-2/3 print:pr-4 md:w-2/3 md:min-w-0 md:pr-10"
        >
          {/* @ts-expect-error Server Component */}
          <Jobs locale={lang} />
        </div>
      </div>
    </>
  );
}
