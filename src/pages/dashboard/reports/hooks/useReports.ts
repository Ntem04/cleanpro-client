import { useState, useMemo, useCallback } from "react";
import type {
  ReportItem,
  ReportKpiData,
  ReportCategory,
  SectorDistribution,
} from "../types";

const INITIAL_REPORTS: readonly ReportItem[] = [
  {
    id: "rep-mensuel-09-2025",
    title: "Rapport Mensuel d'Activité — Septembre 2025",
    period: "Septembre 2025",
    category: "mensuel",
    categoryLabel: "Synthèse Mensuelle",
    author: "Amina Diallo (Responsable d'agence)",
    dateFormatted: "01/10/2025",
    fileSize: "2.4 Mo",
    format: "PDF",
    summary:
      "Bilan opérationnel complet des 142 interventions de nettoyage exécutées en septembre. Taux de ponctualité de 99,1% et conformité hygiène exemplaire.",
    metrics: {
      interventionsCount: 142,
      hoursWorked: 486,
      qualityScore: "4.9/5",
      ecoScore: "94%",
    },
  },
  {
    id: "rep-qualite-t3-2025",
    title: "Audit Qualité & Hygiène Sanitaire — Q3 2025",
    period: "Trimestre 3 (Juil-Sept 2025)",
    category: "qualite",
    categoryLabel: "Audit & Normes",
    author: "Service Qualité & Contrôle",
    dateFormatted: "28/09/2025",
    fileSize: "1.8 Mo",
    format: "PDF",
    summary:
      "Audit des protocoles de désinfection, fiches de passage des équipes sur site et conformité sanitaire des locaux tertiaires et médicaux.",
    metrics: {
      interventionsCount: 418,
      hoursWorked: 1430,
      qualityScore: "4.95/5",
    },
  },
  {
    id: "rep-eco-conso-2025",
    title: "Bilan Éco-responsabilité & Empreinte RSE",
    period: "Septembre 2025",
    category: "eco",
    categoryLabel: "RSE & Éco-conso",
    author: "Cellule Environnement CleanPro",
    dateFormatted: "25/09/2025",
    fileSize: "3.1 Mo",
    format: "PDF",
    summary:
      "Rapport d'impact environnemental CleanPro : 94% des détergents utilisés certifiés Ecolabel Européen et 1 200 litres d'eau économisés grâce au dosage précis.",
    metrics: {
      ecoScore: "94% certifié",
    },
  },
  {
    id: "rep-secteur-bureaux-2025",
    title: "Relevé des Prestations — Secteur Bureaux & Sièges",
    period: "Septembre 2025",
    category: "technique",
    categoryLabel: "Secteur Tertiaire",
    author: "Superviseur Technique",
    dateFormatted: "20/09/2025",
    fileSize: "1.5 Mo",
    format: "PDF",
    summary:
      "Rapport détaillé sur les interventions d'entretien de bureaux et sièges sociaux (dont Groupe Alpha, cabinets de conseil et banques partenaires).",
    metrics: {
      interventionsCount: 64,
      hoursWorked: 218,
      qualityScore: "4.88/5",
    },
  },
  {
    id: "rep-financier-recap-q3",
    title: "Synthèse des Heures & Volume de Prestations Q3",
    period: "Q3 2025",
    category: "financier",
    categoryLabel: "Synthèse Administrative",
    author: "Direction Administrative",
    dateFormatted: "15/09/2025",
    fileSize: "850 Ko",
    format: "XLSX",
    summary:
      "Récapitulatif des heures ouvrées, ventilation des contrats réguliers vs interventions événementielles ponctuelles et bilans horaires d'équipes.",
    metrics: {
      hoursWorked: 1430,
    },
  },
];

const INITIAL_KPIS: ReportKpiData = {
  totalInterventions: 142,
  interventionsChange: "+12,4%",
  hoursWorked: 486,
  punctualityRate: "99,1%",
  qualityScore: "4,9/5",
  complaintsCount: 0,
  ecoIndex: "94%",
  ecoProductRatio: "Certifié Ecolabel",
};

const SECTOR_DISTRIBUTION: readonly SectorDistribution[] = [
  {
    sector: "Bureaux & Tertiaire",
    percentage: 45,
    count: 64,
    color: "#135d3b",
  },
  {
    sector: "Résidences & Copropriétés",
    percentage: 30,
    count: 43,
    color: "#1b794d",
  },
  {
    sector: "Espaces Publics & Commerces",
    percentage: 15,
    count: 21,
    color: "#2a9d68",
  },
  {
    sector: "Événements & Chantiers",
    percentage: 10,
    count: 14,
    color: "#52b788",
  },
];

export function useReports() {
  const [reports, setReports] = useState<ReportItem[]>([...INITIAL_REPORTS]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("septembre-2025");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [previewReport, setPreviewReport] = useState<ReportItem | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(
    null
  );

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Filtre catégorie
      if (selectedCategory !== "all" && report.category !== selectedCategory) {
        return false;
      }

      // Filtre recherche textuelle
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = report.title.toLowerCase().includes(q);
        const matchSummary = report.summary.toLowerCase().includes(q);
        const matchAuthor = report.author.toLowerCase().includes(q);
        const matchCat = report.categoryLabel.toLowerCase().includes(q);
        return matchTitle || matchSummary || matchAuthor || matchCat;
      }

      return true;
    });
  }, [reports, selectedCategory, searchQuery]);

  const handleDownload = useCallback((report: ReportItem) => {
    setDownloadSuccessToast(
      `Le fichier « ${report.title} » (${report.format} · ${report.fileSize}) a été téléchargé avec succès.`
    );
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 4000);
  }, []);

  const handleCreateReport = useCallback(
    (newReportData: {
      title: string;
      category: ReportCategory;
      categoryLabel: string;
      summary: string;
      format: "PDF" | "CSV" | "XLSX";
    }) => {
      const newReport: ReportItem = {
        id: `rep-${Date.now()}`,
        title: newReportData.title,
        period: "Septembre 2025",
        category: newReportData.category,
        categoryLabel: newReportDataDataLabel(newReportData.category),
        author: "Amina Diallo (Responsable d'agence)",
        dateFormatted: new Date().toLocaleDateString("fr-FR"),
        fileSize: "1.2 Mo",
        format: newReportData.format,
        summary: newReportData.summary,
        metrics: {
          interventionsCount: 142,
          qualityScore: "4.9/5",
        },
      };

      setReports((prev) => [newReport, ...prev]);
      setDownloadSuccessToast(`Nouveau rapport « ${newReport.title} » généré avec succès !`);
      setTimeout(() => {
        setDownloadSuccessToast(null);
      }, 4000);
    },
    []
  );

  return {
    reports: filteredReports,
    kpis: INITIAL_KPIS,
    sectorDistribution: SECTOR_DISTRIBUTION,
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
  };
}

function newReportDataDataLabel(category: ReportCategory): string {
  switch (category) {
    case "mensuel":
      return "Synthèse Mensuelle";
    case "qualite":
      return "Audit Qualité";
    case "eco":
      return "RSE & Éco-conso";
    case "financier":
      return "Synthèse Administrative";
    case "technique":
      return "Secteur Spécifique";
    default:
      return "Général";
  }
}

