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
