// CleanPro ServiceLevels
import { Check, User, FileText, Star, Crown } from "lucide-react";
import Reveal from "../../../components/ui/Reveal";
import Premium from "../../../image/premium.webp";
import Mesure from "../../../image/mesure.webp";
import Essentiel from "../../../image/essentiel.webp";
import Standard from "../../../image/standard.webp";
interface ServiceLevel {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  imageSrc: string;
}

// SÉCURITÉ (CWE-502) : Object.freeze bloque la mutation des données par un script tiers
const servicesData: readonly ServiceLevel[] = Object.freeze([
  {
    id: "essentiel",
    icon: User,
    title: "Essentiel",
    subtitle: "Entretien régulier",
    description: "Idéal pour les petits espaces et les besoins de base.",
    features: [
      "Nettoyage des sols et surfaces",
      "Poubelles et sanitaires",
      "1 à 2 fois par semaine",
    ],
    imageSrc: Essentiel,
  },
  {
    id: "standard",
    icon: FileText,
    title: "Standard",
    subtitle: "Espaces professionnels",
    description: "Pour les bureaux et espaces à fort passage.",
    features: [
      "Toutes les prestations de l'Essentiel",
      "Désinfection des points de contact",
      "3 à 5 fois par semaine",
    ],
    imageSrc: Standard,
  },
  {
    id: "premium",
    icon: Star,
    title: "Premium",
    subtitle: "Haute exigence",
    description: "Pour les environnements sensibles et les grandes surfaces.",
    features: [
      "Toutes les prestations du Standard",
      "Nettoyage approfondi",
      "Produits éco-responsables",
    ],
    imageSrc: Premium,
  },
  {
    id: "sur-mesure",
    icon: Crown,
    title: "Sur-mesure",
    subtitle: "Selon vos besoins",
    description: "Une solution personnalisée pour des exigences spécifiques.",
    features: [
      "Analyse de vos besoins",
      "Équipe dédiée",
      "Suivi qualité régulier",
    ],
    imageSrc: Mesure,
  },
]);

export default function ServiceLevels() {
  return (
    <section
      aria-labelledby="offres-services-titre"
      className="w-full bg-[#f4f9f6] py-16 lg:py-24 border-t border-slate-100"
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* En-tête avec animation */}
        <Reveal direction="up">
          <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-12 lg:mb-16">
            <div className="max-w-2xl">
              <span className="text-[#1d6f4c] font-bold text-[13px] uppercase tracking-widest block mb-3">
                Nos formules de services
              </span>
              <h2
                id="offres-services-titre"
                className="text-[2rem] lg:text-[2.75rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight"
              >
                Des solutions sur mesure <br className="hidden md:block" />
                pour chaque espace
              </h2>
            </div>
            <div className="max-w-lg lg:pb-1">
              <p className="text-[15px] lg:text-[16px] text-slate-600 font-medium leading-relaxed">
                Nous proposons différents niveaux de services de nettoyage,
                selon la taille de vos locaux, votre secteur d'activité et vos
                exigences en matière d'hygiène.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Grille des Cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {servicesData.map((service, index) => (
            <Reveal key={service.id} direction="up" delay={index * 150}>
              <div
                id={service.id}
                // Structure modifiée : overflow-hidden pour que l'image respecte les bords arrondis
                className="bg-white rounded-[1.25rem] overflow-hidden shadow-sm border border-slate-200 flex flex-col h-full hover:border-[#1d6f4c]/40 hover:shadow-[0_12px_40px_rgba(29,111,76,0.08)] transition-all duration-300 group"
              >
                {/* 1. Bloc Image (Haut de la carte) */}
                <div className="relative w-full h-45 bg-slate-100 overflow-hidden shrink-0 select-none">
                  {/* Calque de dégradé : Assombrit légèrement l'image pour le style, disparaît au survol */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/20 to-transparent z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-0"></div>

                  <img
                    src={service.imageSrc}
                    alt={`Illustration de l'offre ${service.title}`}
                    loading="lazy" // PERF: Chargement asynchrone
                    draggable={false} // SÉCURITÉ UX: Anti drag-and-drop
                    onContextMenu={(e) => e.preventDefault()} // SÉCURITÉ UX: Anti clic-droit
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* 2. Bloc Contenu (Bas de la carte) */}
                <div className="p-6 lg:p-7 flex flex-col flex-1">
                  {/* Titre et Icône */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="bg-[#eaf4ef] w-12 h-12 rounded-full flex items-center justify-center text-[#1d6f4c] shrink-0">
                      <service.icon
                        className="w-6 h-6 stroke-[2.5]"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="text-[1.25rem] font-bold text-slate-900 leading-tight mb-0.5 tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-[13px] text-slate-500 font-medium leading-tight">
                        {service.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description courte */}
                  <p className="text-[14.5px] text-slate-600 font-medium leading-relaxed mb-6 h-11">
                    {service.description}
                  </p>

                  {/* Liste des caractéristiques */}
                  <ul role="list" className="space-y-3 mb-8 flex-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="bg-[#1d6f4c] rounded-full p-0.5 mt-1 shrink-0">
                          <Check
                            className="w-3.5 h-3.5 text-white stroke-3"
                            aria-hidden="true"
                          />
                        </div>
                        <span className="text-[14.5px] font-semibold text-slate-700 leading-snug">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
