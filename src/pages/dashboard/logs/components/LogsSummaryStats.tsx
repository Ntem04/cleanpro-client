import { UserCheck, AlertOctagon, ShieldCheck, Activity } from "lucide-react";
import type { LogStats } from "../types";

interface LogsSummaryStatsProps {
  readonly stats: LogStats;
  readonly activeType: string;
  readonly onSelectType: (type: "all" | "audit" | "technical") => void;
}

export default function LogsSummaryStats({
  stats,
  activeType,
  onSelectType,
}: LogsSummaryStatsProps) {
  const cards = [
    {
      id: "audit",
      label: "Journal d'Audit",
      value: stats.totalAudit.toString(),
      subtext: stats.totalAudit === 0 ? "Aucune action" : `${stats.totalAudit} action${stats.totalAudit > 1 ? "s" : ""}`,
      sublabel: stats.totalAudit === 0 ? "Journal vierge" : "« Qui a fait quoi »",
      icon: UserCheck,
      color: "text-emerald-700",
      bgBadge: "bg-emerald-50 text-[#135d3b]",
      typeFilter: "audit" as const,
    },
    {
      id: "technical",
      label: "Journal Technique",
      value: stats.totalTechnical.toString(),
      subtext: stats.totalTechnical === 0 ? "Aucun incident" : `${stats.totalTechnical} incident${stats.totalTechnical > 1 ? "s" : ""}`,
      sublabel: stats.totalTechnical === 0 ? "Système stable" : "« Ce qui a planté »",
      icon: AlertOctagon,
      color: "text-rose-700",
      bgBadge: "bg-rose-50 text-rose-700",
      typeFilter: "technical" as const,
    },
    {
      id: "security",
      label: "Sécurité & Comptes",
      value: stats.blockedAccounts > 0 ? `${stats.blockedAccounts} bloqué` : "0",
      subtext: stats.blockedAccounts > 0 ? "Blocage automatique" : "Aucun incident",
      sublabel: stats.blockedAccounts > 0 ? "Alerte super admin active" : "Sécurité nominale",
      icon: ShieldCheck,
      color: "text-amber-700",
      bgBadge: "bg-amber-50 text-amber-800",
      typeFilter: "audit" as const,
    },
    {
      id: "uptime",
      label: "Disponibilité Système",
      value: stats.uptimeRate,
      subtext: stats.uptimeRate === "—" ? "En attente de connexion" : "Taux de bon fonctionnement",
      sublabel: stats.uptimeRate === "—" ? "Prêt" : "30 derniers jours",
      icon: Activity,
      color: "text-sky-700",
      bgBadge: "bg-sky-50 text-sky-800",
      typeFilter: "all" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected =
          (card.id === "audit" && activeType === "audit") ||
          (card.id === "technical" && activeType === "technical");

        return (
          <div
            key={card.id}
            onClick={() => onSelectType(card.typeFilter)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectType(card.typeFilter);
              }
            }}
            className={`rounded-xl border p-4 sm:p-5 shadow-xs transition-all cursor-pointer ${
              isSelected
                ? "border-[#135d3b] bg-emerald-50/30 ring-1 ring-[#135d3b]"
                : "border-slate-200/80 bg-white hover:border-slate-300"
            }`}
          >
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
              <span className="font-semibold text-slate-700">{card.subtext}</span>
              <span>•</span>
              <span className="italic">{card.sublabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
