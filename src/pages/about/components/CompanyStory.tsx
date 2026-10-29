import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import LobbyImage from "../../../image/soc.webp";
import Reveal from "../../../components/ui/Reveal";

export default function CompanyStory() {
  return (
    <section
      // DIRECTIVE : Zéro tiret dans l'ID pour la liaison ARIA
      aria-labelledby="company_story_title"
      className="mx-auto w-full max-w-[1720px] overflow-hidden px-6 py-16 sm:px-8 lg:py-24 lg:px-10 xl:px-12 font-sans bg-white"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Colonne Gauche : Contenu textuel */}
        <div className="order-2 lg:order-1 flex flex-col items-start lg:pr-4">
          <Reveal direction="up" delay={100}>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-[#00964f]">
              NOTRE HISTOIRE
            </p>
            <h2
              id="company_story_title" // SÉCURITÉ DESIGN : Zéro tiret
              className="mb-6 text-[2rem] font-extrabold leading-tight tracking-tight text-[#15364a] lg:text-[2.25rem]"
            >
              Une entreprise née d'une vision
            </h2>
            <p className="mb-8 max-w-[540px] text-[15px] font-medium leading-relaxed text-slate-600">
              CleanPro est née de la volonté de répondre à un besoin croissant :
              celui d'un service de nettoyage fiable, professionnel et
              respectueux de l'environnement. Depuis notre création, nous avons
              grandi grâce à la confiance de nos clients et à l'engagement de
              nos équipes.
            </p>

            {/* 
              BOUTON STRICT : Conservation du `rounded-md` selon ta consigne absolue 
              pour éviter le style pilule/start-up.
            */}
            <Link
              to="/contact"
              className="inline-flex items-center gap-2.5 rounded-md border-2 border-[#00964f] bg-transparent px-6 py-2.5 text-[14px] font-bold text-[#00964f] transition-colors hover:bg-[#00964f] hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-[#00964f] focus-visible:ring-offset-2"
            >
              Nous contacter
              <ArrowRight className="h-4 w-4 stroke-2" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        {/* Colonne Droite : Image asymétrique exacte selon la maquette */}
        <div className="order-1 lg:order-2 w-full">
          <Reveal direction="left" delay={200}>
            {/* 
              Le padding gauche (pl-6 à pl-12) crée le décalage nécessaire pour 
              laisser le fond vert pâle dépasser sur la gauche. 
            */}
            <div className="relative w-full h-[260px] sm:h-[300px] lg:h-[340px] pl-6 sm:pl-10 lg:pl-12">
              {/* Fond décoratif : Arrondi massif à gauche, léger à droite */}
              <div
                className="absolute top-4 bottom-4 left-0 w-full bg-[#f4f9f6] rounded-l-[100px] rounded-r-2xl -z-10"
                aria-hidden="true"
              ></div>

              {/* Image Principale : object-contain pour voir l'image entière */}
              <img
                src={LobbyImage}
                alt="Façade extérieure des locaux de CleanPro"
                loading="lazy"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="h-full w-full object-contain object-center rounded-l-[100px] rounded-r-2xl"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
