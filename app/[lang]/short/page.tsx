import '../../../styles/globals.css';

import { Suspense } from 'react';
import { Locale } from '../../../i18n-config';
import { getCvData } from '@/lib/cv-data';
import {
  byEndThenStart,
  sortChronologicalDesc,
} from '@/lib/sort-chronological';
import CompactCvLayout, { CompactCvData } from '@/components/CompactCvLayout';
import { getEducationLevelContent } from '@/lib/education-level-content';
import formatDates from '@/lib/date';
import ShortPageWrapper from '@/components/ShortPageWrapper';
import FullCvPrintPreviewEffect from '@/components/FullCvPrintPreviewEffect';
import ShortAutoprint from '@/components/ShortAutoprint';
import {
  resolveAboutText,
  resolveDomainDescription,
} from '@/lib/cv-contract-text';
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
      .filter((j: { display?: boolean }) => j.display !== false)
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
        (p: { display?: boolean }) => p.display !== false,
      ),
      byEndThenStart,
    ),
  };

  return (
    <>
      <Suspense fallback={null}>
        <FullCvPrintPreviewEffect />
      </Suspense>
      <ShortPageWrapper
        lang={lang}
        headerName={data?.header?.name || ''}
        headerRole={subtitleOverride || data?.header?.role || ''}
        hideMalt={hideMalt}
      >
        <Suspense fallback={null}>
          <ShortAutoprint />
        </Suspense>
        <CompactCvLayout
          data={compactData}
          lang={lang as 'fr' | 'en'}
          highlightedJobSlugs={highlightedJobSlugs}
        />
      </ShortPageWrapper>
    </>
  );
}
