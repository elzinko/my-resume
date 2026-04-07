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
import ShortAutoprint from '@/components/ShortAutoprint';
import TechMatch from '@/app/[lang]/offer/[offerId]/tech-match';
import { getOffer } from '@/data/offers';
import type { Metadata } from 'next';

function generateDocumentTitle(
  name: string,
  lang: string,
  mode: 'full' | 'short',
): string {
  const prefix = lang === 'fr' ? 'cv' : 'resume';
  const modeLabel =
    lang === 'fr' ? (mode === 'full' ? 'complet' : 'court') : mode;
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
    title: generateDocumentTitle(name, lang, 'short'),
  };
}

function resolveShortOfferId(
  searchParams: Record<string, string | string[] | undefined> | undefined,
): string | null {
  const raw = searchParams?.offer;
  const fromQuery = Array.isArray(raw) ? raw[0] : raw;
  const trimmed = fromQuery?.trim();
  if (trimmed) return trimmed;
  const fromEnv = process.env.SHORT_CV_OFFER_ID?.trim();
  if (fromEnv) return fromEnv;
  return null;
}

export default async function ShortPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: Locale };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const data: any = await getCvData(lang);
  const offerId = resolveShortOfferId(searchParams);
  const offerBlock =
    offerId && getOffer(offerId)
      ? // @ts-expect-error Async RSC — Promise<Element> is valid at runtime; JSX types lag for async components
        (<TechMatch locale={lang} offerId={offerId} />)
      : null;

  const compactData: CompactCvData = {
    header: {
      name: data?.header?.name || '',
      role: data?.header?.role || '',
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
    about: data?.about?.text || '',
    skills: data?.allSkillsModels || [],
    domains: (data?.allDomainsModels || []).map((d: any) => ({
      id: d.id,
      name: d.name,
      description: d.description || '',
      competencies: d.competencies || [],
    })),
    jobs: (data?.allJobsModels || []).map((j: any) => {
      const dates = formatDates(j.startDate, j.endDate);
      const [start, end] = dates ? dates.split(' - ') : ['', ''];
      return {
        client: j.client,
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
  };

  return (
    <ShortPageWrapper
      lang={lang}
      headerName={data?.header?.name || ''}
      headerRole={data?.header?.role || ''}
    >
      <Suspense fallback={null}>
        <ShortAutoprint />
      </Suspense>
      <CompactCvLayout data={compactData} lang={lang as 'fr' | 'en'}>
        {offerBlock}
      </CompactCvLayout>
    </ShortPageWrapper>
  );
}
