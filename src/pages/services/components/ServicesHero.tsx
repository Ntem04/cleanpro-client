import { Leaf, ShieldCheck, Users } from "lucide-react";
import HeroImage from "../../../image/services.webp";
import Reveal from "../../../components/ui/Reveal";

export default function ServicesHero() {
  return (
    <section
      aria-labelledby="services_hero_title"
      className="relative w-full overflow-hidden border-b border-[#e2f0e8] bg-[#f4faf6] font-sans"
    >
      {/* 
        IMAGE PHOTO RÉELLE : 
        - Sur mobile : bloc visuel visible avec hauteur fluide et proportionnelle
        - Sur PC (lg) : positionnée en absolute à droite
      */}
      <div className="pointer-events-none relative w-full select-none lg:absolute lg:inset-y-0 lg:right-0 lg:z-0 lg:w-[62%] xl:w-[58%]">
        <div className="aspect-16/10 w-full overflow-hidden sm:aspect-video lg:aspect-auto lg:h-full">
          <img
            src={HeroImage}
            alt="Technicienne de surface CleanPro souriante et équipée"
            loading="eager"
            fetchPriority="high"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            className="h-full w-full object-cover object-[center_25%]"
          />
        </div>

        {/* 
          FONDU PROGRESSIF :
          Sur PC uniquement sur la bordure gauche pour joindre le fond blanc sans toucher le personnage.
        */}
        <div
          className="hidden absolute inset-y-0 left-0 w-24 bg-linear-to-r from-[#f4faf6] to-transparent lg:block lg:w-36"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-375 px-6 py-10 sm:px-8 lg:px-10 lg:py-12 xl:px-12">
        <div className="flex flex-col gap-8 lg:min-h-75 lg:flex-row lg:items-center lg:justify-between">
          {/* BLOC GAUCHE : Textes et atouts */}
          <div className="w-full lg:max-w-170 xl:max-w-180 flex flex-col items-start">
            <Reveal direction="up" delay={100}>
              {/* Sur-titre */}
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0d8d5e]/15 text-[#0d8d5e]">
                  <span
                    className="h-2 w-2 rounded-full bg-[#0d8d5e]"
                    aria-hidden="true"
                  />
                </span>
                <span className="text-[12px] font-bold uppercase tracking-widest text-[#0d8d5e]">
                  NOS SERVICES
                </span>
              </div>

              {/* Titre bicolore */}
              <h1
                id="services_hero_title"
                className="text-[2.25rem] font-extrabold leading-[1.05] tracking-tight text-[#15364a] sm:text-[2.8rem] lg:text-[3.35rem]"
              >
                Des solutions de nettoyage <br />
                <span className="text-[#0d8d5e]">
                  adaptées à tous vos espaces
                </span>
              </h1>

              {/* Description */}
              <p className="mt-4 max-w-130 text-[14px] font-medium leading-relaxed text-slate-600 sm:text-[15px]">
                Chez CleanPro, nous proposons des services de nettoyage
                professionnels pour les particuliers et les entreprises. Chaque
                espace mérite une attention spéciale, et nous avons la solution
                qu'il vous faut.
              </p>

              {/* Atouts en ligne sous le texte */}
              <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#0d8d5e]/30 bg-[#edf7f1] text-[#0d8d5e]">
                    <ShieldCheck
                      className="h-4.5 w-4.5 stroke-2"
                      aria-hidden="true"
                    />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold leading-tight text-[#15364a]">
                      Professionnalisme
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium text-slate-500">
                      &amp; confiance
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#0d8d5e]/30 bg-[#edf7f1] text-[#0d8d5e]">
                    <Leaf className="h-4.5 w-4.5 stroke-2" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold leading-tight text-[#15364a]">
                      Produits écologiques
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium text-slate-500">
                      et sûrs
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#0d8d5e]/30 bg-[#edf7f1] text-[#0d8d5e]">
                    <Users
                      className="h-4.5 w-4.5 stroke-2"
                      aria-hidden="true"
                    />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold leading-tight text-[#15364a]">
                      Équipe qualifiée
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium text-slate-500">
                      et expérimentée
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* BLOC DROITE : Carte blanche flottante */}
          <div className="w-full shrink-0 pt-2 lg:w-auto lg:pt-0">
            <Reveal direction="left" delay={200}>
              <article className="relative w-full max-w-70 rounded-2xl border border-[#e2f0e8] bg-white/95 p-5 shadow-[0_12px_32px_rgba(13,141,94,0.16)] backdrop-blur-md">
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#0d8d5e] text-white shadow-sm">
                  <Leaf className="h-5 w-5 stroke-2" aria-hidden="true" />
                </span>

                <h2 className="text-[1rem] font-bold leading-snug text-[#15364a]">
                  Un environnement propre, <br />
                  <span className="text-[#0d8d5e]">
                    une meilleure productivité
                  </span>
                </h2>

                <p className="mt-2 text-[11px] font-medium leading-relaxed text-slate-500">
                  Des espaces propres pour des équipes plus motivées et
                  performantes.
                </p>

              </article>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
