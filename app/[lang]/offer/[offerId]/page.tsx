import '../../../../styles/globals.css';

import OfferTailoredShell from '@/components/OfferTailoredShell';
import TechMatch from './tech-match';
import { Locale } from '../../../../i18n-config';
import { i18n } from '../../../../i18n-config';
import { getCvData } from '@/lib/cv-data';
import { getEducationLevelContent } from '@/lib/education-level-content';
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

  return (
    <OfferTailoredShell
      lang={lang}
      educationLevel={educationLevel}
      matchSection={
        /* @ts-expect-error Server Component passé comme enfant client boundary */
        <TechMatch locale={lang} offerId={offerId} />
      }
    />
  );
}
