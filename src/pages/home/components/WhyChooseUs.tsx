import { Link } from "react-router-dom";
import { ArrowRight, Leaf, ShieldCheck, Clock, Headset } from "lucide-react";
import Reveal from "../../../components/ui/Reveal";

// SÉCURITÉ : Typage strict
interface Feature {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

// SÉCURITÉ (CWE-502) : Immutabilité des données pour prévenir la mutation DOM
const featuresData: readonly Feature[] = Object.freeze([
  {
    id: "eco",
    icon: Leaf,
    title: "Produits écologiques",
    description:
      "Des solutions respectueuses de l'environnement et de la santé.",
  },
  {
    id: "team",
    icon: ShieldCheck,
    title: "Personnel formé",
    description: "Des équipes professionnelles et régulièrement formées.",
  },
  {
    id: "flex",
    icon: Clock,
    title: "Intervention flexible",
    description: "Adaptation à vos horaires et à vos contraintes.",
  },
  {
    id: "support",
    icon: Headset,
    title: "Support client réactif",
    description: "Une équipe à votre écoute 24h/7j.",
  },
]);

export default function WhyChooseUs() {
  return (
    // SÉMANTIQUE & A11Y : Section reliée à son titre
    <section
      aria-labelledby="pourquoi-nous-choisir-titre"
      className="w-full bg-white py-12 lg:py-16 border-t border-slate-100"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-6">
          {/* Bloc Gauche : Titre et Call-to-Action (Ajusté Pixel Perfect) */}
          <div className="w-full lg:w-1/3 flex flex-col items-center text-center lg:items-start lg:text-left shrink-0">
            <Reveal direction="left" delay={100}>
              <span className="text-[#1d6f4c] font-bold text-[11px] uppercase tracking-widest block mb-2">
                Pourquoi nous choisir
              </span>
              <h2
                id="pourquoi-nous-choisir-titre"
                className="text-[1.75rem] lg:text-[2rem] font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-3"
              >
                Une qualité de service <br className="hidden lg:block" />
                qui fait la différence
              </h2>
              {/* Marge réduite (mb-5 au lieu de mb-8) pour remonter le bouton */}
              <p className="text-[13px] lg:text-[14px] text-slate-600 font-medium leading-relaxed mb-5 max-w-[90%]">
                Nous allions expertise, technologie et engagement écologique
                pour vous garantir des espaces propres, sûrs et accueillants.
              </p>

              {/* SÉCURITÉ UX : outline-none et padding réduit[cite: 13] */}
              <Link
                to="/engagement"
                className="inline-flex items-center justify-center gap-2 bg-[#1d6f4c] hover:bg-[#195f42] text-white font-bold text-[13px] py-2.5 px-6 rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c]/50 group"
              >
                Découvrir notre engagement
                <ArrowRight
                  className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </Reveal>
          </div>

          {/* Bloc Droite : Grille des 4 arguments avec textes réduits[cite: 13] */}
          <div className="w-full lg:w-2/3 lg:pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-0 lg:divide-x lg:divide-slate-200">
              {featuresData.map((feature, index) => (
                <Reveal
                  key={feature.id}
                  direction="up"
                  delay={200 + index * 100}
                >
                  <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:px-5 xl:px-6 first:lg:pl-0 last:lg:pr-0">
                    <feature.icon
                      className="w-8 h-8 text-[#1d6f4c] stroke-[1.5] mb-4"
                      aria-hidden="true"
                    />
                    <h3 className="text-[14px] lg:text-[15px] font-bold text-slate-900 mb-1.5 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-[12px] lg:text-[13px] text-slate-500 font-medium leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
