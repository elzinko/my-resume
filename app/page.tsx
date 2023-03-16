import '../styles/globals.css';

import About from '@/app/about';
import Headers from '@/app/header';
import Github from './github';
import Contact from './contact';
import Studies from './studies';
import Skills from './skills';
import Domains from './domains';
import Learnings from './learnings';
import Interests from './interests';

export default async function Page() {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Headers />
      {/* @ts-expect-error Server Component */}
      <About />
      {/* @ts-expect-error Server Component */}
      <Domains />

      <div className="mt-20 flex">
        <div id="left" className="w-1/3 pr-10">
          {/* @ts-expect-error Server Component */}
          <Contact />
          {/* @ts-expect-error Server Component */}
          <Github />
          {/* @ts-expect-error Server Component */}
          <Skills />
          {/* @ts-expect-error Server Component */}
          <Learnings />
          {/* @ts-expect-error Server Component */}
          <Interests />
        </div>
        <div id="main" className="w-4/6">
          {/* <Projects /> */}

          {/* <Experiences /> */}

          {/* @ts-expect-error Server Component */}
          <Studies />
        </div>
      </div>
    </>
  );
}
