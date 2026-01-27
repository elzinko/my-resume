import '../../../styles/globals.css';

import { Locale } from '../../../i18n-config';
import { getDataWithLocal } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import CompactCvLayout, { CompactCvData } from '@/components/CompactCvLayout';
import formatDates from '@/lib/date';
import ShortPageWrapper from '@/components/ShortPageWrapper';

// Query to fetch all data for compact view
const compactDataQuery = gql`
  query getCompactData($lang: SiteLocale) {
    header(locale: $lang) {
      name
      role
    }
    contact(locale: $lang) {
      title
      phoneTitle
      phone
      emailTitle
      email
      locationTitle
      location
    }
    about(locale: $lang) {
      title
      text
    }
    skillsTitle(locale: $lang) {
      title
    }
    studiesTitle(locale: $lang) {
      title
    }
    jobsTitle(locale: $lang) {
      title
    }
    allSkillsModels(locale: $lang) {
      id
      name
      link
    }
    allDomainsModels(locale: $lang) {
      id
      name
      description
      competencies {
        id
        name
      }
    }
    allJobsModels(locale: $lang, filter: { visible: { eq: true } }) {
      client
      location
      startDate
      endDate
      description
      frameworks {
        id
        name
      }
      role {
        name
      }
    }
    allStudiesModels(locale: $lang) {
      id
      name
      establishment
      startDate
      endDate
    }
  }
`;

export default async function ShortPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  // Fetch data for compact view
  const data: any = await getDataWithLocal({ locale: lang } as any, compactDataQuery);
  
  // Transform data for compact layout
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
      title: d.name,
      description: d.description || '',
      tags: (d.competencies || []).map((c: any) => c.name),
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
        frameworks: j.frameworks || [],
      };
    }),
    studies: (data?.allStudiesModels || [])
      .map((s: any) => ({
        ...s,
        startDate: s.startDate,
        endDate: s.endDate,
      }))
      .sort((a: any, b: any) => {
        // Sort by endDate descending (most recent first)
        const dateA = a.endDate || a.startDate || '';
        const dateB = b.endDate || b.startDate || '';
        return dateB.localeCompare(dateA);
      }),
  };

  return (
    <ShortPageWrapper 
      lang={lang} 
      headerName={data?.header?.name || ''} 
      headerRole={data?.header?.role || ''}
    >
      <CompactCvLayout data={compactData} lang={lang as 'fr' | 'en'} />
    </ShortPageWrapper>
  );
}
