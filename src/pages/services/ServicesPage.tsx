import ServicesHero from "./components/ServicesHero";
import ServicesList from "./components/ServicesList";

export default function ServicesPage() {
  return (
    <div className="overflow-hidden bg-white font-sans text-[#15364a]">
      {/* 1. En-tête : Solutions de nettoyage adaptées à tous vos espaces */}
      <ServicesHero />

      {/* 2. Liste détaillée des 4 services phares sous forme de cartes modulaires */}
      <ServicesList />
    </div>
  );
}
