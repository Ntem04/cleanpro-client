import { useEffect, useRef } from "react";
import {
  X,
  Users,
  CheckCircle2,
  Clock,
  Home,
  Sparkles,
  Building2,
  MessageSquareQuote,
  Send,
  Scale,
  FileCheck2,
  Globe,
} from "lucide-react";
import type { PageTelemetryItem } from "../../../../services/telemetryApi";

interface LegitimateVisitorsDialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly pages: readonly PageTelemetryItem[];
  readonly totalVisitors: number;
}

function getPageIcon(path: string) {
  switch (path) {
    case "/":
      return Home;
    case "/services":
      return Sparkles;
    case "/a-propos":
      return Building2;
    case "/temoignages":
      return MessageSquareQuote;
    case "/contact":
      return Send;
    case "/mentionslegales":
      return Scale;
    case "/confidentialite":
      return FileCheck2;
    default:
      return Globe;
  }
}

export default function LegitimateVisitorsDialog({
  isOpen,
  onClose,
  pages,
  totalVisitors,
}: LegitimateVisitorsDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Fermeture par la touche Échap
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Blocage du scroll d'arrière-plan quand la boîte de dialogue est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-visitors-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Arrière-plan flouté avec fermeture au clic */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Conteneur principal de la boîte de dialogue */}
      <div
        ref={dialogRef}
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-200 overflow-hidden"
      >
        {/* En-tête de la boîte de dialogue */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#f8faf9] px-6 py-4.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#135d3b] text-white shadow-xs">
              <Users size={20} aria-hidden="true" />
            </div>
            <div>
              <h2
                id="dialog-visitors-title"
                className="text-base sm:text-lg font-bold text-[#15364a]"
              >
                Fréquentation Détaillée par Page
              </h2>
              <p className="text-xs text-slate-500">
                Nombre de visites uniques comptabilisées par page du site
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la boîte de dialogue"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Synthèse globale en bandeau */}
        <div className="border-b border-slate-100 bg-white px-6 py-3.5 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#15364a]">
              Total Visiteurs Uniques :
            </span>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-800 border border-emerald-200/60">
              {totalVisitors} {totalVisitors > 1 ? "personnes" : "personne"}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Règle : 1 seule visite comptée par visiteur et par page
          </span>
        </div>

        {/* Corps déroulant : Liste de chaque page avec son nombre de visites */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          {pages.map((p: PageTelemetryItem) => {
            const Icon = getPageIcon(p.path);
            const percentage =
              totalVisitors > 0
                ? Math.round((p.uniqueVisitors / totalVisitors) * 100)
                : 0;

            return (
              <div
                key={p.path}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:border-slate-300 transition"
              >
                {/* Informations de la page */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#135d3b] border border-emerald-100">
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-[#15364a] text-sm truncate">
                        {p.title}
                      </h3>
                      <span className="font-mono text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {p.path}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 size={11} aria-hidden="true" />
                        200 OK
                      </span>
                      {p.lastVisitAt && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock size={11} aria-hidden="true" />
                            Dernière visite : {p.lastVisitAt}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Métrique & Nombre de Visites Uniques */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-100 shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="flex items-baseline sm:justify-end gap-1.5">
                      <span className="text-xl sm:text-2xl font-black text-[#15364a] tabular-nums">
                        {p.uniqueVisitors}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {p.uniqueVisitors > 1 ? "visites" : "visite"}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      {/* Petite barre de progression discrète */}
                      <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-[#135d3b] rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(percentage, p.uniqueVisitors > 0 ? 8 : 0)}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 tabular-nums">
                        {percentage}% des visiteurs
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pied de la boîte de dialogue */}
        <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-3.5 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Données PostgreSQL temps réel · CleanPro Shield
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#15364a] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#15364a]/90 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
