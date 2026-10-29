import { CalendarDays, ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import Reveal from "../../../../components/ui/Reveal";
import { Skeleton, SkeletonGroup } from "../../../../components/ui/Skeleton";
import { useServicesDistribution } from "../hooks/useServicesDistribution";

// ─── Skeleton de chargement adapté (Anti-CLS) ────────────────────────────────

function MonthlyInterventionsSkeleton() {
  return (
    <SkeletonGroup className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-start gap-4">
        <Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    </SkeletonGroup>
  );
}

// ─── État d'erreur avec bouton de réessai (Fail-Closed) ───────────────────────

function MonthlyInterventionsError({
  onRetry,
}: Readonly<{ onRetry: () => void }>) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50/60 p-5">
      <p className="text-sm font-semibold text-red-700">
        Impossible de charger le total des interventions ce mois.
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

// ─── Composant principal connecté à useServicesDistribution ─────────────────

export default function MonthlyInterventionsCard() {
  // Les données sont synchronisées avec la répartition des services (source unique)
  const { data, isLoading, isError, refetch } = useServicesDistribution();

  // 1. État de chargement — Skeleton
  if (isLoading) {
    return <MonthlyInterventionsSkeleton />;
  }

  // 2. État d'erreur — Fallback Retry
  if (isError || !data) {
    return <MonthlyInterventionsError onRetry={refetch} />;
  }

  const total = typeof data.total === "number" ? data.total : 0;
  const changePercentage = typeof data.changePercentage === "number" ? data.changePercentage : 0;
  const isPositive = changePercentage >= 0;

  return (
    <Reveal direction="up" delay={60}>
      <section
        aria-label="Statistiques mensuelles d'interventions"
        className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs"
      >
        <div className="flex items-start gap-4">
          {/* Icône Calendrier */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-[#15364a]">
            <CalendarDays size={22} aria-hidden={true} />
          </div>

          {/* Détails métriques dynamiques reliés à la répartition des services */}
          <div className="space-y-1">
            <span className="block text-sm font-medium text-slate-500">
              Interventions ce mois
            </span>
            <div className="text-3xl font-black tracking-tight text-[#15364a] tabular-nums">
              {total}
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span
                className={`inline-flex items-center gap-0.5 font-bold ${
                  isPositive ? "text-[#135d3b]" : "text-red-600"
                }`}
              >
                {isPositive ? (
                  <ArrowUp size={13} aria-hidden={true} />
                ) : (
                  <ArrowDown size={13} aria-hidden={true} />
                )}
                {isPositive ? `+${changePercentage}%` : `${changePercentage}%`}
              </span>
              <span className="text-slate-400">par rapport au mois dernier</span>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
