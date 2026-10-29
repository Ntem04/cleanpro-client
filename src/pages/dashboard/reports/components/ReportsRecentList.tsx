import { FileText, Eye, Download, Search } from "lucide-react";
import type { ReportItem } from "../types";

interface ReportsRecentListProps {
  readonly reports: readonly ReportItem[];
  readonly selectedCategory: string;
  readonly onCategoryChange: (cat: string) => void;
  readonly searchQuery: string;
  readonly onSearchChange: (q: string) => void;
  readonly onPreview: (report: ReportItem) => void;
  readonly onDownload: (report: ReportItem) => void;
}

export default function ReportsRecentList({
  reports,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onPreview,
  onDownload,
}: ReportsRecentListProps) {
  const categories: { readonly key: string; readonly label: string }[] = [
    { key: "all", label: "Tous les rapports" },
    { key: "mensuel", label: "Synthèses Mensuelles" },
    { key: "qualite", label: "Audits Qualité" },
    { key: "eco", label: "RSE & Éco-conso" },
    { key: "technique", label: "Secteurs d'activité" },
    { key: "financier", label: "Heures & Devis" },
  ];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-5">
      {/* En-tête de la section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-[#15364a]">
            Documents &amp; Bilans Officiels
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {reports.length} document{reports.length > 1 ? "s" : ""} disponible{reports.length > 1 ? "s" : ""} au téléchargement
          </p>
        </div>

        {/* Barre de recherche rapide */}
        <div className="relative w-full sm:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un rapport..."
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b] transition-colors"
          />
        </div>
      </div>

      {/* Onglets de filtre horizontal */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => onCategoryChange(cat.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#135d3b] text-white shadow-2xs"
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Liste des fiches de rapports */}
      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
            <FileText className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm">Aucun rapport ne correspond à vos filtres</p>
          </div>
        ) : (
          reports.map((report) => (
            <article
              key={report.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-2xs"
            >
              {/* Informations du rapport */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${
                    report.format === "PDF"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-emerald-50 text-[#135d3b] border border-emerald-200"
                  }`}
                >
                  {report.format}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-sm text-[#15364a] truncate">
                      {report.title}
                    </h3>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {report.categoryLabel}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {report.summary}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    <span>Par {report.author}</span>
                    <span>•</span>
                    <span>Généré le {report.dateFormatted}</span>
                    <span>•</span>
                    <span className="font-mono font-medium text-slate-500">
                      {report.fileSize}
                    </span>
                  </div>
                </div>
              </div>

              {/* Boutons d'action sur le rapport */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => onPreview(report)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                  <span>Consulter</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDownload(report)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#135d3b] hover:bg-[#0f4a2f] text-white px-3 py-1.5 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Télécharger</span>
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

