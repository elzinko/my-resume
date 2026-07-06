import { Suspense } from 'react';
import { Locale } from '../../../i18n-config';
import { getCvData } from '@/lib/cv-data';
import {
  byEndThenStart,
  sortChronologicalDesc,
} from '@/lib/sort-chronological';
import CompactCvLayout, { CompactCvData } from '@/components/CompactCvLayout';
import { getEducationLevelContent } from '@/lib/education-level-content';
import formatDates, { computeAge } from '@/lib/date';
import ShortPageWrapper from '@/components/ShortPageWrapper';
import FullCvPrintPreviewEffect from '@/components/FullCvPrintPreviewEffect';
import AtsLabelsEffect from '@/components/AtsLabelsEffect';
import CvAutoprint from '@/components/CvAutoprint';
import OfferTailoredShell from '@/components/OfferTailoredShell';
import { buildFullCvShellProps } from '@/lib/full-cv-shell-props';
import CvZoomSlider from '@/components/CvZoomSlider';
import { isCvPrintPreviewQuery } from '@/lib/cv-print-preview';
import {
  resolveAboutText,
  resolveDomainDescription,
} from '@/lib/cv-contract-text';
import { resolveOfferFromUrlParams } from '@/lib/query-offer-params';
import { getMatchCatalog } from '@/lib/match-catalog-server';
import type { ContractType } from '@/data/offers/types';
import type { Metadata } from 'next';

import { generateDocumentTitle } from '@/lib/cv-document-title';

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const data: any = await getCvData(lang);
  const name = data?.header?.name || 'CV';

  return {
    title: generateDocumentTitle(name, lang, 'short'),
  };
}

export default async function ShortPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: Locale };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const data: any = await getCvData(lang);
  const contractParam =
    typeof searchParams?.contract === 'string'
      ? searchParams.contract
      : undefined;
  const contract: ContractType | undefined =
    contractParam === 'cdi' || contractParam === 'freelance'
      ? contractParam
      : undefined;
  const hideMalt = contract === 'cdi';

  const sp = new URLSearchParams(
    Object.entries(searchParams ?? {}).flatMap(([k, v]) =>
      Array.isArray(v) ? v.map((val) => [k, val]) : v != null ? [[k, v]] : [],
    ),
  );
  const subtitleOverride =
    (lang === 'fr'
      ? sp.get('subtitle_fr') || sp.get('subtitle')
      : sp.get('subtitle_en') || sp.get('subtitle')
    )?.trim() || undefined;
  // Position du titre : à gauche par défaut, `?headerAlign=right` pour l'aligner à droite.
  const headerAlign: 'left' | 'right' =
    sp.get('headerAlign') === 'right' ? 'right' : 'left';
  // Photo : affichée par défaut (`?photo=0` pour masquer), placée à l'opposé du titre.
  const photoUrl =
    sp.get('photo') !== '0' && typeof data?.header?.photo === 'string'
      ? (data.header.photo as string)
      : undefined;
  // Âge : affiché par DÉFAUT (`?age=0` pour masquer) — indépendant des autres params, comme le CV complet.
  // Garde le null de computeAge (birthDate malformé) → pas de « null ans » rendu (cf. header complet).
  const ageValue =
    sp.get('age') !== '0' && typeof data?.header?.birthDate === 'string'
      ? computeAge(data.header.birthDate)
      : null;
  const ageText =
    ageValue != null
      ? lang === 'en'
        ? `${ageValue} years old`
        : `${ageValue} ans`
      : undefined;

  const offer = resolveOfferFromUrlParams(sp, getMatchCatalog());
  const eduRaw = sp.get('edu')?.trim();
  const showEducationLevel =
    offer?.showEducation === true || eduRaw === '1' || eduRaw === 'true';

  // Missions mises en avant par le LLM (param `job`, répétable)
  const jobParam = searchParams?.job;
  const highlightedJobSlugs: string[] | undefined = jobParam
    ? (Array.isArray(jobParam) ? jobParam : [jobParam])
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  const compactData: CompactCvData = {
    header: {
      name: data?.header?.name || '',
      role: subtitleOverride || data?.header?.role || '',
    },
    titles: {
      about: data?.about?.title || '',
      skills: data?.skillsTitle?.title || '',
      contact: data?.contact?.title || '',
      education: data?.studiesTitle?.title || '',
      experience: data?.jobsTitle?.title || '',
    },
    contact: {
      phoneTitle: data?.contact?.phoneTitle || '',
      phone: data?.contact?.phone || '',
      emailTitle: data?.contact?.emailTitle || '',
      email: data?.contact?.email || '',
      locationTitle: data?.contact?.locationTitle || '',
      location: data?.contact?.location || '',
    },
    about: resolveAboutText(data?.about, contract),
    skills: data?.allSkillsModels || [],
    domains: (data?.allDomainsModels || []).map((d: any) => ({
      id: d.id,
      name: d.name,
      description: resolveDomainDescription(d, contract),
      competencies: d.competencies || [],
    })),
    jobs: (data?.allJobsModels || [])
      .filter((j: { display?: boolean; displayMode?: string }) => {
        if (j.display === false) return false;
        if (j.displayMode) return false;
        return true;
      })
      .map((j: any) => {
        const dates = formatDates(j.startDate, j.endDate);
        const [start, end] = dates ? dates.split(' - ') : ['', ''];
        return {
          client: j.client,
          clientUrl: j.clientUrl,
          role: j.role?.name || '',
          location: j.location,
          startDate: start || '',
          endDate: end || undefined,
          description: j.description,
          descriptionShort: j.descriptionShort,
          bullets: j.bullets,
          frameworks: j.frameworks || [],
        };
      }),
    studies: sortChronologicalDesc(
      (data?.allStudiesModels || []).map((s: any) => ({
        ...s,
        startDate: s.startDate,
        endDate: s.endDate,
      })),
      byEndThenStart,
    ),
    educationLevel: getEducationLevelContent(
      data as Record<string, unknown>,
      lang,
    ),
    projectsTitle: data?.projectsTitle?.title ?? 'Projects',
    projects: sortChronologicalDesc(
      (data?.allProjectsModels || []).filter(
        (p: { display?: boolean; displayMode?: string }) => {
          if (p.display === false) return false;
          if (p.displayMode) return false;
          return true;
        },
      ),
      byEndThenStart,
    ),
  };

  // Props du CV complet (source unique, partagée avec `/[lang]`) — pour le rendu MOBILE.
  const fullShellProps = await buildFullCvShellProps(lang, searchParams);

  // Contexte impression (URL `?print` / `?autoprint`) : la sortie est TOUJOURS le CV
  // court A4 — le shell mobile n'est ni affiché ni imprimé, on ne le rend donc PAS.
  // Bonus : allège le DOM de l'aperçu et du PDF Puppeteer, et rend `/short?print`
  // structurellement identique à l'avant-ADR-0006 (aucun décalage de rendu).
  const isPrintContext =
    isCvPrintPreviewQuery(sp) || sp.get('autoprint') === '1';

  // Enveloppe A4 du CV court (aperçu fidèle + zoom). Source unique de {desktop-écran,
  // aperçu `?print`, PDF} → WYSIWYG préservé (arbre A4 inchangé).
  const shortA4 = (
    <div className="cv-print-preview">
      <div className="cv-short-page mx-auto max-w-[800px]">
        <ShortPageWrapper
          lang={lang}
          headerName={data?.header?.name || ''}
          headerRole={subtitleOverride || data?.header?.role || ''}
          hideMalt={hideMalt}
          align={headerAlign}
          photoUrl={photoUrl}
          ageText={ageText}
        >
          <CompactCvLayout
            data={compactData}
            lang={lang as 'fr' | 'en'}
            highlightedJobSlugs={highlightedJobSlugs}
            showEducationLevel={showEducationLevel}
          />
        </ShortPageWrapper>
      </div>
      <Suspense fallback={null}>
        <CvZoomSlider />
      </Suspense>
    </div>
  );

  return (
    <>
      {/* Effets globaux montés UNE seule fois. */}
      <Suspense fallback={null}>
        <FullCvPrintPreviewEffect />
        <AtsLabelsEffect />
        <CvAutoprint />
      </Suspense>

      {isPrintContext ? (
        // IMPRESSION / APERÇU : uniquement le CV court A4 (pas de shell mobile).
        shortA4
      ) : (
        <>
          {/* MOBILE (écran uniquement) — ADR-0006 : le CV court ne s'affiche JAMAIS
              sur mobile. On rend la vue COMPLÈTE (identique à `/[lang]`), sans redirect
              ni réécriture d'URL. Hors de l'enveloppe A4 → rendu mobile fidèle au complet.
              `renderEffects={false}` : effets déjà montés ci-dessus. */}
          <div className="md:hidden print:hidden print-preview:hidden">
            <OfferTailoredShell {...fullShellProps} renderEffects={false} />
          </div>
          {/* DESKTOP + IMPRESSION (Cmd+P sans `?print`) — le CV court A4 (inchangé). */}
          <div className="hidden md:block print:block print-preview:block">
            {shortA4}
          </div>
        </>
      )}
    </>
  );
}
