import { useRef } from "react";
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import Reveal from "../../../components/ui/Reveal";

interface Testimonial {
  readonly id: string;
  readonly author: string;
  readonly role: string;
  readonly company: string;
  readonly content: string;
  readonly city: string;
  readonly initials: string;
  readonly avatarColor: string;
  readonly rating: number;
}

const testimonialsData: readonly Testimonial[] = Object.freeze([
  {
    id: "t-sophie",
    author: "Sophie Bernard",
    role: "Directrice Administrative",
    company: "Groupe Elite",
    content:
      "CleanPro a transformé nos espaces de travail. L’équipe est ponctuelle, professionnelle et très discrète. Nous sommes ravis du service !",
    city: "Yaoundé, Cameroun",
    initials: "SB",
    avatarColor: "bg-[#c8906b]",
    rating: 5,
  },
  {
    id: "t-jean-pierre",
    author: "Jean-Pierre Moukeng",
    role: "Directeur Général",
    company: "Société TechPlus",
    content:
      "Un service de qualité irréprochable. Nos bureaux n’ont jamais été aussi propres. Je recommande vivement CleanPro !",
    city: "Douala, Cameroun",
    initials: "JM",
    avatarColor: "bg-[#385565]",
    rating: 5,
  },
  {
    id: "t-caroline",
    author: "Caroline Lefèvre",
    role: "Responsable des Achats",
    company: "Hôtel Le Prestige",
    content:
      "La flexibilité et le sérieux de l’équipe sont impressionnants. Nos clients remarquent la différence, et nous aussi !",
    city: "Bafoussam, Cameroun",
    initials: "CL",
    avatarColor: "bg-[#ae775f]",
    rating: 5,
  },
  {
    id: "t-daniel",
    author: "Daniel Tchinda",
    role: "Gérant",
    company: "Immeuble Horizon",
    content:
      "Excellent service ! L’équipe CleanPro est toujours à l’écoute et s’adapte à nos besoins. Un vrai partenaire de confiance.",
    city: "Douala, Cameroun",
    initials: "DT",
    avatarColor: "bg-[#4d7564]",
    rating: 5,
  },
]);

export default function TestimonialsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      aria-labelledby="temoignages_titre"
      className="w-full bg-white py-16 lg:py-24 border-t border-slate-100 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1720px] px-6 sm:px-8 lg:px-10 xl:px-12 font-sans">
        {/* En-tête : Titre et Boutons de navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10 lg:mb-12">
          <div>
            <Reveal direction="up" delay={100}>
              <span className="text-[#1d6f4c] font-bold text-[11px] uppercase tracking-widest block mb-2">
                TÉMOIGNAGES
              </span>
              <h2
                id="temoignages_titre"
                className="text-[1.75rem] lg:text-[2rem] font-extrabold text-slate-900 leading-tight tracking-tight"
              >
                Ils nous font confiance
              </h2>
              <p className="mt-1 text-[13px] text-slate-500">
                Découvrez les retours d'expérience de nos clients partenaires
              </p>
            </Reveal>
          </div>

          {/* Contrôles du carrousel avec icônes */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Avis précédents"
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#1d6f4c] hover:border-[#1d6f4c] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c]"
            >
              <ChevronLeft className="w-5 h-5 stroke-2" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Avis suivants"
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#1d6f4c] hover:border-[#1d6f4c] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c]"
            >
              <ChevronRight className="w-5 h-5 stroke-2" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Carrousel des cartes de témoignages fidèles à la maquette */}
        <Reveal direction="up" delay={200}>
          <div
            ref={scrollContainerRef}
            style={{ scrollbarWidth: "none" }}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-label="Carrousel des témoignages"
          >
            {testimonialsData.map((testimonial) => (
              <div
                key={testimonial.id}
                className="snap-start shrink-0 w-[88vw] sm:w-[420px] lg:w-[440px] flex flex-col justify-between bg-white rounded-xl p-6 lg:p-7 border border-slate-200/90 shadow-[0_4px_16px_rgba(21,54,74,0.04)]"
              >
                <div>
                  {/* Profil de l'auteur avec badge initiales */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      aria-hidden="true"
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs ${testimonial.avatarColor}`}
                    >
                      {testimonial.initials}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-slate-900 leading-tight">
                        {testimonial.author}
                      </h3>
                      <p className="truncate text-[12px] text-slate-500 leading-tight mt-0.5">
                        {testimonial.role} · <span className="font-semibold text-slate-700">{testimonial.company}</span>
                      </p>
                    </div>
                  </div>

                  {/* Note étoiles dorées */}
                  <div
                    className="flex items-center gap-0.5 text-[#f5a900] mb-3"
                    aria-label={`${testimonial.rating} étoiles sur 5`}
                  >
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-current stroke-current"
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  {/* Contenu du témoignage */}
                  <p className="text-[14px] text-slate-600 font-medium leading-relaxed italic mb-4">
                    « {testimonial.content} »
                  </p>
                </div>

                {/* Ville / Localisation */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[12px] text-slate-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#1d6f4c] shrink-0" aria-hidden="true" />
                  <span>{testimonial.city}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
