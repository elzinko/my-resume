import '../../styles/globals.css';

import OfferTailoredShell from '@/components/OfferTailoredShell';
import { Locale } from '../../i18n-config';
import type { Metadata } from 'next';
import { getCvData } from '@/lib/cv-data';
import { getMatchCatalog } from '@/lib/match-catalog-server';
import { getEducationLevelContent } from '@/lib/education-level-content';
import { offerPriorityTokensAndContact } from '@/lib/offer-page-data';
import { resolveOfferFromUrlParams } from '@/lib/query-offer-params';
import { recordToURLSearchParams } from '@/lib/search-params-to-url';
import type { ContractType } from '@/data/offers/types';

export const dynamic = 'force-dynamic';

import { generateDocumentTitle } from '@/lib/cv-document-title';

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const data: any = await getCvData(lang);
  const name = data?.header?.name || 'CV';

  return {
    title: generateDocumentTitle(name, lang, 'full'),
  };
}

/**
 * Page CV complète unifiée — anciennement éclatée entre `/`, `/offer/match` et `/offer/custom`.
 * Les query params (`company`, `title`, `requirement`, `offer`, etc.) permettent d'injecter
 * un contexte d'offre pour personnaliser le rendu (pastilles d'adéquation, priorité techno).
 * Sans params : rendu CV neutre. Source unique de la mise en page CV long.
 */
export default async function Page({
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
  const contractParam =
    typeof searchParams?.contract === 'string'
      ? searchParams.contract
      : undefined;
  const contract: ContractType | undefined =
    contractParam === 'cdi' || contractParam === 'freelance'
      ? contractParam
      : undefined;
  const { priorityTokens, contactLocation } = offerPriorityTokensAndContact(
    offer,
    sp,
  );
  const subtitleOverride =
    (lang === 'fr'
      ? sp.get('subtitle_fr') || sp.get('subtitle')
      : sp.get('subtitle_en') || sp.get('subtitle')
    )?.trim() || undefined;
  const contact = data.contact as
    | { email?: string; phone?: string; location?: string }
    | undefined;

  return (
    <OfferTailoredShell
      lang={lang}
      educationLevel={educationLevel}
      headerContactStrip={{
        email: contact?.email ?? '',
        phone: contact?.phone ?? '',
        location: contact?.location ?? '',
      }}
      frameworkDisplayPriorityTokens={priorityTokens}
      contactLocation={contactLocation}
      hideMalt={contract === 'cdi'}
      contract={contract}
      subtitleOverride={subtitleOverride}
    />
  );
}
