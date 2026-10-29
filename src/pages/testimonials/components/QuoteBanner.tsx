import { useState } from "react";
import { Play, Square } from "lucide-react";
import HeroImage from "../../../assets/hero.webp";
import LeafDecoration from "./LeafDecoration";
import Reveal from "../../../components/ui/Reveal";

export default function QuoteBanner() {
  // SÉCURITÉ PERF : La vidéo n'est pas chargée dans le DOM tant qu'elle n'est pas cliquée.
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section
      // DIRECTIVE : Zéro tiret dans l'ID
      aria-labelledby="quote_banner_title"
      className="mx-auto mb-8 w-full max-w-[1720px] px-6 sm:px-8 lg:px-10 xl:px-12 font-sans"
    >
      {/* SÉCURITÉ DESIGN : Remplacement de rounded-2xl par rounded-md (angles B2B stricts) */}
      <div className="relative isolate flex min-h-[300px] lg:min-h-[380px] items-center overflow-hidden rounded-md bg-[#064d38] px-6 py-10 text-white sm:px-12">
        {/* SYSTÈME DE FOND DYNAMIQUE (Image ou Vidéo) */}
        {isVideoPlaying ? (
          <video
            autoPlay
            loop
            muted // OBLIGATOIRE : Les navigateurs bloquent l'autoplay si le son est activé
            playsInline
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          >
            {/* À remplacer par l'URL de ta vraie vidéo optimisée (idéalement en WebM + MP4) */}
            <source src="/assets/videos/presentation.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        ) : (
          <img
            src={HeroImage}
            alt="Nettoyage industriel et entretien d'espaces"
            loading="lazy"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_42%]"
          />
        )}

        {/* Masque dégradé pour garantir la lisibilité du texte (Contraste A11y) */}
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#064d38] via-[#064d38]/95 to-[#064d38]/20" />

        {/* Décoration masquée aux lecteurs d'écran */}
        <LeafDecoration
          aria-hidden="true"
          className="absolute right-[36%] top-5 h-24 w-24 rotate-[-30deg] opacity-40 pointer-events-none"
          color="#58b77d"
        />

        <div className="relative z-10 w-full max-w-135">
          <Reveal direction="up" delay={100}>
            {/* CORRECTION A11Y : Police passée à 12px (min légal) au lieu de 9px. tracking-widest remplace les valeurs arbitraires. */}
            <p className="text-[12px] font-bold tracking-widest text-[#c9e7d5] uppercase mb-3">
              PRÊT À NOUS FAIRE CONFIANCE ?
            </p>
            <h2
              id="quote_banner_title"
              className="text-[1.75rem] lg:text-[2.25rem] font-extrabold leading-tight mb-4"
            >
              Votre espace mérite le meilleur
            </h2>
            {/* CORRECTION A11Y : Police passée à 14px/15px au lieu de 10px. Zéro tiret dans "Contactez nous". */}
            <p className="max-w-115 text-[14px] lg:text-[15px] font-medium leading-relaxed text-white/90 mb-8">
              Contactez nous dès aujourd'hui pour un devis gratuit et découvrez
              comment CleanPro peut transformer vos espaces.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              {/* DIRECTIVE RESPECTÉE : Bouton rectangulaire (rounded-md), adieu les pilules. */}
              {/* BOUTON D'ACTION VIDÉO */}
              <button
                type="button"
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                aria-label={
                  isVideoPlaying
                    ? "Arrêter la vidéo"
                    : "Voir notre vidéo de présentation"
                }
                className="group flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#064d38] transition-opacity hover:opacity-90"
              >
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-[#00964f]"
                >
                  {isVideoPlaying ? (
                    <Square className="h-4 w-4 fill-current stroke-2" />
                  ) : (
                    <Play className="h-4 w-4 fill-current stroke-2" />
                  )}
                </span>
                <span className="flex flex-col items-start text-left">
                  {/* CORRECTION A11Y : Textes lisibles (14px et 12px) */}
                  <span className="block text-[14px] font-bold">
                    {isVideoPlaying ? "Vidéo en cours" : "Voir notre vidéo"}
                  </span>
                  <span className="mt-0.5 block text-[12px] font-medium text-white/75">
                    Découvrez notre équipe
                  </span>
                </span>
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
