import '../../../../styles/globals.css';

import OfferTailoredShell from '@/components/OfferTailoredShell';
import MatchOfferClient from '@/components/MatchOfferClient';
import { Locale } from '../../../../i18n-config';
import type { Metadata } from 'next';
import { getCvData } from '@/lib/cv-data';

/** Requis : titre sous le nom (`cv_role*`) et offre lues depuis la query à la requête. */
export const dynamic = 'force-dynamic';
import { getEducationLevelContent } from '@/lib/education-level-content';
import {
  pickCvHeaderRole,
  resolveOfferFromUrlParams,
  searchParamsRecordToURLSearchParams,
} from '@/lib/query-offer-params';
import type { JobForMatching } from '@/lib/tech-match-core';

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
    title: `${prefix}_${safeName}_offer_match_${date}`,
  };
}

export default async function MatchOfferPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: Locale };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const data: Record<string, unknown> = (await getCvData(lang)) as Record<
    string,
    unknown
  >;
  const educationLevel = getEducationLevelContent(data, lang);
  const jobs = (data?.allJobsModels || []) as JobForMatching[];

  const sp = searchParamsRecordToURLSearchParams(searchParams);
  const offer = resolveOfferFromUrlParams(sp);
  const headerRoleOverride = pickCvHeaderRole(offer, lang);

  return (
    <OfferTailoredShell
      lang={lang}
      educationLevel={educationLevel}
      headerRoleOverride={headerRoleOverride}
      matchSection={
        <MatchOfferClient jobs={jobs} lang={lang} mode="query-first" />
      }
    />
  );
}
