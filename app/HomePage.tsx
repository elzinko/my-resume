import "../styles/globals.css";
import AboutSection from "@/app/aboutSection";
import Headers from "@/app/header";
import SkillsSection from "@/app/skillsSection";

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
