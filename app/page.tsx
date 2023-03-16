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
import { setTimeout } from 'timers/promises';
import Experiences from './experiences';
import Projects from './projects';

const waitFunction = async () => {
  await setTimeout(2000);
  console.log('Waited 5s');
};

export default async function Page() {
  // await waitFunction(); // for loader tests
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Headers />
      {/* @ts-expect-error Server Component */}
      <About />
      {/* @ts-expect-error Server Component */}
      <Domains />

      <div className="mt-10 flex columns-1 flex-col md:columns-2 md:flex-row">
        <div id="left" className="order-last md:order-first md:w-1/3 md:pr-10">
          {/* @ts-expect-error Server Component */}
          <Contact />
          {/* <Github /> */}
          {/* @ts-expect-error Server Component */}
          <Skills />
          {/* @ts-expect-error Server Component */}
          <Learnings />
          {/* @ts-expect-error Server Component */}
          <Interests />
        </div>
        <div id="main" className="md:w-4/6">
          <Projects />
          <Experiences />
          {/* @ts-expect-error Server Component */}
          <Studies />
        </div>
      </div>
    </>
  );
}
