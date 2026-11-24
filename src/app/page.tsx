import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/HeroSection";

// Hybrid Web2.5 (PRD 1.2): hero renders immediately; heavier interactive
// sections are loaded lazily on the client.
const SkillsSection = dynamic(() => import("@/components/sections/SkillsSection"));
const ExperienceSection = dynamic(
  () => import("@/components/sections/ExperienceSection"),
);
const ProjectsSection = dynamic(() => import("@/components/sections/ProjectsSection"));
const GuestbookSection = dynamic(() => import("@/components/sections/GuestbookSection"));

export default function Home() {
  return (
    <>
      <HeroSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <GuestbookSection />
    </>
  );
}
