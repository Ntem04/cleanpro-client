import { CheckCircle2, ShieldCheck, BarChart2 } from "lucide-react";
import type { SectorDistribution } from "../types";

interface ReportsSectorPerformanceCardProps {
  readonly sectors: readonly SectorDistribution[];
  readonly onOpenAuditDetail?: () => void;
}

export default function ReportsSectorPerformanceCard({
  sectors,
  onOpenAuditDetail,
}: ReportsSectorPerformanceCardProps) {
  const complianceChecklist = [
    {
      title: "Protocoles de désinfection validés",
      detail: "Conformité virucide et bactéricide (EN 14476 / NF T 72-281)",
    },
    {
      title: "Traçabilité des fiches de passage",
      detail: "100% des interventions émargées et signées sur site",
    },
    {
      title: "Produits certifiés Ecolabel Européen",
      detail: "94% des détergents respectueux de la santé et de la planète",
    },
    {
      title: "Audits inopinés de contrôle qualité",
      detail: "Score moyen de 4,9/5 sur 24 contrôles surprises effectués",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Carte 1 : Répartition des interventions par secteur */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-[#135d3b]" aria-hidden="true" />
            <h3 className="text-base font-bold text-[#15364a]">
              Volume par Secteur d&apos;Activité
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">142 total</span>
        </div>

        <div className="space-y-3.5">
          {sectors.map((sec) => (
            <div key={sec.sector} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{sec.sector}</span>
                <span className="text-slate-500 font-mono">
                  {sec.count} ({sec.percentage}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${sec.percentage}%`,
                    backgroundColor: sec.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carte 2 : Conformité & Normes Qualité CleanPro */}
      <div className="rounded-xl border border-slate-200/80 bg-[#eef7f2]/60 border-emerald-100 p-5 sm:p-6 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2 border-b border-emerald-200/60 pb-3">
          <ShieldCheck className="h-5 w-5 text-[#135d3b]" aria-hidden="true" />
          <h3 className="text-base font-bold text-[#15364a]">
            Certifications &amp; Conformité RSE
          </h3>
        </div>

        <div className="space-y-3 pt-1">
          {complianceChecklist.map((item) => (
            <div key={item.title} className="flex items-start gap-2.5">
              <CheckCircle2
                className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <p className="text-[13px] font-bold text-[#15364a]">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500">{item.detail}</p>
              </div>
            </div>
          ))}

          {onOpenAuditDetail && (
            <div className="pt-2 border-t border-emerald-200/60">
              <button
                type="button"
                onClick={onOpenAuditDetail}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#135d3b] hover:bg-[#0f4a2f] text-white px-3 py-2 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Ouvrir la fiche d&apos;audit détaillée</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

