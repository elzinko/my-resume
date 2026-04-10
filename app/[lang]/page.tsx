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

export const dynamic = 'force-dynamic';

// Helper to generate document title (developer style: lowercase with underscores)
function generateDocumentTitle(name: string, lang: string): string {
  const prefix = lang === 'fr' ? 'cv' : 'resume';
  const modeLabel = lang === 'fr' ? 'complet' : 'full';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const safeName = name.toLowerCase().replace(/\s+/g, '_');
  return `${prefix}_${safeName}_${modeLabel}_${date}`;
}

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const data: any = await getCvData(lang);
  const name = data?.header?.name || 'CV';

  return {
    title: generateDocumentTitle(name, lang),
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
  const { priorityTokens, contactLocation } = offerPriorityTokensAndContact(
    offer,
    sp,
  );
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
      hideMalt={offer?.contract === 'cdi'}
    />
  );
}
