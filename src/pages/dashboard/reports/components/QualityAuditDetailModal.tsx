import { useState } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Leaf,
  Building2,
  UserCheck,
  Check,
} from "lucide-react";
import BureauxImg from "../../../../image/services-bureaux0.webp";
import ResidencesImg from "../../../../image/services-residences.webp";

interface QualityAuditDetailModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onDownloadPdf: () => void;
}

interface AuditRecord {
  readonly id: string;
  readonly siteName: string;
  readonly clientName: string;
  readonly dateFormatted: string;
  readonly inspector: string;
  readonly overallScore: number;
  readonly complianceRate: string;
  readonly technicalScore: number;
  readonly punctualityScore: number;
  readonly clientScore: number;
  readonly ecoScore: number;
  readonly clientFeedback: string;
  readonly beforeAfterLabel: string;
  readonly beforeImg: string;
  readonly afterImg: string;
}

const AUDIT_RECORDS: readonly AuditRecord[] = [
  {
    id: "AUD-2025-09-142",
    siteName: "Siège Social — Immeuble Le Quartz",
    clientName: "Groupe Alpha",
    dateFormatted: "16 septembre 2025 · 07h00-11h30",
    inspector: "Amina Diallo (Responsable d'agence)",
    overallScore: 4.9,
    complianceRate: "98%",
    technicalScore: 4.9,
    punctualityScore: 5.0,
    clientScore: 4.8,
    ecoScore: 5.0,
    clientFeedback:
      "Locaux impeccables et assainis avant l'arrivée de nos collaborateurs. Très bon respect des espaces sensibles.",
    beforeAfterLabel: "Open Space & Bureaux de direction",
    beforeImg: BureauxImg,
    afterImg: BureauxImg,
  },
  {
    id: "AUD-2025-09-138",
    siteName: "Copropriété Les Jardins de la Paix",
    clientName: "Syndic Résidence Les Pins",
    dateFormatted: "15 septembre 2025 · 08h30-12h00",
    inspector: "Superviseur Qualité CleanPro",
    overallScore: 4.95,
    complianceRate: "99%",
    technicalScore: 5.0,
    punctualityScore: 5.0,
    clientScore: 4.9,
    ecoScore: 4.9,
    clientFeedback:
      "Halls d'entrée et cages d'escalier brillants. Parfum frais et discret très apprécié des résidents.",
    beforeAfterLabel: "Halls d'accueil & Espaces de circulation",
    beforeImg: ResidencesImg,
    afterImg: ResidencesImg,
  },
];

export default function QualityAuditDetailModal({
  isOpen,
  onClose,
  onDownloadPdf,
}: QualityAuditDetailModalProps) {
  const [selectedAuditId, setSelectedAuditId] = useState<string>(
    AUDIT_RECORDS[0].id
  );

  if (!isOpen) return null;

  const currentAudit =
    AUDIT_RECORDS.find((a) => a.id === selectedAuditId) || AUDIT_RECORDS[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[92vh]">
        {/* En-tête de la modale */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#135d3b]">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="audit-detail-title"
                  className="text-base font-bold text-[#15364a]"
                >
                  Fiche d&apos;Audit Qualité &amp; Contrôle Terrain
                </h2>
                <span className="rounded-md bg-emerald-100/80 text-[#135d3b] px-2 py-0.5 text-xs font-mono font-bold">
                  {currentAudit.id}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Évaluation inopinée détaillée basée sur les 4 piliers de conformité CleanPro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Sélecteur d'intervention auditée */}
            <select
              value={selectedAuditId}
              onChange={(e) => setSelectedAuditId(e.target.value)}
              aria-label="Sélectionner l'intervention auditée"
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:border-[#135d3b] focus:outline-none"
            >
              {AUDIT_RECORDS.map((rec) => (
                <option key={rec.id} value={rec.id}>
                  {rec.clientName} ({rec.id})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer la fiche d'audit"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Corps déroulant de la fiche d'audit */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Métadonnées de l'intervention et Score Général */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Carte Info Site */}
            <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#135d3b]">
                <Building2 className="h-4 w-4" />
                <span>Site audité</span>
              </div>
              <h3 className="text-base font-bold text-[#15364a]">
                {currentAudit.clientName} — {currentAudit.siteName}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                <div>
                  <span className="text-slate-400 block">Date &amp; Horaire :</span>
                  <span className="font-medium text-slate-700">
                    {currentAudit.dateFormatted}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Inspecté par :</span>
                  <span className="font-medium text-slate-700 flex items-center gap-1">
                    <UserCheck className="h-3 w-3 text-[#135d3b]" />
                    {currentAudit.inspector}
                  </span>
                </div>
              </div>
            </div>

            {/* Carte Note Globale Pondérée */}
            <div className="rounded-xl border border-emerald-200 bg-[#eef7f2] p-4 flex flex-col justify-between items-center text-center">
              <span className="text-xs font-bold text-[#135d3b] uppercase tracking-wider">
                Score Pondéré
              </span>
              <div className="my-1">
                <span className="text-3xl font-extrabold text-[#15364a] tracking-tight">
                  {currentAudit.overallScore}
                </span>
                <span className="text-sm font-semibold text-slate-500"> / 5</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200/80 px-2.5 py-0.5 text-xs font-bold text-[#135d3b]">
                <Check className="h-3 w-3" /> {currentAudit.complianceRate} de conformité
              </span>
            </div>
          </div>

          {/* Les 4 piliers d'évaluation détaillés avec barres de score */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Détail des 4 Piliers d&apos;Évaluation
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pilier 1 : Conformité technique */}
              <div className="rounded-xl border border-slate-200 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#15364a]">
                    <Sparkles className="h-4 w-4 text-[#135d3b]" />
                    <span>1. Conformité Bionettoyage (40%)</span>
                  </div>
                  <span className="font-bold text-[#135d3b] font-mono">
                    {currentAudit.technicalScore} / 5
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Désinfection des points de contact (Norme EN 14476)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Sols aspirés et lavés au balayage humide</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Vitres &amp; cloisons vitrées sans traces résiduelles</span>
                  </li>
                </ul>
              </div>

              {/* Pilier 2 : Ponctualité & Cahier des charges */}
              <div className="rounded-xl border border-slate-200 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#15364a]">
                    <Clock className="h-4 w-4 text-sky-700" />
                    <span>2. Engagements &amp; Horaires (25%)</span>
                  </div>
                  <span className="font-bold text-sky-800 font-mono">
                    {currentAudit.punctualityScore} / 5
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Heure d&apos;arrivée et de départ respectée à la minute</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>100% des tâches du cahier des charges exécutées</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Fiche de passage signée sur place par le gardien</span>
                  </li>
                </ul>
              </div>

              {/* Pilier 3 : Satisfaction client */}
              <div className="rounded-xl border border-slate-200 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#15364a]">
                    <CheckCircle2 className="h-4 w-4 text-amber-700" />
                    <span>3. Retours &amp; Satisfaction (20%)</span>
                  </div>
                  <span className="font-bold text-amber-800 font-mono">
                    {currentAudit.clientScore} / 5
                  </span>
                </div>
                <p className="text-xs italic text-slate-600 bg-amber-50/50 border border-amber-100 p-2.5 rounded-lg">
                  « {currentAudit.clientFeedback} »
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Réclamations formulées :</span>
                  <span className="font-bold text-emerald-700">0 litige</span>
                </div>
              </div>

              {/* Pilier 4 : Sécurité & RSE */}
              <div className="rounded-xl border border-slate-200 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#15364a]">
                    <Leaf className="h-4 w-4 text-[#135d3b]" />
                    <span>4. Sécurité &amp; Éco-conso (15%)</span>
                  </div>
                  <span className="font-bold text-[#135d3b] font-mono">
                    {currentAudit.ecoScore} / 5
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Port des EPI complet (gants, surchaussures, blouse)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Produits Ecolabel Européen dilués au juste dosage</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Économie d&apos;eau et tri rigoureux des déchets</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contrôle visuel Avant / Après passage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contrôle Visuel de Preuve : {currentAudit.beforeAfterLabel}
              </h4>
              <span className="text-xs font-semibold text-emerald-700">
                Résultat certifié conforme
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Photo Avant */}
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <div className="relative aspect-video">
                  <img
                    src={currentAudit.beforeImg}
                    alt="Espace avant l'intervention"
                    className="h-full w-full object-cover filter brightness-90"
                  />
                  <span className="absolute top-2.5 left-2.5 rounded-md bg-slate-900/80 text-white px-2.5 py-1 text-xs font-bold backdrop-blur-xs">
                    Avant passage (07:00)
                  </span>
                </div>
                <div className="p-3 text-xs text-slate-600">
                  <span className="font-semibold block text-slate-700">État initial :</span>
                  Poussières sur surfaces de travail, corbeilles pleines, traces d&apos;usage.
                </div>
              </div>

              {/* Photo Après */}
              <div className="rounded-xl overflow-hidden border border-emerald-300 bg-emerald-50/20">
                <div className="relative aspect-video">
                  <img
                    src={currentAudit.afterImg}
                    alt="Espace assaini et nettoyé après intervention"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 rounded-md bg-[#135d3b] text-white px-2.5 py-1 text-xs font-bold shadow-md">
                    Après passage CleanPro (11:30) ✓
                  </span>
                </div>
                <div className="p-3 text-xs text-slate-600">
                  <span className="font-semibold block text-[#135d3b]">Résultat vérifié :</span>
                  Surfaces dépoussiérées et désinfectées, sols lustrés, atmosphère saine.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de la modale */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="text-xs text-slate-500">
            Fiche authentifiée numériquement sous protocole ISO / CleanPro Audit v2
          </div>

          <div className="flex items-center gap-2.5">
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
                onDownloadPdf();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#135d3b] hover:bg-[#0f4a2f] text-white px-4 py-2 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Télécharger la fiche d&apos;audit (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

