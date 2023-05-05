import '../../styles/globals.css';

import { setTimeout } from 'timers/promises';
import About from '@/app/[lang]/about';
import Headers from '@/app/[lang]/header';
import { Locale } from '../../i18n-config'
import Contact from './contact';
import Studies from './studies';
import Skills from './skills';
import Domains from './domains';
import Learnings from './learnings';
import Hobbies from './hobbies';
import Jobs from './jobs';
import Projects from './projects';
import LocaleSwitcher from '@/components/locale-switcher';

const waitFunction = async () => {
  await setTimeout(2000);
  console.log('Waited 5s');
};

export default function Page({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  console.debug("new lang clicked : " + lang)
  return (
    <>
      <LocaleSwitcher />
      <p>Current locale: {lang}</p>
      {/* @ts-expect-error Server Component */}
      <Headers locale={lang}/>
      {/* @ts-expect-error Server Component */}
      <About locale="fr-FR" />
      {/* @ts-expect-error Server Component */}
      <Domains locale="fr-FR" />

      <div className="mt-10 flex columns-1 flex-col md:columns-2 md:flex-row">
        <div id="left" className="order-last md:order-first md:w-1/3 md:pr-10">
          {/* @ts-expect-error Server Component */}
          <Contact />
          {/* @ts-expect-error Server Component */}
          <Skills />
          {/* @ts-expect-error Server Component */}
          <Learnings />
          {/* @ts-expect-error Server Component */}
          <Hobbies />
        </div>
        <div id="main" className="md:w-2/3">
          {/* @ts-expect-error Server Component */}
          <Jobs />
          {/* @ts-expect-error Server Component */}
          <Projects />
          {/* @ts-expect-error Server Component */}
          <Studies />
        </div>
      </div>
    </>
  );
}
