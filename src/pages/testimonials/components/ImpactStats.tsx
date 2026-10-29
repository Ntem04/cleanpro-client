import { Building2, Clock3, UsersRound } from "lucide-react";
import LeafDecoration from "./LeafDecoration";
import Reveal from "../../../components/ui/Reveal";

// SÉCURITÉ : Typage strict
interface MetricItem {
  id: string;
  Icon: React.ElementType;
  value: string;
  label: string;
}

// SÉCURITÉ (CWE-502) : Immutabilité des données statiques.
// Le 4ème élément (LeafDecoration) a été intégré proprement dans la boucle.
const metrics: readonly MetricItem[] = Object.freeze([
  {
    id: "clients",
    Icon: UsersRound,
    value: "+ 250",
    label: "Clients satisfaits",
  },
  { id: "espaces", Icon: Building2, value: "+ 120", label: "Espaces nettoyés" },
  {
    id: "satisfaction",
    Icon: Clock3,
    value: "98%",
    label: "Taux de satisfaction",
  },
  {
    id: "experience",
    Icon: LeafDecoration,
    value: "5 ans",
    label: "D'expérience",
  },
]);

export default function ImpactStats() {
  return (
    <section
      // DIRECTIVE : Zéro tiret dans la liaison ARIA
      aria-labelledby="impact_title"
      className="mx-auto mb-8 w-full max-w-[1720px] px-6 sm:px-8 lg:px-10 xl:px-12 font-sans"
    >
      <div className="w-full rounded-2xl bg-[#f1f8f4] px-6 py-12 sm:px-8 lg:px-10 lg:py-14 xl:px-12">
        {/* ALIGNEMENT HORIZONTAL : Flexbox stricte (1/3 Gauche - 2/3 Droite) */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        {/* Colonne Gauche : Titre et Description */}
        <div className="w-full lg:w-1/3 shrink-0">
          <Reveal direction="right" delay={100}>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#00964f]">
              NOTRE IMPACT
            </p>
            <h2
              id="impact_title" // Zéro tiret
              className="text-[1.75rem] font-extrabold tracking-tight text-[#15364a] lg:text-[2rem] leading-tight mb-4"
            >
              Une confiance qui se voit
            </h2>
            {/* CORRECTION A11Y : text-[10px] -> text-[14px] pour lisibilité */}
            <p className="max-w-sm text-[14px] font-medium leading-relaxed text-slate-600">
              Chaque jour, nous accompagnons des entreprises, commerces et
              institutions dans l'entretien de leurs espaces.
            </p>
          </Reveal>
        </div>

        {/* Colonne Droite : Grille des 4 statistiques */}
        <div className="w-full lg:w-2/3">
          {/* 
            CORRECTION ARCHITECTURALE : 
            Reveal englobe la Grille ENTIÈRE. Ainsi le `divide-x` natif 
            de Tailwind s'applique correctement à chaque enfant.
          */}
          <Reveal direction="up" delay={200}>
            <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-slate-300/70">
              {metrics.map(({ id, Icon, value, label }) => (
                <div
                  key={id}
                  className="flex flex-col items-center px-4 text-center first:lg:pl-0 last:lg:pr-0"
                >
                  <Icon
                    className="mb-4 h-8 w-8 text-[#00964f]"
                    strokeWidth={2}
                    color="#00964f"
                    aria-hidden="true"
                  />
                  <span className="text-[1.5rem] lg:text-[1.75rem] font-extrabold leading-none text-[#15364a] mb-2">
                    {value}
                  </span>
                  {/* CORRECTION A11Y : text-[9px] -> text-[13px] pour lisibilité */}
                  <span className="text-[13px] font-medium text-slate-500">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
    </section>
  );
}
