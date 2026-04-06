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
import EducationLevel from '@/components/EducationLevel';
import Projects from './projects';
import { getCvData } from '@/lib/cv-data';
import { getEducationLevelContent } from '@/lib/education-level-content';
import type { Metadata } from 'next';

// Helper to generate document title (developer style: lowercase with underscores)
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

// Generate dynamic metadata for PDF title
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

export default async function Page({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const data: Record<string, unknown> = (await getCvData(lang)) as Record<
    string,
    unknown
  >;
  const educationLevel = getEducationLevelContent(data, lang);

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Headers locale={lang} />

      {/* @ts-expect-error Server Component */}
      <About locale={lang} />
      {/* @ts-expect-error Server Component */}
      <Domains locale={lang} />

      <div className="cv-mobile-section-mt space-y-10 print:hidden md:hidden">
        {/* @ts-expect-error Server Component */}
        <Contact locale={lang} className="mt-0" />
        {/* @ts-expect-error Server Component */}
        <Skills locale={lang} className="mt-0" />
      </div>

      <div className="flex flex-col print:flex-row md:flex-row">
        <div
          id="left"
          className="order-last flex w-full flex-col print:order-first print:w-1/3 print:pr-4 md:order-first md:w-1/3 md:shrink-0 md:pr-10"
        >
          <div className="hidden print:block md:block">
            {/* @ts-expect-error Server Component */}
            <Contact locale={lang} sectionId={false} />
            {/* @ts-expect-error Server Component */}
            <Skills locale={lang} sectionId={false} />
          </div>
          <EducationLevel content={educationLevel} />
          {/* @ts-expect-error Server Component */}
          <Studies locale={lang} />
          {/* @ts-expect-error Server Component */}
          <Projects locale={lang} />
          {/* @ts-expect-error Server Component */}
          <Learnings locale={lang} />
          {/* @ts-expect-error Server Component */}
          <Hobbies locale={lang} />
        </div>
        <div
          id="main"
          className="w-full print:w-2/3 print:pr-4 md:w-2/3 md:min-w-0 md:pr-10"
        >
          {/* @ts-expect-error Server Component */}
          <Jobs locale={lang} />
        </div>
      </div>
    </>
  );
}
