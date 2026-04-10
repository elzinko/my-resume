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
import ShortHeaderJobFitPills from '@/components/ShortHeaderJobFitPills';
import FullCvPrintPreviewEffect from '@/components/FullCvPrintPreviewEffect';
import ShortAutoprint from '@/components/ShortAutoprint';
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

export default async function ShortPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const data: any = await getCvData(lang);
  const defaultOfferId = process.env.SHORT_CV_OFFER_ID?.trim() || null;
  const defaultOffer = defaultOfferId ? getOffer(defaultOfferId) : undefined;
  const hideMalt = defaultOffer?.contract === 'cdi';

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
        headerRole={data?.header?.role || ''}
        headerContact={{
          email: data?.contact?.email ?? '',
          phone: data?.contact?.phone ?? '',
          location: data?.contact?.location ?? '',
        }}
        defaultOfferId={defaultOfferId}
        hideMalt={hideMalt}
      >
      <Suspense fallback={null}>
        <ShortAutoprint />
      </Suspense>
      <CompactCvLayout
        data={compactData}
        lang={lang as 'fr' | 'en'}
        defaultOfferId={defaultOfferId}
        afterBadge={
          <Suspense fallback={null}>
            <ShortHeaderJobFitPills
              lang={lang}
              defaultOfferId={defaultOfferId}
            />
          </Suspense>
        }
      />
    </ShortPageWrapper>
    </>
  );
}
