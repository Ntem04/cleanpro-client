import { Clock } from "lucide-react";
import Reveal from "../../../components/ui/Reveal";
import SupportImg from "../../../image/support.webp";

export default function ContactBanner() {
  return (
    <section
      aria-labelledby="contact_titre"
      // RÉDUCTION DE L'ESPACEMENT : Padding top (pt-8/lg:pt-12) considérablement réduit
      // pour recoller le composant sous la Navbar conformément au visuel.
      className="relative w-full bg-white pt-8 pb-16 lg:pt-12 lg:pb-24 overflow-hidden font-sans"
    >
      <div className="mx-auto w-full max-w-[1720px] px-6 lg:px-10 xl:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          {/* Bloc Gauche : Contenu textuel */}
          <div className="w-full lg:w-[45%] flex flex-col items-start shrink-0 relative z-20">
            <Reveal direction="left" delay={100}>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-8 h-0.5 bg-[#1d6f4c]"
                  aria-hidden="true"
                ></div>
                {/* DIRECTIVE RESPECTÉE : Zéro tiret ("CONTACTEZ NOUS") */}
                <span className="text-[#1d6f4c] font-bold text-[11px] uppercase tracking-widest">
                  CONTACTEZ NOUS
                </span>
              </div>

              <h2
                id="contact_titre"
                className="text-[2rem] lg:text-[2.75rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6"
              >
                Une question, un besoin ? <br className="hidden xl:block" />
                <span className="text-[#1d6f4c]">
                  Nous sommes là pour vous.
                </span>
              </h2>

              <p className="text-[14.5px] text-slate-600 font-medium leading-relaxed mb-10 max-w-md">
                Notre équipe est à votre écoute pour toute demande
                d'information, de devis ou de conseil. N'hésitez pas à nous
                contacter, nous vous répondrons dans les plus brefs délais.
              </p>

              <div className="flex items-center gap-4">
                {/* Icône d'horloge exactement comme sur la maquette (cercle fin, pas de fond) */}
                <div className="flex items-center justify-center w-11 h-11 rounded-full border-[1.5px] border-[#1d6f4c] text-[#1d6f4c] shrink-0">
                  <Clock className="w-5 h-5 stroke-2" aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
                    Réponse sous 24h
                  </h3>
                  <p className="text-[13px] text-slate-500 font-medium mt-0.5">
                    Du lundi au vendredi
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Bloc Droite : Image et texte manuscrit superposé */}
          <div className="w-full lg:w-[52%] relative z-20">
            <Reveal direction="right" delay={200}>
              <div className="relative w-full aspect-16/11 sm:aspect-16/10 lg:aspect-auto lg:h-105 rounded-3xl overflow-hidden shadow-sm">
                <img
                  src={SupportImg}
                  alt="Conseillère du support client CleanPro"
                  loading="lazy"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-full object-cover object-center"
                />

                {/* 
                  TEXTE FLOTTANT : Ajouté en HTML absolu pour éviter de l'incruster dans l'image (SEO/A11y)[cite: 9].
                  J'utilise une police italique standard plutôt qu'une police manuscrite personnalisée 
                  pour ne pas dégrader les performances (LCP).
                */}
                <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-md shadow-lg border border-slate-100 -rotate-2">
                  <p className="text-[#1d6f4c] font-bold text-[14px] lg:text-[15px] italic leading-tight text-center">
                    Votre satisfaction <br /> est notre priorité
                  </p>
                  {/* Ligne verte de soulignement décorative */}
                  <div
                    className="w-12 h-0.5 bg-[#1d6f4c] mx-auto mt-2 rounded-full"
                    aria-hidden="true"
                  ></div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* 
        SVG FEUILLE (Design exigé)[cite: 9] : 
        Injecté en SVG pur, positionné en absolute derrière le texte et l'image (z-index: 0).
        Totalement inerte pour les événements de clic et invisible pour les lecteurs d'écran.
      */}
      <Reveal direction="up" delay={300}>
        <div
          className="absolute left-[35%] lg:left-[42%] top-[60%] -translate-y-1/2 -translate-x-1/2 w-40 h-40 lg:w-56 lg:h-56 opacity-90 pointer-events-none z-0 rotate-[-15deg]"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="#9cdb9e"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm"
          >
            <path d="M21.949 3.051C21.949 3.051 22.949 14.051 15.949 21.051C8.949 28.051 3.949 21.051 3.949 21.051C3.949 21.051 2.949 10.051 9.949 3.051C16.949 -3.949 21.949 3.051 21.949 3.051Z" />
          </svg>
        </div>
      </Reveal>
    </section>
  );
}
