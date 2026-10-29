import AboutHero from "./components/AboutHero";
import CompanyStory from "./components/CompanyStory";
import CompanyValues from "./components/CompanyValues";
import TeamSection from "./components/TeamSection";

export default function AboutPage() {
  return (
    <div className="overflow-hidden bg-white font-sans text-[#15364a]">
      <AboutHero />
      <CompanyStory />
      <CompanyValues />
      <TeamSection />
    </div>
  );
}
