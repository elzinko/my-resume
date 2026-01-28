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
import { getDataWithLocal } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import type { Metadata } from 'next';

// Query to fetch header for metadata
const headerQuery = gql`
  query getHeader($lang: SiteLocale) {
    header(locale: $lang) {
      name
    }
  }
`;

// Helper to generate document title (developer style: lowercase with underscores)
function generateDocumentTitle(name: string, lang: string, mode: 'full' | 'short'): string {
  const prefix = lang === 'fr' ? 'cv' : 'resume';
  const modeLabel = lang === 'fr' 
    ? (mode === 'full' ? 'complet' : 'court') 
    : mode;
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const safeName = name.toLowerCase().replace(/\s+/g, '_');
  return `${prefix}_${safeName}_${modeLabel}_${date}`;
}

// Generate dynamic metadata for PDF title
export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const data: any = await getDataWithLocal({ locale: lang } as any, headerQuery);
  const name = data?.header?.name || 'CV';
  
  return {
    title: generateDocumentTitle(name, lang, 'full'),
  };
}

export default async function Page({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Headers locale={lang} />
      
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
    </>
  );
}
