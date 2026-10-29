import { useState, useEffect, useCallback } from "react";
import {
  Users,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Radio,
  Home,
  Sparkles,
  Building2,
  MessageSquareQuote,
  Send,
  Scale,
  FileCheck2,
  Globe,
  Monitor,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import LegitimateVisitorsDialog from "./LegitimateVisitorsDialog";
import {
  telemetryApi,
  type TelemetryStats,
  type PageTelemetryItem,
  type AttackTargetItem,
} from "../../../../services/telemetryApi";

// Mapping des icônes pour chaque page officielle CleanPro
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

export default function VisitorTrafficCard() {
  const [stats, setStats] = useState<TelemetryStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isVisitorsDialogOpen, setIsVisitorsDialogOpen] = useState<boolean>(false);

  const loadData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const data = await telemetryApi.getStats();
      setStats(data);
    } finally {
      setIsLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
    // Rafraîchissement automatique silencieux toutes les 20 secondes
    const interval = setInterval(() => {
      void loadData();
    }, 20000);
    return () => clearInterval(interval);
  }, [loadData]);

  const totalVisitors = stats?.totalVisitors ?? 0;
  const totalAttackers = stats?.totalAttackers ?? 0;
  const pages = stats?.pages || [];
  const attackTargets = stats?.attackTargets || [];

  return (
    <article
      aria-label="Fréquentation par page et détection des menaces"
      className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 lg:p-6 shadow-xs"
    >
      {/* ─── 1. En-tête épuré et barre d'état ──────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-bold text-[#15364a]">
              Fréquentation par Page & Détection des Attaquants
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
              <Radio
                size={11}
                className="animate-pulse text-emerald-600"
                aria-hidden="true"
              />
              Temps réel
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Comptabilisation stricte par visiteur unique : sortir et rentrer sur
            une même page n'incrémente pas le compteur.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadData(true)}
          disabled={isRefreshing}
          aria-label="Actualiser les métriques de trafic"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50"
        >
          <RefreshCw
            size={13}
            className={
              isRefreshing ? "animate-spin text-[#135d3b]" : "text-slate-500"
            }
            aria-hidden="true"
          />
          <span>{isRefreshing ? "Actualisation..." : "Actualiser"}</span>
        </button>
      </div>

      {/* ─── 2. Les 2 Grands Indicateurs Synthétiques (Horizontal) ───────────── */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Visiteurs Uniques - Boîte cliquable avec déclenchement du dialogue */}
        <button
          type="button"
          onClick={() => setIsVisitorsDialogOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isVisitorsDialogOpen}
          className="flex items-start gap-4 rounded-xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/70 to-white p-4 text-left transition-all duration-200 hover:border-[#135d3b] hover:shadow-md cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#135d3b]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#135d3b] text-white shadow-xs group-hover:scale-105 transition">
            <Users size={22} aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Visiteurs Légitimes Uniques
              </span>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#135d3b] group-hover:translate-x-0.5 transition">
                <span>Détail par page</span>
                <ChevronRight size={13} aria-hidden="true" />
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-[#15364a] tabular-nums">
                {isLoading ? "..." : totalVisitors}
              </span>
              <span className="text-xs text-slate-500">personnes distinctes</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Cliquez pour afficher la boîte de dialogue listant chaque page et son nombre de visites.
            </p>
          </div>
        </button>

        {/* Total Attaquants & Sondes Bloquées */}
        <div className="flex items-start gap-4 rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50/60 to-white p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
            <ShieldAlert size={22} aria-hidden="true" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
              Attaquants & Sondes Neutralisées
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-rose-600 tabular-nums">
                {isLoading ? "..." : totalAttackers}
              </span>
              <span className="text-xs text-slate-500">tentatives bloquées</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Scanners automatisés et sondes malveillantes rejetés avec HTTP 403
              Forbidden.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 3. Grille Horizontale des Cases par Page du Site ────────────────── */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Espaces Dédiés par Page — Visiteurs Uniques Distincts
          </h3>
          <span className="text-xs text-slate-500">
            {pages.length} pages surveillées
          </span>
        </div>

        {/* Grille horizontale déployée (1 col sur mobile, 2 cols sur tablette, 3-4 cols sur grand écran) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {pages.map((p: PageTelemetryItem) => {
            const Icon = getPageIcon(p.path);
            const hasVisits = p.uniqueVisitors > 0;

            return (
              <div
                key={p.path}
                className={`flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 ${
                  hasVisits
                    ? "border-emerald-200/80 bg-white hover:border-[#135d3b]/50 shadow-2xs"
                    : "border-slate-200/80 bg-slate-50/60"
                }`}
              >
                {/* En-tête de la case de page */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          hasVisits
                            ? "bg-emerald-50 text-[#135d3b]"
                            : "bg-slate-200/70 text-slate-500"
                        }`}
                      >
                        <Icon size={16} aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#15364a] leading-tight">
                          {p.title}
                        </h4>
                        <span className="font-mono text-[11px] text-slate-500">
                          {p.path}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        hasVisits
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      <CheckCircle2 size={10} aria-hidden="true" />
                      200 OK
                    </span>
                  </div>

                  {/* Compteur principal de visiteurs uniques */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-[#15364a] tabular-nums">
                        {p.uniqueVisitors}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        {p.uniqueVisitors > 1
                          ? "visiteurs uniques"
                          : "visiteur unique"}
                      </span>
                    </div>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {p.uniqueVisitors > 0
                        ? `${p.uniqueVisitors} personne(s) distincte(s) ont visité cette page`
                        : "Aucune consultation enregistrée"}
                    </p>
                  </div>
                </div>

                {/* Historique des derniers visiteurs sur cette page */}
                <div className="mt-3 pt-2.5 border-t border-slate-100/80">
                  {p.recentVisitors && p.recentVisitors.length > 0 ? (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Dernier accès :
                      </span>
                      {p.recentVisitors.slice(0, 2).map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <Monitor
                              size={11}
                              className="text-slate-400 shrink-0"
                              aria-hidden="true"
                            />
                            <span className="truncate">{v.userAgent}</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 shrink-0 ml-1">
                            {v.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] italic text-slate-400">
                      En attente de visiteurs
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 4. Espace Cibles Attaquées & Intrusions Neutralisées (WAF) ──────── */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800">
              Cibles Attaquées & Sondes Bloquées par le WAF
            </h3>
            <span className="inline-flex items-center rounded bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
              403 Forbidden
            </span>
          </div>
          <span className="text-xs text-slate-500">
            {attackTargets.length} cible(s) identifiée(s)
          </span>
        </div>

        {attackTargets.length === 0 ? (
          <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-3.5 text-xs text-emerald-800">
            <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
            <span>
              <strong>Système intègre :</strong> Aucune sonde ou tentative
              d'intrusion bloquée pour le moment. Le bouclier CleanPro filtre
              chaque requête en continu.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {attackTargets.map((target: AttackTargetItem) => (
              <div
                key={target.target}
                className="flex flex-col justify-between rounded-lg border border-rose-200 bg-rose-50/30 p-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded border border-rose-200">
                      {target.target}
                    </span>
                    <span className="text-xs font-black text-rose-700 tabular-nums">
                      {target.blockedCount} tentative(s)
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-600">
                    Outil utilisé : <strong>{target.tool}</strong>
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-rose-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Dernière IP : {target.lastAttackerIp}</span>
                  <span>{target.lastAttemptAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* ─── 5. Boîte de Dialogue : Détail des Visites par Page ─────────────── */}
      <LegitimateVisitorsDialog
        isOpen={isVisitorsDialogOpen}
        onClose={() => setIsVisitorsDialogOpen(false)}
        pages={pages}
        totalVisitors={totalVisitors}
      />
    </article>
  );
}
