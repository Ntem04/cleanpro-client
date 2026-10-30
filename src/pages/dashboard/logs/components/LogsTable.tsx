import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Filter,
  ScrollText,
} from "lucide-react";
import type {
  LogItem,
  LogTypeFilter,
  LogLevelFilter,
  LogResultFilter,
  LogLevel,
} from "../types";

interface LogsTableProps {
  readonly logs: readonly LogItem[];
  readonly typeFilter: LogTypeFilter;
  readonly onTypeFilterChange: (type: LogTypeFilter) => void;
  readonly levelFilter: LogLevelFilter;
  readonly onLevelFilterChange: (level: LogLevelFilter) => void;
  readonly resultFilter: LogResultFilter;
  readonly onResultFilterChange: (res: LogResultFilter) => void;
  readonly searchQuery: string;
  readonly onSearchChange: (q: string) => void;
  readonly onSelectLog: (log: LogItem) => void;
}

export default function LogsTable({
  logs,
  typeFilter,
  onTypeFilterChange,
  levelFilter,
  onLevelFilterChange,
  resultFilter,
  onResultFilterChange,
  searchQuery,
  onSearchChange,
  onSelectLog,
}: LogsTableProps) {
  const typeTabs: { readonly key: LogTypeFilter; readonly label: string }[] = [
    { key: "all", label: "Tous les journaux" },
    { key: "audit", label: "Journal d'Audit (Qui a fait quoi)" },
    { key: "technical", label: "Journal Technique (Ce qui a planté)" },
  ];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
      {/* Barre de contrôle supérieure : Onglets et Recherche */}
      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Onglets Type de journal */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
            {typeTabs.map((tab) => {
              const isActive = typeFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onTypeFilterChange(tab.key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#135d3b] text-white shadow-2xs"
                      : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Champ de recherche rapide */}
          <div className="relative w-full lg:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher par action, IP, compte..."
              className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b] transition-colors"
            />
          </div>
        </div>

        {/* Ligne des filtres secondaires : Gravité & Résultat */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="h-3.5 w-3.5" />
            <span>Filtres :</span>
          </div>

          {/* Filtre Niveau de gravité */}
          <select
            value={levelFilter}
            onChange={(e) => onLevelFilterChange(e.target.value as LogLevelFilter)}
            aria-label="Filtrer par niveau de gravité"
            className="rounded-lg border border-slate-200 bg-slate-50/50 py-1 px-2.5 text-xs text-slate-700 hover:bg-slate-50 focus:border-[#135d3b] focus:outline-none cursor-pointer"
          >
            <option value="all">Tous niveaux</option>
            <option value="info">Info uniquement</option>
            <option value="warning">Avertissement</option>
            <option value="error">Erreur</option>
            <option value="critical">Critique / Sécurité</option>
          </select>

          {/* Filtre Résultat */}
          <select
            value={resultFilter}
            onChange={(e) => onResultFilterChange(e.target.value as LogResultFilter)}
            aria-label="Filtrer par résultat"
            className="rounded-lg border border-slate-200 bg-slate-50/50 py-1 px-2.5 text-xs text-slate-700 hover:bg-slate-50 focus:border-[#135d3b] focus:outline-none cursor-pointer"
          >
            <option value="all">Tous résultats</option>
            <option value="success">Succès uniquement</option>
            <option value="failure">Échecs uniquement</option>
          </select>

          <span className="text-slate-400 ml-auto">
            {logs.length} ligne{logs.length > 1 ? "s" : ""} affichée{logs.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Tableau épuré des logs */}
      <div className="overflow-x-auto [scrollbar-width:none]">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
            <tr>
              <th scope="col" className="py-3 px-4">Date &amp; Heure</th>
              <th scope="col" className="py-3 px-3">Niveau</th>
              <th scope="col" className="py-3 px-3">Type</th>
              <th scope="col" className="py-3 px-3">Utilisateur / IP</th>
              <th scope="col" className="py-3 px-4">Action &amp; Élément concerné</th>
              <th scope="col" className="py-3 px-3">Résultat</th>
              <th scope="col" className="py-3 px-4 text-right">Détails</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      <ScrollText className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="text-sm font-bold text-[#15364a]">
                      Aucun journal d&apos;activité consigné
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Les événements d&apos;audit (« qui a fait quoi ») et les incidents techniques (« ce qui a planté ») apparaîtront automatiquement dès la connexion avec le système.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                return (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Horodatage */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    {/* Badge Niveau */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {renderLevelBadge(log.level)}
                    </td>

                    {/* Badge Type */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          log.type === "audit"
                            ? "bg-emerald-50 text-[#135d3b] border border-emerald-200"
                            : "bg-purple-50 text-purple-700 border border-purple-200"
                        }`}
                      >
                        {log.type === "audit" ? "Audit" : "Technique"}
                      </span>
                    </td>

                    {/* Utilisateur & IP */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-700">
                        {log.user}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400">
                        {log.ipAddress}
                      </div>
                    </td>

                    {/* Action & Cible */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#15364a]">
                        {log.action}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md">
                        {log.target}
                      </div>
                    </td>

                    {/* Résultat */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {log.result === "success" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Succès
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-semibold text-[11px]">
                          <XCircle className="h-3.5 w-3.5" /> Échec
                        </span>
                      )}
                    </td>

                    {/* Bouton Action Détails */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectLog(log)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        <Eye className="h-3 w-3 text-slate-500" />
                        <span>Détails</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function renderLevelBadge(level: LogLevel) {
  switch (level) {
    case "info":
      return (
        <span className="inline-flex items-center gap-1 rounded bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px] font-semibold">
          Info
        </span>
      );
    case "warning":
      return (
        <span className="inline-flex items-center gap-1 rounded bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[11px] font-semibold">
          <AlertTriangle className="h-3 w-3" /> Warning
        </span>
      );
    case "error":
      return (
        <span className="inline-flex items-center gap-1 rounded bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 text-[11px] font-bold">
          <XCircle className="h-3 w-3" /> Erreur
        </span>
      );
    case "critical":
      return (
        <span className="inline-flex items-center gap-1 rounded bg-rose-100 text-rose-900 border border-rose-300 px-2 py-0.5 text-[11px] font-extrabold animate-pulse">
          Critique
        </span>
      );
  }
}

