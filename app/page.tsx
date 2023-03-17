import '../styles/globals.css';

import About from '@/app/about';
import Headers from '@/app/header';
import Contact from './contact';
import Studies from './studies';
import Skills from './skills';
import Domains from './domains';
import Learnings from './learnings';
import Hobbies from './hobbies';
import Jobs from './jobs';
import Projects from './projects';

import { setTimeout } from 'timers/promises';

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
