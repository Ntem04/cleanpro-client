import { FileCheck, Download, Plus, Calendar } from "lucide-react";

interface ReportsHeaderBannerProps {
  readonly selectedPeriod: string;
  readonly onPeriodChange: (period: string) => void;
  readonly onOpenGenerator: () => void;
  readonly onExportAll: () => void;
}

export default function ReportsHeaderBanner({
  selectedPeriod,
  onPeriodChange,
  onOpenGenerator,
  onExportAll,
}: ReportsHeaderBannerProps) {
  return (
    <div className="space-y-4">
      {/* Ligne En-tête : Titre & Actions principales */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#15364a]">
            Rapports &amp; Bilans d&apos;Activité
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Contrôles qualité, synthèses d&apos;interventions et audits éco-responsables de l&apos;agence CleanPro.
          </p>
        </div>

        {/* Contrôles d'action rapide */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sélecteur de période */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Calendar className="h-4 w-4" aria-hidden="true" />
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => onPeriodChange(e.target.value)}
              aria-label="Sélectionner la période des rapports"
              className="rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b] transition-colors cursor-pointer"
            >
              <option value="septembre-2025">Septembre 2025</option>
              <option value="aout-2025">Août 2025</option>
              <option value="t3-2025">3ᵉ Trimestre 2025</option>
              <option value="annee-2025">Bilan Annuel 2025</option>
            </select>
          </div>

          {/* Bouton Exporter tout */}
          <button
            type="button"
            onClick={onExportAll}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <span>Exporter tout</span>
          </button>

          {/* Bouton Créer / Générer un rapport sur-mesure */}
          <button
            type="button"
            onClick={onOpenGenerator}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#135d3b] hover:bg-[#0f4a2f] text-white px-3.5 py-2 text-sm font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Générer un rapport</span>
          </button>
        </div>
      </div>

      {/* Bannière de certification et conformité mensuelle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-[#eef7f2] border border-emerald-100 px-4 py-3.5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100/80 text-[#135d3b]">
            <FileCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-sm font-semibold text-[#135d3b]">
              Bilan certifié CleanPro · 142 interventions clôturées · 98,5% de conformité qualité
            </span>
            <p className="text-xs text-slate-500">
              Tous les protocoles d&apos;hygiène et fiches de passage du mois sont validés par la responsable d&apos;agence.
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-[#135d3b] bg-emerald-100/70 border border-emerald-200/60 rounded-full px-3 py-1 self-start sm:self-auto">
          Septembre 2025 · Validé
        </span>
      </div>
    </div>
  );
}

