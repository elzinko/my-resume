import About from '@/app/[lang]/about';
import Headers from '@/app/[lang]/header';
import Contact from '@/app/[lang]/contact';
import Studies from '@/app/[lang]/studies';
import Skills from '@/app/[lang]/skills';
import Domains from '@/app/[lang]/domains';
import Learnings from '@/app/[lang]/learnings';
import Hobbies from '@/app/[lang]/hobbies';
import Jobs from '@/app/[lang]/jobs';
import Projects from '@/app/[lang]/projects';
import EducationLevel from '@/components/EducationLevel';
import type { EducationLevelContent } from '@/lib/education-level-content';
import type { Locale } from 'i18n-config';
import type { ReactNode } from 'react';

/**
 * Mise en page commune des pages CV « sur mesure » (custom / match).
 */
export default function OfferTailoredShell({
  lang,
  educationLevel,
  matchSection,
}: {
  lang: Locale;
  educationLevel: EducationLevelContent;
  matchSection: ReactNode;
}) {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Headers locale={lang} />

      <div className="cv-flow-mobile-stack">
        {/* @ts-expect-error Server Component */}
        <About locale={lang} />
        {/* @ts-expect-error Server Component */}
        <Domains locale={lang} />

        {matchSection}

        <div className="space-y-10 print:hidden md:hidden max-md:!mt-0">
          {/* @ts-expect-error Server Component */}
          <Contact locale={lang} className="mt-0" />
          {/* @ts-expect-error Server Component */}
          <Skills locale={lang} className="mt-0" />
        </div>
      </div>

      <div className="cv-page-split">
        <div
          id="left"
          className="order-last flex w-full min-w-0 flex-col print:order-first print:col-span-1 md:order-first md:col-span-1"
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
          <div className="max-md:hidden">
            {/* @ts-expect-error Server Component */}
            <Projects locale={lang} />
            <div className="print:hidden">
              {/* @ts-expect-error Server Component */}
              <Learnings locale={lang} />
            </div>
            <div className="print:hidden">
              {/* @ts-expect-error Server Component */}
              <Hobbies locale={lang} />
            </div>
          </div>
        </div>
        <div
          id="main"
          className="w-full min-w-0 print:col-span-2 md:col-span-2"
        >
          {/* @ts-expect-error Server Component */}
          <Jobs locale={lang} />
        </div>
      </div>

      <div className="flex max-md:mt-10 max-md:flex-col max-md:gap-10 md:hidden print:hidden">
        {/* @ts-expect-error Server Component */}
        <Projects locale={lang} sectionId={false} className="mt-0" />
        {/* @ts-expect-error Server Component */}
        <Learnings locale={lang} sectionId={false} className="mt-0" />
        {/* @ts-expect-error Server Component */}
        <Hobbies locale={lang} sectionId={false} className="mt-0" />
      </div>
    </>
  );
}
