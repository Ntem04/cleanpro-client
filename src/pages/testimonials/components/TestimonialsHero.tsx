import { Quote, Star } from "lucide-react";
import HeroImage from "../../../assets/hero.webp";
import Reveal from "../../../components/ui/Reveal";

const reviewerAvatars = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
];

function OrganicLeaf({
  className = "",
  color = "#5bbd88",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 85C14 42 42 12 88 10C89 56 61 86 12 85Z"
        fill={color}
      />
    </svg>
  );
}

export default function TestimonialsHero() {
  return (
    <section
      aria-labelledby="testimonials_title"
      className="relative overflow-hidden border-b border-slate-100 bg-[linear-gradient(110deg,#fff_40%,#f8fbf9_100%)] font-sans"
    >
      <div className="relative mx-auto grid w-full max-w-[1720px] items-center gap-10 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:px-10 lg:py-14 xl:px-12">
        {/* Colonne gauche : Titre, description, avis */}
        <div className="relative z-10">
          <Reveal direction="up" delay={100}>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="h-0.5 w-6 bg-[#00964f]" aria-hidden="true" />
              <p className="text-[12px] font-bold uppercase tracking-widest text-[#00964f]">
                TÉMOIGNAGES
              </p>
            </div>

            <h1
              id="testimonials_title"
              className="text-[2.35rem] font-extrabold leading-[1.12] tracking-tight text-[#15364a] sm:text-[2.75rem] lg:text-[3.1rem]"
            >
              Ce que nos clients disent <br />
              <span className="text-[#00964f]">de nous</span>
            </h1>

            <p className="mt-5 max-w-120 text-[14.5px] font-medium leading-relaxed text-slate-600 sm:text-[15px]">
              La satisfaction de nos clients est notre plus grande réussite.
              Découvrez leurs témoignages et pourquoi ils nous font confiance
              pour l’entretien de leurs espaces.
            </p>

            {/* Barre de réassurance sociale (sans encadré blanc, comme sur la maquette) */}
            <div className="mt-8 flex flex-wrap items-center gap-5 sm:gap-6">
              {/* Avatars réels superposés */}
              <div
                className="flex -space-x-2.5"
                aria-label="Nos clients satisfaits"
              >
                {reviewerAvatars.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt=""
                    className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-slate-100"
                    loading="lazy"
                  />
                ))}
              </div>

              {/* Note et étoiles */}
              <div className="flex flex-col">
                <p className="text-[12px] font-bold text-slate-800">
                  + 250 clients satisfaits
                </p>
                <div
                  className="mt-1 flex gap-0.5 text-[#f5a900]"
                  aria-label="Note moyenne : 4,9 sur 5"
                >
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4 fill-[#f5a900] text-[#f5a900]"
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>

              {/* Séparateur vertical */}
              <div
                className="hidden h-8 w-px bg-slate-200 sm:block"
                aria-hidden="true"
              />

              {/* Moyenne numérique */}
              <div className="flex flex-col">
                <p className="text-[11px] font-medium text-slate-500">
                  Une note moyenne de
                </p>
                <p className="mt-0.5 text-[18px] font-extrabold leading-none text-[#00964f]">
                  4,9/5
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Colonne droite : Photo de la professionnelle + carte citation + feuilles bien visibles */}
        <div className="relative flex items-center justify-end py-4 lg:py-6">
          <Reveal direction="left" delay={200} className="w-full">
            <div className="relative isolate mx-auto w-full max-w-145 aspect-4/3 sm:aspect-16/10 lg:aspect-auto lg:h-110 pr-0 sm:pr-6 lg:pr-10">
              {/* Feuille arrière supérieure droite */}
              <OrganicLeaf
                className="absolute -right-4 -top-8 h-36 w-36 sm:h-44 sm:w-44 rotate-12 opacity-70 pointer-events-none z-0"
                color="#b8e7cc"
              />

              {/* Feuilles décoratives gauches (bien visibles, chevauchant subtilement le bord gauche de la photo) */}
              <OrganicLeaf
                className="absolute -left-10 sm:-left-12 top-1/2 -translate-y-1/2 h-36 w-36 sm:h-44 sm:w-44 -rotate-12 opacity-80 pointer-events-none z-20"
                color="#5cb883"
              />
              <OrganicLeaf
                className="absolute -left-8 sm:-left-10 top-1/4 h-28 w-28 sm:h-36 sm:w-36 -rotate-30 opacity-60 pointer-events-none z-20"
                color="#82d1a3"
              />
              <OrganicLeaf
                className="absolute -left-2 sm:-left-4 bottom-4 h-12 w-12 sm:h-16 sm:w-16 rotate-45 opacity-60 pointer-events-none z-20"
                color="#a3dfbc"
              />

              {/* Photo avec coins arrondis organiques (grand arrondi en haut à gauche et en bas à gauche) */}
              <div className="relative h-full w-full overflow-hidden rounded-tl-[60px] rounded-bl-[60px] sm:rounded-tl-[80px] sm:rounded-bl-[80px] rounded-tr-3xl rounded-br-3xl shadow-sm z-10">
                <img
                  src={HeroImage}
                  alt="Une professionnelle CleanPro avec le sourire en plein travail"
                  className="h-full w-full object-cover object-[center_30%]"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>

              {/* Carte citation flottante sur la droite */}
              <article className="absolute -right-2 sm:-right-6 lg:-right-8 top-[55%] z-30 w-[min(290px,82%)] -translate-y-1/2 rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-[0_20px_50px_rgba(21,54,74,0.12)]">
                <Quote
                  className="h-6 w-6 sm:h-7 sm:w-7 fill-[#00964f] text-[#00964f]"
                  aria-hidden="true"
                />
                <p className="mt-3 text-[12.5px] sm:text-[13px] font-medium leading-relaxed text-[#15364a]">
                  “Une équipe professionnelle, à l’écoute et toujours disponible.
                  Le résultat est impeccable !”
                </p>
                <div className="mt-4">
                  <p className="text-[12px] font-bold text-[#15364a]">
                    — Marie D.
                  </p>
                  <p className="mt-0.5 text-[10.5px] font-medium text-slate-500">
                    Responsable RH, Groupe SANA
                  </p>
                </div>
              </article>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
