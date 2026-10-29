import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import { useRef } from "react";
import Reveal from "../../../components/ui/Reveal";

interface Testimonial {
  author: string;
  role: string;
  company: string;
  content: string;
  city: string;
  initials: string;
  avatarColor: string;
}

const testimonials: Testimonial[] = [
  {
    author: "Sophie Bernard",
    role: "Directrice Administrative",
    company: "Groupe Elite",
    content:
      "CleanPro a transformé nos espaces de travail. L’équipe est ponctuelle, professionnelle et très discrète. Nous sommes ravis du service !",
    city: "Yaoundé, Cameroun",
    initials: "SB",
    avatarColor: "bg-[#c8906b]",
  },
  {
    author: "Jean-Pierre Moukeng",
    role: "Directeur Général",
    company: "Société TechPlus",
    content:
      "Un service de qualité irréprochable. Nos bureaux n’ont jamais été aussi propres. Je recommande vivement CleanPro !",
    city: "Douala, Cameroun",
    initials: "JM",
    avatarColor: "bg-[#385565]",
  },
  {
    author: "Caroline Lefèvre",
    role: "Responsable des Achats",
    company: "Hôtel Le Prestige",
    content:
      "La flexibilité et le sérieux de l’équipe sont impressionnants. Nos clients remarquent la différence, et nous aussi !",
    city: "Bafoussam, Cameroun",
    initials: "CL",
    avatarColor: "bg-[#ae775f]",
  },
  {
    author: "Daniel Tchinda",
    role: "Gérant",
    company: "Immeuble Horizon",
    content:
      "Excellent service ! L’équipe CleanPro est toujours à l’écoute et s’adapte à nos besoins. Un vrai partenaire de confiance.",
    city: "Douala, Cameroun",
    initials: "DT",
    avatarColor: "bg-[#4d7564]",
  },
];

export default function TestimonialsGrid() {
  const cardsRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    cardsRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section
      aria-labelledby="client-reviews-title"
      className="mx-auto w-full max-w-[1720px] px-6 pb-8 pt-7 sm:px-8 lg:px-10 xl:px-12 font-sans"
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <Reveal direction="up" delay={100}>
            <p className="mb-1.5 text-[10px] font-bold tracking-wide text-[#00964f]">
              NOS CLIENTS
            </p>
            <h2
              id="client-reviews-title"
              className="text-[1.45rem] font-extrabold leading-tight tracking-tight text-[#15364a]"
            >
              Des avis qui nous motivent
            </h2>
            <p className="mt-1.5 text-[11px] text-slate-600">
              Ils nous ont fait confiance, voici ce qu’ils en pensent.
            </p>
          </Reveal>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Avis précédents"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-[#00964f] transition hover:border-[#00964f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00964f]"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Avis suivants"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-[#00964f] transition hover:border-[#00964f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00964f]"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <Reveal direction="up" delay={200}>
        <div
          ref={cardsRef}
          className="grid gap-4 overflow-x-auto pb-1 sm:grid-cols-2 lg:grid-cols-4"
          role="region"
          aria-label="Avis clients"
        >
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.author}
              className="flex min-h-49 min-w-60 flex-col rounded-lg border border-slate-100 bg-white p-4 shadow-[0_5px_20px_rgba(21,54,74,0.04)]"
            >
              <div className="flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ring-2 ring-slate-100 ${testimonial.avatarColor}`}
                >
                  {testimonial.initials}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-[10px] font-bold text-[#15364a]">
                    {testimonial.author}
                  </h3>
                  <p className="mt-0.5 text-[9px] leading-tight text-slate-500">
                    {testimonial.role}
                  </p>
                  <p className="text-[9px] leading-tight text-slate-500">
                    {testimonial.company}
                  </p>
                </div>
              </div>
              <div
                className="mt-3 flex gap-0.5 text-[#f5a900]"
                aria-label="5 étoiles sur 5"
              >
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="h-3 w-3 fill-current stroke-current"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="mt-2.5 flex-1 text-[10px] leading-[1.55] text-slate-600">
                “{testimonial.content}”
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-[9px] text-slate-500">
                <MapPin
                  className="h-3 w-3 shrink-0 text-[#00964f]"
                  aria-hidden="true"
                />
                {testimonial.city}
              </p>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
