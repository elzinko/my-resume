import "../styles/globals.css";
import AboutSection from "./aboutSection";
import Headers from "./header";
import SkillsSection from "./skillsSection";

export default function HomePage({ data }: any): JSX.Element {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Headers />
      {/* @ts-expect-error Server Component */}
      <AboutSection />
      {/* @ts-expect-error Server Component */}
      <SkillsSection />
    </>
  );
}
