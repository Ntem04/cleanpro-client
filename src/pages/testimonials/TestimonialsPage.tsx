import ImpactStats from "./components/ImpactStats";
import QuoteBanner from "./components/QuoteBanner";
import TestimonialsHero from "./components/TestimonialsHero";
import TestimonialsGrid from "./components/TestimonialsGrid";

export default function TestimonialsPage() {
  return (
    <div className="overflow-hidden bg-white font-sans text-[#15364a]">
      <TestimonialsHero />
      <TestimonialsGrid />
      <ImpactStats />
      <QuoteBanner />
    </div>
  );
}
