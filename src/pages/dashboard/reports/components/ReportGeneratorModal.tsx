import { useState } from "react";
import { X, Sparkles, FileText } from "lucide-react";
import type { ReportCategory } from "../types";

interface ReportGeneratorModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onGenerate: (reportData: {
    title: string;
    category: ReportCategory;
    categoryLabel: string;
    summary: string;
    format: "PDF" | "CSV" | "XLSX";
  }) => void;
}

export default function ReportGeneratorModal({
  isOpen,
  onClose,
  onGenerate,
}: ReportGeneratorModalProps) {
  const [category, setCategory] = useState<ReportCategory>("mensuel");
  const [title, setTitle] = useState("Bilan Spécifique d'Activité");
  const [format, setFormat] = useState<"PDF" | "CSV" | "XLSX">("PDF");
  const [summary, setSummary] = useState(
    "Synthèse analytique générée à la demande pour l'évaluation des prestations et la conformité des protocoles."
  );
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      onGenerate({
        title,
        category,
        categoryLabel: getCategoryLabel(category),
        summary,
        format,
      });
      onClose();
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="generator-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden">
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-[#135d3b]">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="generator-modal-title"
                className="text-base font-bold text-[#15364a]"
              >
                Générateur de Rapport Personnalisé
              </h2>
              <p className="text-xs text-slate-500">
                Générez un bilan sur-mesure d&apos;après les données du système
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="report-category"
              className="block text-xs font-semibold text-slate-600 mb-1"
            >
              Type de rapport
            </label>
            <select
              id="report-category"
              value={category}
              onChange={(e) => {
                const newCat = e.target.value as ReportCategory;
                setCategory(newCat);
                if (newCat === "qualite") {
                  setTitle("Audit Qualité & Hygiène Sanitaire");
                } else if (newCat === "eco") {
                  setTitle("Bilan RSE & Consommation Écologique");
                } else if (newCat === "financier") {
                  setTitle("Synthèse des Heures & Prestations");
                } else {
                  setTitle("Bilan Spécifique d'Activité");
                }
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b] transition-colors"
            >
              <option value="mensuel">Synthèse Mensuelle Globale</option>
              <option value="qualite">Audit Qualité &amp; Hygiène</option>
              <option value="eco">Bilan Éco-responsable &amp; RSE</option>
              <option value="technique">Secteurs &amp; Prestations Techniques</option>
              <option value="financier">Synthèse des Heures &amp; Facturation</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="report-title"
              className="block text-xs font-semibold text-slate-600 mb-1"
            >
              Titre du document
            </label>
            <input
              id="report-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="report-format"
              className="block text-xs font-semibold text-slate-600 mb-1"
            >
              Format d&apos;exportation
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["PDF", "XLSX", "CSV"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`rounded-lg py-2 text-xs font-bold transition-colors cursor-pointer border ${
                    format === fmt
                      ? "border-[#135d3b] bg-emerald-50 text-[#135d3b] shadow-2xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="report-summary"
              className="block text-xs font-semibold text-slate-600 mb-1"
            >
              Description / Objectifs du rapport
            </label>
            <textarea
              id="report-summary"
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-700 focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b] transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isGenerating || !title.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#135d3b] hover:bg-[#0f4a2f] text-white px-4 py-2 text-xs font-semibold transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isGenerating ? "Génération en cours..." : "Générer le rapport"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getCategoryLabel(cat: ReportCategory): string {
  switch (cat) {
    case "mensuel":
      return "Synthèse Mensuelle";
    case "qualite":
      return "Audit Qualité";
    case "eco":
      return "RSE & Éco-conso";
    case "technique":
      return "Prestation Technique";
    case "financier":
      return "Heures & Devis";
    default:
      return "Général";
  }
}

