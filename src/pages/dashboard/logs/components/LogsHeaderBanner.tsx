import {
  ShieldAlert,
  Lock,
  Download,
  Clock,
  PlusCircle,
  FileSpreadsheet,
  AlertTriangle,
} from "lucide-react";
import type { LogItem } from "../types";

interface LogsHeaderBannerProps {
  readonly securityAlert?: LogItem;
  readonly onExportCsv: () => void;
  readonly onExportJson: () => void;
  readonly onSimulate: () => void;
}

export default function LogsHeaderBanner({
  securityAlert,
  onExportCsv,
  onExportJson,
  onSimulate,
}: LogsHeaderBannerProps) {
  return (
    <div className="space-y-4">
      {/* En-tête : Titre, sous-titre & Boutons d'export */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#15364a]">
              Logs &amp; Journaux d&apos;Activité
            </h1>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
              <Lock className="h-3 w-3 text-slate-500" aria-hidden="true" />
              Lecture seule · Super Admin
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Journal d&apos;audit (qui a fait quoi) et journal technique (erreurs et incidents système).
          </p>
        </div>

        {/* Actions d'export et simulation */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Bouton Export CSV */}
          <button
            type="button"
            onClick={onExportCsv}
            title="Exporter l'ensemble des logs au format CSV"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-[#135d3b]" aria-hidden="true" />
            <span>Export CSV</span>
          </button>

          {/* Bouton Export JSON */}
          <button
            type="button"
            onClick={onExportJson}
            title="Exporter les logs au format JSON structuré"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
            <span>Export JSON</span>
          </button>

          {/* Bouton de simulation d'événement */}
          <button
            type="button"
            onClick={onSimulate}
            title="Simuler l'arrivée d'une nouvelle trace dans le journal"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#135d3b] hover:bg-[#0f4a2f] text-white px-3.5 py-2 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>+ Simuler log</span>
          </button>
        </div>
      </div>

      {/* Alerte Sécurité Super Admin (si tentative d'intrusion ou compte bloqué) */}
      {securityAlert && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-rose-50/80 border border-rose-200 px-4 py-3.5 text-rose-900 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-sm font-bold text-rose-900">
                Alerte Sécurité Super Admin : Tentatives d&apos;intrusion détectées
              </span>
              <p className="text-xs text-rose-700 mt-0.5">
                {securityAlert.action} (IP {securityAlert.ipAddress}). Notification d&apos;alerte envoyée par e-mail au super admin.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-rose-200/80 px-2.5 py-0.5 text-xs font-bold text-rose-800 self-start sm:self-auto">
            Action requise
          </span>
        </div>
      )}

      {/* Bannière de conformité et politique de rétention */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-[#eef7f2] border border-emerald-100 px-4 py-3 shadow-2xs">
        <div className="flex items-center gap-2.5 text-xs text-[#135d3b]">
          <Clock className="h-4 w-4 shrink-0 text-[#135d3b]" aria-hidden="true" />
          <span>
            <strong>Rétention automatique :</strong> conservation de 90 jours glissants avec purge automatisée sans intervention manuelle.
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-200/60 rounded-full px-3 py-0.5 self-start sm:self-auto">
          <AlertTriangle className="h-3 w-3 text-emerald-700" />
          <span>Mots de passe &amp; jetons masqués à 100%</span>
        </div>
      </div>
    </div>
  );
}

