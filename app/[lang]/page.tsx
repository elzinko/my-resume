import '../../styles/globals.css';

import About from '@/app/[lang]/about';
import Headers from '@/app/[lang]/header';
import { Locale } from '../../i18n-config';
import Contact from './contact';
import Studies from './studies';
import Skills from './skills';
import Domains from './domains';
import Learnings from './learnings';
import Hobbies from './hobbies';
import Jobs from './jobs';
import Projects from './projects';
import CvContent from '@/components/CvContent';
import { getDataWithLocal } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import { CompactCvData } from '@/components/CompactCvLayout';
import formatDates from '@/lib/date';

// Query to fetch all data for compact view
const compactDataQuery = gql`
  query getCompactData($lang: SiteLocale) {
    header(locale: $lang) {
      name
      role
    }
    contact(locale: $lang) {
      phone
      email
      location
    }
    about(locale: $lang) {
      text
    }
    allSkillsModels(locale: $lang) {
      id
      name
    }
    allDomainsModels(locale: $lang) {
      id
      name
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
    }
  }
`;

export default async function Page({
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
    contact: {
      phone: data?.contact?.phone || '',
      email: data?.contact?.email || '',
      location: data?.contact?.location || '',
    },
    about: data?.about?.text || '',
    skills: data?.allSkillsModels || [],
    domains: (data?.allDomainsModels || []).map((d: any) => ({
      title: d.name,
      description: '',
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
    studies: data?.allStudiesModels || [],
  };

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Headers locale={lang} />
      
      <CvContent compactData={compactData} lang={lang as 'fr' | 'en'}>
        {/* Full version content */}
        {/* @ts-expect-error Server Component */}
        <About locale={lang} />
        {/* @ts-expect-error Server Component */}
        <Domains locale={lang} />

        <div className="mt-10 flex columns-1 flex-col md:columns-2 md:flex-row print:mt-4 print:flex-row">
          <div id="left" className="order-last md:order-first md:w-1/3 md:pr-10 print:order-first print:w-1/3 print:pr-4">
            {/* @ts-expect-error Server Component */}
            <Contact locale={lang} />
            {/* @ts-expect-error Server Component */}
            <Skills locale={lang} />
            {/* @ts-expect-error Server Component */}
            <Learnings locale={lang} />
            {/* @ts-expect-error Server Component */}
            <Hobbies locale={lang} />
          </div>
          <div id="main" className="md:w-2/3 md:pr-10 print:w-2/3 print:pr-4">
            {/* @ts-expect-error Server Component */}
            <Jobs locale={lang} />
            {/* @ts-expect-error Server Component */}
            <Projects locale={lang} />
            {/* @ts-expect-error Server Component */}
            <Studies locale={lang} />
          </div>
        </div>
      </CvContent>
    </>
  );
}
