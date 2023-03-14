import "../styles/globals.css";

import AboutSection from "./AboutSection";
import SkillsSection from "./SkillsSection";

export default function HomePage({ data }: any): JSX.Element {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <AboutSection />
      {/* @ts-expect-error Server Component */}
      <SkillsSection />
    </>
  );
}
