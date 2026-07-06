import { getCvData } from '@/lib/cv-data';
import { getMatchCatalog } from '@/lib/match-catalog-server';
import { getEducationLevelContent } from '@/lib/education-level-content';
import { offerPriorityTokensAndContact } from '@/lib/offer-page-data';
import { resolveOfferFromUrlParams } from '@/lib/query-offer-params';
import { recordToURLSearchParams } from '@/lib/search-params-to-url';
import { parseDetailLevel, parseMaxJobShown } from '@/lib/cv-detail-level';
import { parseEntriesLayout } from '@/lib/cv-entries-layout';
import type { ContractType } from '@/data/offers/types';
import type { CvMode } from '@/lib/cv-contract-text';
import type { Locale } from 'i18n-config';
import type { ComponentProps } from 'react';
import type OfferTailoredShell from '@/components/OfferTailoredShell';

type ShellProps = ComponentProps<typeof OfferTailoredShell>;

/**
 * Construit les props d'`OfferTailoredShell` (CV complet) à partir de `lang` + query params.
 *
 * Source UNIQUE de la mise en page CV long, utilisée par :
 * - `/[lang]` (route complète, tous régimes) ;
 * - `/[lang]/short` (uniquement pour le rendu **mobile** : le CV court ne s'affiche jamais
 *   sur mobile — cf. ADR-0006 « vue mobile indépendante ». L'affichage mobile de `/short`
 *   est donc identique à celui de `/`, sans redirect ni réécriture d'URL).
 *
 * Évite la duplication de la logique de parsing entre les deux routes.
 */
export async function buildFullCvShellProps(
  lang: Locale,
  searchParams?: Record<string, string | string[] | undefined>,
): Promise<ShellProps> {
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
  const modeParam =
    typeof searchParams?.mode === 'string' ? searchParams.mode : undefined;
  const mode: CvMode | undefined = modeParam === 'teaching' ? 'teaching' : undefined;
  const { priorityTokens, contactLocation } = offerPriorityTokensAndContact(
    offer,
    sp,
  );
  const subtitleOverride =
    (lang === 'fr'
      ? sp.get('subtitle_fr') || sp.get('subtitle')
      : sp.get('subtitle_en') || sp.get('subtitle')
    )?.trim() || undefined;
  const eduRaw = sp.get('edu')?.trim();
  const showEducationLevel =
    offer?.showEducation === true || eduRaw === '1' || eduRaw === 'true';
  const contact = data.contact as
    | { email?: string; phone?: string; location?: string }
    | undefined;

  const showPhoto = sp.get('photo') !== '0';
  const showAge = sp.get('age') !== '0';
  const headerAlign: 'left' | 'right' =
    sp.get('headerAlign') === 'right' ? 'right' : 'left';
  const detailLevel = parseDetailLevel(sp.get('detail'));
  const maxJobShown = parseMaxJobShown(sp.get('maxJobShown'));
  const entriesLayout = parseEntriesLayout(sp.get('entriesLayout'));

  return {
    lang,
    educationLevel,
    headerContactStrip: {
      email: contact?.email ?? '',
      phone: contact?.phone ?? '',
      location: contact?.location ?? '',
    },
    frameworkDisplayPriorityTokens: priorityTokens,
    contactLocation,
    hideMalt: contract === 'cdi' || mode === 'teaching',
    contract,
    mode,
    subtitleOverride,
    showEducationLevel,
    showPhoto,
    showAge,
    headerAlign,
    detailLevel,
    maxJobShown,
    entriesLayout,
  };
}
