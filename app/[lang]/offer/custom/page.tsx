import '../../../../styles/globals.css';

import OfferTailoredShell from '@/components/OfferTailoredShell';
import { Locale } from '../../../../i18n-config';
import type { Metadata } from 'next';
import { getCvData } from '@/lib/cv-data';
import { getMatchCatalog } from '@/lib/match-catalog-server';
import { getEducationLevelContent } from '@/lib/education-level-content';
import { offerPriorityTokensAndContact } from '@/lib/offer-page-data';
import { resolveOfferFromUrlParams } from '@/lib/query-offer-params';
import { recordToURLSearchParams } from '@/lib/search-params-to-url';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const data: any = await getCvData(lang);
  const name = data?.header?.name || 'CV';
  const prefix = lang === 'fr' ? 'cv' : 'resume';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const safeName = name.toLowerCase().replace(/\s+/g, '_');
  return {
    title: `${prefix}_${safeName}_offer_custom_${date}`,
  };
}

export default async function CustomOfferPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: Locale };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const data: Record<string, unknown> = (await getCvData(lang)) as Record<
    string,
    unknown
  >;
  const educationLevel = getEducationLevelContent(data, lang);
  const matchCatalog = getMatchCatalog();
  const sp = recordToURLSearchParams(searchParams);
  const offer = resolveOfferFromUrlParams(sp, matchCatalog);
  const { priorityTokens, contactLocation } = offerPriorityTokensAndContact(
    offer,
    sp,
  );

  return (
    <OfferTailoredShell
      lang={lang}
      educationLevel={educationLevel}
      frameworkDisplayPriorityTokens={priorityTokens}
      contactLocation={contactLocation}
    />
  );
}
