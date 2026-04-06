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

      {/* @ts-expect-error Server Component */}
      <About locale={lang} />
      {/* @ts-expect-error Server Component */}
      <Domains locale={lang} />

      {matchSection}

      <div className="mt-4 space-y-4 md:hidden print:hidden">
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
          <div className="hidden md:block print:block">
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
