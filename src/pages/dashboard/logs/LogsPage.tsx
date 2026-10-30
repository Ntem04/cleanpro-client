import { CheckCircle2 } from "lucide-react";
import Reveal from "../../../components/ui/Reveal";
import { useLogs } from "./hooks/useLogs";
import LogsHeaderBanner from "./components/LogsHeaderBanner";
import LogsSummaryStats from "./components/LogsSummaryStats";
import LogsTable from "./components/LogsTable";
import LogDetailModal from "./components/LogDetailModal";
import SecurityGuaranteesCard from "./components/SecurityGuaranteesCard";

export default function LogsPage() {
  const {
    logs,
    stats,
    securityAlert,
    typeFilter,
    setTypeFilter,
    levelFilter,
    setLogLevelFilter,
    resultFilter,
    setResultFilter,
    searchQuery,
    setSearchQuery,
    selectedLog,
    setSelectedLog,
    toastMessage,
    exportCsv,
    exportJson,
    simulateLogEvent,
  } = useLogs();

  return (
    <div className="space-y-6 pb-12">
      {/* Toast de confirmation temporaire */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-white border border-emerald-200 p-4 text-sm text-[#135d3b] shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* En-tête principal, alertes super admin et actions d'export */}
      <Reveal direction="down" delay={40} immediate={true}>
        <LogsHeaderBanner
          securityAlert={securityAlert}
          onExportCsv={exportCsv}
          onExportJson={exportJson}
          onSimulate={simulateLogEvent}
        />
      </Reveal>

      {/* 4 Cartes statistiques épurées */}
      <Reveal direction="up" delay={80} immediate={true}>
        <LogsSummaryStats
          stats={stats}
          activeType={typeFilter}
          onSelectType={(type) => setTypeFilter(type)}
        />
      </Reveal>

      {/* Tableau complet des journaux (Audit & Technique) */}
      <Reveal direction="up" delay={120} immediate={true}>
        <LogsTable
          logs={logs}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          levelFilter={levelFilter}
          onLevelFilterChange={setLogLevelFilter}
          resultFilter={resultFilter}
          onResultFilterChange={setResultFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectLog={setSelectedLog}
        />
      </Reveal>

      {/* Charte de sécurité, non-divulgation et politique de purge */}
      <Reveal direction="up" delay={160} immediate={true}>
        <SecurityGuaranteesCard />
      </Reveal>

      {/* Modale d'inspection approfondie d'un log */}
      <LogDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}

