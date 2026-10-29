import { CheckCircle2, Clock, Award, Leaf, TrendingUp, ChevronRight } from "lucide-react";
import type { ReportKpiData } from "../types";

interface ReportsKpiGridProps {
  readonly kpis: ReportKpiData;
  readonly onOpenAuditDetail?: () => void;
}

export default function ReportsKpiGrid({
  kpis,
  onOpenAuditDetail,
}: ReportsKpiGridProps) {
  const cards = [
    {
      id: "interventions",
      label: "Interventions clôturées",
      value: kpis.totalInterventions.toString(),
      subtext: kpis.interventionsChange,
      sublabel: "vs mois précédent",
      icon: CheckCircle2,
      trendIcon: TrendingUp,
      accentColor: "text-emerald-700",
      bgBadge: "bg-emerald-50 text-[#135d3b]",
    },
    {
      id: "hours",
      label: "Volume horaire presté",
      value: `${kpis.hoursWorked}h`,
      subtext: kpis.punctualityRate,
      sublabel: "taux de ponctualité",
      icon: Clock,
      accentColor: "text-sky-700",
      bgBadge: "bg-sky-50 text-sky-800",
    },
    {
      id: "quality",
      label: "Score Qualité & Audits",
      value: kpis.qualityScore,
      subtext: "0 litige majeur",
      sublabel: "satisfaction client",
      icon: Award,
      accentColor: "text-amber-700",
      bgBadge: "bg-amber-50 text-amber-800",
      hasAuditAction: true,
    },
    {
      id: "eco",
      label: "Indice Éco-conso CleanPro",
      value: kpis.ecoIndex,
      subtext: kpis.ecoProductRatio,
      sublabel: "détergents verts",
      icon: Leaf,
      accentColor: "text-[#135d3b]",
      bgBadge: "bg-[#eef7f2] text-[#135d3b]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-slate-500">
                  {card.label}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bgBadge}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>

              <div className="mt-2.5">
                <span className="text-2xl font-bold tracking-tight text-[#15364a]">
                  {card.value}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <span className="font-semibold text-[#135d3b] bg-emerald-50 px-1.5 py-0.5 rounded">
                  {card.subtext}
                </span>
                <span>{card.sublabel}</span>
              </div>
            </div>

            {/* Bouton vers la fiche d'audit détaillée sur la carte Qualité */}
            {card.hasAuditAction && onOpenAuditDetail && (
              <div className="mt-3.5 pt-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onOpenAuditDetail}
                  className="w-full flex items-center justify-between text-xs font-semibold text-[#135d3b] hover:text-[#0f4a2f] group cursor-pointer"
                >
                  <span>Consulter la fiche d&apos;audit</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
