import {
  Building2,
  Home,
  Factory,
  Calendar,
  ChevronRight,
  RefreshCw,
  Inbox,
} from "lucide-react";
import Reveal from "../../../../components/ui/Reveal";
import { Skeleton, SkeletonGroup } from "../../../../components/ui/Skeleton";
import { useUpcomingInterventions } from "../hooks/useUpcomingInterventions";
import type { UpcomingInterventionItem } from "../../../../services/dashboardServicesApi";

// ─── Sélecteur d'icône dynamique par catégorie de prestation ─────────────────

function getCategoryIcon(category?: string) {
  switch (category) {
    case "residence":
      return Home;
    case "industrie":
      return Factory;
    case "evenement":
      return Calendar;
    case "bureau":
    default:
      return Building2;
  }
}

// ─── Skeleton de chargement adapté à la liste latérale (Anti-CLS) ────────────

function UpcomingInterventionsSkeleton() {
  return (
    <SkeletonGroup className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <Skeleton className="h-4 w-40 mb-4" />
      <div className="divide-y divide-slate-100">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex items-start gap-3 flex-1">
              <Skeleton className="h-7 w-7 rounded-md shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-2.5 w-24" />
                <Skeleton className="h-2 w-28" />
              </div>
            </div>
            <Skeleton className="h-4 w-4 rounded-xs shrink-0" />
          </div>
        ))}
      </div>
    </SkeletonGroup>
  );
}

// ─── État d'erreur avec bouton de réessai (Fail-Closed) ───────────────────────

function UpcomingInterventionsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50/60 p-5 text-center">
      <p className="text-sm font-semibold text-red-700">
        Impossible de charger les prochaines interventions.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-semibold text-red-700 shadow-xs hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-500"
      >
        <RefreshCw size={13} aria-hidden={true} />
        <span>Réessayer</span>
      </button>
    </div>
  );
}

// ─── Composant principal connecté à l'API ────────────────────────────────────

export default function UpcomingInterventionsAside() {
  const { data, isLoading, isError, refetch } = useUpcomingInterventions();

  // 1. État de chargement — Skeleton
  if (isLoading) {
    return <UpcomingInterventionsSkeleton />;
  }

  // 2. État d'erreur — Fallback Retry
  if (isError || !data) {
    return <UpcomingInterventionsError onRetry={refetch} />;
  }

  const items = Array.isArray(data.data) ? (data.data as UpcomingInterventionItem[]) : [];

  return (
    <div className="space-y-6">
      <Reveal direction="up" delay={120}>
        <section
          aria-labelledby="upcoming-interventions-title"
          className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs"
        >
          <h2
            id="upcoming-interventions-title"
            className="text-sm font-bold text-[#15364a]"
          >
            Prochaines interventions
          </h2>

          {/* 3. État réinitialisé : en attente des futures données backend */}
          {items.length === 0 ? (
            <div className="mt-4 flex flex-col items-center justify-center py-8 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50 px-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 mb-2">
                <Inbox size={18} aria-hidden={true} />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Aucune intervention planifiée
              </p>
              <p className="mt-0.5 text-[13px] text-slate-400">
                Cet espace affichera automatiquement le calendrier dès la
                connexion backend.
              </p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100" role="list">
              {items.map((item) => {
                const Icon = getCategoryIcon(item.category);
                return (
                  <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      className="group flex w-full items-center justify-between text-left focus-visible:outline-2 focus-visible:outline-[#135d3b]"
                    >
                      <div className="flex items-start gap-3 text-sm">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-700">
                          <Icon size={17} aria-hidden={true} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-[#15364a] group-hover:text-[#135d3b] transition-colors">
                            {item.title}
                          </p>
                          <p className="text-[13px] text-slate-400">
                            {item.location}
                          </p>
                          <p className="font-mono text-sm text-slate-500">
                            {item.schedule}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500"
                        aria-hidden={true}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </Reveal>

      {/* Note de capture */}
      <div className="px-1 text-sm text-slate-400">
        <p className="font-semibold text-slate-600">Données de la capture</p>
        <p className="mt-0.5 text-[13px] leading-relaxed">
          Septembre 2025 · Les informations affichées ne décrivent pas
          l'activité actuelle.
        </p>
      </div>
    </div>
  );
}
