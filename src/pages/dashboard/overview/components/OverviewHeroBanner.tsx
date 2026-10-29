import { Link } from "react-router-dom";
import { ArrowRight, Globe } from "lucide-react";
import HeroCleanerImg from "../../../../assets/hero.webp";
import { useAdminProfile } from "../../context/useAdminProfile";
import AdminAvatar from "../../components/AdminAvatar";

interface OverviewHeroBannerProps {
  readonly onOpenReport?: () => void;
}

export default function OverviewHeroBanner({ onOpenReport }: OverviewHeroBannerProps) {
  const { profile } = useAdminProfile();

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-6 lg:p-8 shadow-xs">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        {/* Texte et appel à l'action */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-2.5 mb-2">
            <AdminAvatar size="xs" showOnlineIndicator={true} />
            <span className="inline-block text-sm font-semibold text-[#15364a]">
              Bonjour {profile.name || "Amina Diallo"} · Tableau de bord
            </span>
          </div>

          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#15364a] sm:text-3xl lg:text-[1.85rem] lg:leading-tight">
            CleanPro, la propreté au service de votre bien-être
          </h1>
          <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-slate-600">
            Suivez l'activité de vos équipes, la satisfaction de vos clients et la performance de vos services en temps réel.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenReport}
              className="inline-flex items-center gap-2 rounded-md bg-[#135d3b] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#0f4d30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#135d3b]"
            >
              <span>Voir le rapport complet</span>
              <ArrowRight size={16} aria-hidden={true} />
            </button>

            {/* Bouton pour parcourir le site vitrine CleanPro */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#15364a] shadow-2xs transition hover:bg-slate-50 hover:text-[#135d3b] hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#135d3b]"
            >
              <Globe size={16} className="text-[#135d3b]" aria-hidden="true" />
              <span>Parcourir le site vitrine</span>
            </Link>
          </div>
        </div>

        {/* Visuel professionnel */}
        <div className="relative flex justify-center lg:col-span-5 lg:justify-end">
          <div className="relative h-44 w-full sm:h-52 lg:h-56 overflow-hidden rounded-lg">
            <img
              src={HeroCleanerImg}
              alt="Professionnelle CleanPro en intervention d'hygiène et propreté"
              className="h-full w-full object-cover object-top"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
