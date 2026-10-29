import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Reveal from "../../../components/ui/Reveal";
import { useReports } from "./hooks/useReports";
import ReportsHeaderBanner from "./components/ReportsHeaderBanner";
import ReportsKpiGrid from "./components/ReportsKpiGrid";
import ReportsRecentList from "./components/ReportsRecentList";
import ReportsSectorPerformanceCard from "./components/ReportsSectorPerformanceCard";
import ReportPreviewModal from "./components/ReportPreviewModal";
import ReportGeneratorModal from "./components/ReportGeneratorModal";
import QualityAuditDetailModal from "./components/QualityAuditDetailModal";

export default function ReportsPage() {
  const {
    reports,
    kpis,
    sectorDistribution,
    selectedPeriod,
    setSelectedPeriod,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    previewReport,
    setPreviewReport,
    downloadSuccessToast,
    handleDownload,
    handleCreateReport,
  } = useReports();

  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const handleExportAll = () => {
    // Simule le téléchargement de l'archive complète des rapports
    handleDownload({
      id: "archive-complete",
      title: "Archive_Complete_Rapports_CleanPro_Septembre_2025.zip",
      period: selectedPeriod,
      category: "mensuel",
      categoryLabel: "Archive Globale",
      author: "Direction CleanPro",
      dateFormatted: new Date().toLocaleDateString("fr-FR"),
      fileSize: "9.8 Mo",
      format: "PDF",
      summary: "Archive complète contenant tous les rapports et audits certifiés.",
      metrics: {},
    });
  };

  const handleDownloadAuditPdf = () => {
    handleDownload({
      id: "audit-terrain-142",
      title: "Fiche_Audit_Qualite_Terrain_AUD-2025-09-142.pdf",
      period: "Septembre 2025",
      category: "qualite",
      categoryLabel: "Audit Terrain",
      author: "Amina Diallo (Responsable d'agence)",
      dateFormatted: new Date().toLocaleDateString("fr-FR"),
      fileSize: "1.4 Mo",
      format: "PDF",
      summary: "Fiche détaillée d'évaluation inopinée sur site avec contrôle photographique avant/après.",
      metrics: {
        qualityScore: "4.9/5",
      },
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast de confirmation de téléchargement / génération */}
      {downloadSuccessToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-white border border-emerald-200 p-4 text-sm text-[#135d3b] shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{downloadSuccessToast}</span>
        </div>
      )}

      {/* En-tête principal & Bannière de certification */}
      <Reveal direction="down" delay={40} immediate={true}>
        <ReportsHeaderBanner
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          onOpenGenerator={() => setIsGeneratorOpen(true)}
          onExportAll={handleExportAll}
        />
      </Reveal>

      {/* 4 Cartes KPI opérationnels & qualité avec lien direct vers la fiche d'audit */}
      <Reveal direction="up" delay={80} immediate={true}>
        <ReportsKpiGrid
          kpis={kpis}
          onOpenAuditDetail={() => setIsAuditModalOpen(true)}
        />
      </Reveal>

      {/* Grille principale : Liste des rapports (gauche) & Répartition / Normes (droite) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Colonne Gauche : Liste des documents certifiés & filtres */}
        <div className="lg:col-span-8">
          <Reveal direction="right" delay={100} immediate={true}>
            <ReportsRecentList
              reports={reports}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onPreview={setPreviewReport}
              onDownload={handleDownload}
            />
          </Reveal>
        </div>

        {/* Colonne Droite : Répartition par secteur et Checklist de conformité RSE */}
        <div className="lg:col-span-4">
          <Reveal direction="left" delay={120} immediate={true}>
            <ReportsSectorPerformanceCard
              sectors={sectorDistribution}
              onOpenAuditDetail={() => setIsAuditModalOpen(true)}
            />
          </Reveal>
        </div>
      </div>

      {/* Modale d'aperçu d'un document officiel */}
      <ReportPreviewModal
        report={previewReport}
        onClose={() => setPreviewReport(null)}
        onDownload={handleDownload}
      />

      {/* Modale de génération de rapport sur-mesure */}
      <ReportGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onGenerate={handleCreateReport}
      />

      {/* Modale d'inspection et fiche d'audit qualité détaillée (4 piliers & photos avant/après) */}
      <QualityAuditDetailModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onDownloadPdf={handleDownloadAuditPdf}
      />
    </div>
  );
}
