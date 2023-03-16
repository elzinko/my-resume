import '../styles/globals.css';

import About from '@/app/about';
import Headers from '@/app/header';
import Github from './github';
import Contact from './contact';
import Interests from './interests';
import Projects from './projects';
import Experiences from './experiences';
import Studies from './studies';
import Frameworks from './frameworks';
import Skills from './skills';
import Learnings from './learnings';

export default function HomePage() {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Headers />
      {/* @ts-expect-error Server Component */}
      <About />
      {/* @ts-expect-error Server Component */}
      <Skills />

      <div className="mt-20 flex">
        <div id="left" className="w-1/3 pr-10">
          {/* @ts-expect-error Server Component */}
          <Contact />
          {/* @ts-expect-error Server Component */}
          <Github />
          {/* @ts-expect-error Server Component */}
          <Frameworks />
          {/* @ts-expect-error Server Component */}
          <Learnings />

          {/* <Interests /> */}
        </div>
        <div id="main" className="w-4/6">
          <Projects />
          <Experiences />
          {/* @ts-expect-error Server Component */}
          <Studies />
        </div>
      </div>
    </>
  );
}
