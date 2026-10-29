import { ArrowRight, Users, Leaf, Clock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Hero from "../../../assets/hero.webp";

const benefits = [
  {
    Icon: Users,
    label: (
      <>
        Équipe qualifiée
        <br />
        et de confiance
      </>
    ),
  },
  {
    Icon: Leaf,
    label: (
      <>
        Produits écologiques
        <br />
        et sûrs
      </>
    ),
  },
  {
    Icon: Clock,
    label: (
      <>
        Flexibilité
        <br />
        des interventions
      </>
    ),
  },
  {
    Icon: ShieldCheck,
    label: (
      <>
        Satisfaction
        <br />
        garantie
      </>
    ),
  },
];

export default function HomeHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white font-sans">
      {/* Conteneur principal compact calqué sur la hauteur et l'alignement de la maquette */}
      <div className="relative mx-auto flex w-full max-w-[1720px] flex-col lg:min-h-125 lg:flex-row px-6 lg:px-10 xl:px-12">
        {/* Colonne gauche (Texte compact - Rendu instantané 0ms CLS) */}
        <div className="z-10 flex w-full flex-col justify-center py-6 sm:py-8 lg:w-[48%] lg:py-8">
          <div className="w-full max-w-145 space-y-4">
            {/* Badge compact */}
            <div className="inline-flex w-fit rounded-full bg-[#eaf4ef] px-3.5 py-1 text-xs sm:text-[13px] font-bold tracking-wide text-[#1d6f4c]">
              Une entreprise, des espaces plus propres
            </div>

            {/* Titre aux proportions exactes de la référence */}
            <h1 className="text-[2.2rem] font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-[2.6rem] lg:text-[2.75rem]">
              Des services de nettoyage
              <br />
              <span className="text-[#1d6f4c]">
                adaptés à chaque niveau
                <br />
                de besoin
              </span>
            </h1>

            {/* Paragraphe court et compact */}
            <p className="max-w-125 text-[15px] font-medium leading-relaxed text-slate-600 sm:text-base">
              CleanPro Services vous accompagne avec des solutions de nettoyage
              professionnelles, fiables et personnalisées pour un environnement
              de travail plus sain et plus agréable.
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <Link
                to="/services"
                className="flex items-center justify-center gap-2.5 rounded-xl bg-[#1d6f4c] px-6 py-2.5 text-sm sm:text-[15px] font-bold text-white transition-colors hover:bg-[#195f42] focus:outline-none focus:ring-4 focus:ring-[#1d6f4c]/30"
              >
                Découvrir nos services
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm sm:text-[15px] font-bold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
              >
                Nous contacter
              </Link>
            </div>

            {/* Barre des 4 avantages en une ligne */}
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 pt-3">
              {benefits.map(({ Icon, label }, index) => (
                <div
                  key={index}
                  className="flex flex-1 min-w-28.75 items-center gap-2 border-r border-slate-200 pr-2 last:border-0"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf4ef]">
                    <Icon
                      className="h-4 w-4 text-[#1d6f4c]"
                      strokeWidth={2.2}
                    />
                  </span>
                  <span className="text-[11px] font-bold leading-tight text-slate-700">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne droite : Visuel Hero redimensionnable et stable (0 CLS) */}
        <div className="relative mt-6 w-full lg:mt-0 lg:absolute lg:inset-y-0 lg:right-0 lg:w-[54%]">
          {/* Bandeau vert biseauté décoratif à l'extrême droite */}
          <div
            className="absolute inset-y-0 right-0 hidden w-[11%] bg-[#1d6f4c] lg:block"
            style={{ clipPath: "polygon(35% 0, 100% 0, 100% 100%, 0 100%)" }}
          />

          {/* Conteneur de l'image avec dimensions réservées pour éviter tout saut de mise en page */}
          <div className="relative aspect-16/11 w-full overflow-hidden rounded-2xl bg-slate-100 sm:aspect-16/10 lg:absolute lg:inset-0 lg:aspect-auto lg:rounded-none lg:right-[4.5%] lg:[clip-path:polygon(7%_0,100%_0,100%_100%,0_100%)]">
            <img
              src={Hero}
              alt="Ménagère professionnelle nettoyant une vitre"
              width={800}
              height={550}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover object-[center_20%] sm:object-[center_15%]"
            />
          </div>

          {/* Badge flottant blanc */}
          <div className="absolute bottom-3 right-3 z-20 flex max-w-50 items-start gap-2.5 rounded-xl border border-slate-100 bg-white/95 p-3 shadow-lg backdrop-blur-xs sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:p-4 sm:max-w-55 sm:right-6 lg:right-[2.5%]">
            <div className="mt-0.5 shrink-0 rounded-lg bg-[#1d6f4c] p-2 text-white">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs sm:text-[13px] font-bold leading-tight text-slate-900">
                Un environnement
                <br />
                plus sain pour
                <br />
                votre équipe
              </p>
              <div className="mt-2 h-[2.5px] w-7 sm:w-8 rounded-full bg-[#1d6f4c]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
