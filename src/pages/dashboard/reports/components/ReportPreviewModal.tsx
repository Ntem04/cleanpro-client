import { X, Download, FileText, CheckCircle2 } from "lucide-react";
import type { ReportItem } from "../types";

interface ReportPreviewModalProps {
  readonly report: ReportItem | null;
  readonly onClose: () => void;
  readonly onDownload: (report: ReportItem) => void;
}

export default function ReportPreviewModal({
  report,
  onClose,
  onDownload,
}: ReportPreviewModalProps) {
  if (!report) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* En-tête de la modale */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-[#135d3b]">
              <FileText className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="preview-modal-title"
                className="text-base font-bold text-[#15364a]"
              >
                Aperçu du Rapport Officiel
              </h2>
              <p className="text-xs text-slate-500">
                Format {report.format} · {report.fileSize}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la prévisualisation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Corps de la prévisualisation (simulant le document officiel) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* En-tête du document */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#135d3b]">
                  {report.categoryLabel}
                </span>
                <h3 className="text-lg font-bold text-[#15364a] mt-1">
                  {report.title}
                </h3>
              </div>
              <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-1 text-xs font-bold text-[#135d3b]">
                {report.period}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-100">
              <div>
                <span className="text-slate-400 block">Auteur</span>
                <span className="font-semibold text-slate-700">{report.author}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Date d&apos;émission</span>
                <span className="font-semibold text-slate-700">{report.dateFormatted}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Statut</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Certifié conforme
                </span>
              </div>
            </div>
          </div>

          {/* Synthèse exécutive */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Synthèse &amp; Conclusions
            </h4>
            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {report.summary}
            </div>
          </div>

          {/* Métriques certifiées */}
          {report.metrics && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Métriques Clés Validées
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {report.metrics.interventionsCount !== undefined && (
                  <div className="rounded-lg bg-emerald-50/60 border border-emerald-100 p-3 text-center">
                    <span className="block text-xl font-bold text-[#135d3b]">
                      {report.metrics.interventionsCount}
                    </span>
                    <span className="text-[11px] text-slate-600">Interventions</span>
                  </div>
                )}
                {report.metrics.hoursWorked !== undefined && (
                  <div className="rounded-lg bg-sky-50/60 border border-sky-100 p-3 text-center">
                    <span className="block text-xl font-bold text-sky-800">
                      {report.metrics.hoursWorked}h
                    </span>
                    <span className="text-[11px] text-slate-600">Heures prestées</span>
                  </div>
                )}
                {report.metrics.qualityScore && (
                  <div className="rounded-lg bg-amber-50/60 border border-amber-100 p-3 text-center">
                    <span className="block text-xl font-bold text-amber-800">
                      {report.metrics.qualityScore}
                    </span>
                    <span className="text-[11px] text-slate-600">Score Audit</span>
                  </div>
                )}
                {report.metrics.ecoScore && (
                  <div className="rounded-lg bg-emerald-50/60 border border-emerald-100 p-3 text-center">
                    <span className="block text-xl font-bold text-[#135d3b]">
                      {report.metrics.ecoScore}
                    </span>
                    <span className="text-[11px] text-slate-600">Indice Éco</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sceau de certification */}
          <div className="rounded-xl bg-[#eef7f2] border border-emerald-200 p-3.5 flex items-center justify-between text-xs text-[#135d3b]">
            <span className="font-semibold">
              Document certifié authentique — Système de Management Qualité CleanPro
            </span>
            <span className="font-mono text-[11px]">Réf: CP-{report.id.slice(-6).toUpperCase()}</span>
          </div>
        </div>

        {/* Pied de la modale */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white hover:bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Fermer
          </button>

          <button
            type="button"
            onClick={() => {
              onDownload(report);
              onClose();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#135d3b] hover:bg-[#0f4a2f] text-white px-4 py-2 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Télécharger le {report.format} ({report.fileSize})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

