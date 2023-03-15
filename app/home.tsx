import '../styles/globals.css';

import About from '@/app/about';
import Headers from '@/app/header';
import Skills from '@/app/skills';

export default function HomePage({ data }: any): JSX.Element {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Headers />
      {/* @ts-expect-error Server Component */}
      <About />
      {/* @ts-expect-error Server Component */}
      <Skills />
    </>
  );
}
