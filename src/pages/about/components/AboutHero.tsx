import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import SupportImage from "../../../image/about.webp";
import AboutLeaf from "./AboutLeaf";
import Reveal from "../../../components/ui/Reveal";

export default function AboutHero() {
  return (
    <section
      // DIRECTIVE : Zéro tiret dans les IDs et les liens ARIA
      aria-labelledby="about_title"
      className="relative border-b border-slate-100 bg-[linear-gradient(110deg,#fff_40%,#f8fbf9_100%)] font-sans"
    >
      {/* CORRECTION LINTER : min-h-[420px] -> min-h-105, etc. */}
      <div className="relative mx-auto grid min-h-105 w-full max-w-[1720px] items-center gap-8 px-6 pb-6 pt-0 sm:px-8 sm:pb-8 sm:pt-0 lg:min-h-125 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:px-10 lg:pb-8 lg:pt-0 xl:px-12">
        <div className="relative z-10">
          <Reveal direction="up" delay={100}>
            <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#00964f]">
              {/* A11Y : Les éléments purement décoratifs doivent être ignorés par les lecteurs d'écran */}
              <span className="h-0.5 w-5 bg-[#00964f]" aria-hidden="true" />À
              PROPOS DE CLEANPRO
            </p>
            <h1
              id="about_title"
              className="max-w-130 text-[2.2rem] font-extrabold leading-[1.08] tracking-tight text-[#15364a] sm:text-[2.6rem] lg:text-[2.75rem]"
            >
              Plus qu'un service de nettoyage,{" "}
              <span className="text-[#00964f]">un engagement durable.</span>
            </h1>
            <span
              className="mt-4 block h-0.5 w-8 bg-[#00964f]"
              aria-hidden="true"
            />

            <p className="mt-5 max-w-115 text-[15px] font-medium leading-relaxed text-slate-600">
              CleanPro est une entreprise spécialisée dans les services de
              nettoyage professionnels pour les entreprises, les commerces et
              les espaces publics. Nous mettons notre expertise, notre rigueur
              et notre passion au service d'un environnement plus propre, plus
              sain et plus agréable.
            </p>

            {/* DIRECTIVE : rounded-xl remplacé par rounded-md (rigueur B2B) */}
            <Link
              to="/services"
              className="mt-6 inline-flex items-center gap-2.5 rounded-md bg-[#00964f] px-6 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#087c46] outline-none focus-visible:ring-2 focus-visible:ring-[#00964f] focus-visible:ring-offset-2"
            >
              Découvrir nos services
              <ArrowRight className="h-4 w-4 stroke-2" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <div className="relative w-full">
          <Reveal direction="left" delay={200}>
            {/* Conteneur image adaptatif : ratio naturel sur mobile pour voir toute l'image, hauteur fluide sur PC */}
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-md sm:aspect-16/10 lg:aspect-auto lg:min-h-105">
              <img
                src={SupportImage}
                alt="Une professionnelle effectuant le nettoyage d'un espace de travail"
                className="h-full w-full object-cover object-[center_30%] rounded-md shadow-sm"
                fetchPriority="high"
                loading="eager" // SÉCURITÉ LCP : Pas de lazy loading Above The Fold
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>

            {/* Décorations masquées à l'accessibilité */}
            <AboutLeaf
              className="absolute -left-8 bottom-1 h-24 w-24 -rotate-12 sm:-left-10 sm:h-28 sm:w-28"
              aria-hidden="true"
            />
            <AboutLeaf
              className="absolute -right-4 -top-4 h-24 w-24 rotate-12 sm:h-28 sm:w-28"
              color="#bce5cc"
              aria-hidden="true"
            />

            {/* DIRECTIVE : rounded-xl -> rounded-md */}
            <article className="absolute right-0 top-1/2 z-10 w-[min(280px,78%)] -translate-y-1/2 rounded-md border border-slate-100 bg-white p-5 shadow-[0_12px_35px_rgba(21,54,74,0.12)] sm:right-[-2%] sm:p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#e8f5ed] text-[#00964f]">
                <Leaf className="h-5 w-5 stroke-2" aria-hidden="true" />
              </span>
              <h2 className="mt-3 text-[15px] font-bold text-[#15364a]">
                Notre mission
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
                Offrir des espaces propres, sûrs et sains, en plaçant la
                qualité, la confiance et la satisfaction client au cœur de notre
                action.
              </p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
