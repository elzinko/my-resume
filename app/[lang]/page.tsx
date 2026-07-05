import OfferTailoredShell from '@/components/OfferTailoredShell';
import { Locale } from '../../i18n-config';
import type { Metadata } from 'next';
import { getCvData } from '@/lib/cv-data';
import { buildFullCvShellProps } from '@/lib/full-cv-shell-props';

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
  const shellProps = await buildFullCvShellProps(lang, searchParams);
  return <OfferTailoredShell {...shellProps} />;
}
