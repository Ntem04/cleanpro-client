import { RefreshCw, Inbox } from "lucide-react";
import Reveal from "../../../../components/ui/Reveal";
import { Skeleton, SkeletonGroup } from "../../../../components/ui/Skeleton";
import { useRecentInterventions } from "../hooks/useRecentInterventions";
import type {
  RecentInterventionItem,
  InterventionStatus,
} from "../../../../services/dashboardServicesApi";

// ─── Configuration des badges par statut ─────────────────────────────────────

const STATUS_CONFIG: Record<InterventionStatus, { className: string }> = {
  Terminée: {
    className: "border-slate-200 bg-slate-100 text-slate-700",
  },
  "En cours": {
    className: "border-sky-200 bg-sky-50 text-sky-800",
  },
  Planifiée: {
    className: "border-slate-200 bg-slate-100 text-slate-600",
  },
};

// ─── Skeleton de chargement adapté au tableau (Anti-CLS) ─────────────────────

function RecentInterventionsSkeleton() {
  return (
    <SkeletonGroup className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="mb-4">
        <Skeleton className="h-4 w-48 mb-1" />
        <Skeleton className="h-3 w-56" />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
        ))}
      </div>
    </SkeletonGroup>
  );
}

// ─── État d'erreur avec bouton de réessai (Fail-Closed) ───────────────────────

function RecentInterventionsError({
  onRetry,
}: Readonly<{ onRetry: () => void }>) {
  return (
    <div className="flex min-h-45 flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50/60 p-5 text-center">
      <p className="text-sm font-semibold text-red-700">
        Impossible de charger les dernières interventions.
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

export default function RecentInterventionsTable() {
  const { data, isLoading, isError, refetch } = useRecentInterventions();

  // 1. État de chargement — Skeleton
  if (isLoading) {
    return <RecentInterventionsSkeleton />;
  }

  // 2. État d'erreur — Fallback Retry
  if (isError || !data) {
    return <RecentInterventionsError onRetry={refetch} />;
  }

  const rows = Array.isArray(data.data) ? (data.data as RecentInterventionItem[]) : [];

  return (
    <Reveal direction="up" delay={100}>
      <section
        aria-labelledby="recent-interventions-table-title"
        className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs"
      >
        <div className="mb-4">
          <h2
            id="recent-interventions-table-title"
            className="text-sm font-bold text-[#15364a]"
          >
            Dernières interventions
          </h2>
          <p className="mt-0.5 text-sm text-slate-400">
            Historique visible dans la capture
          </p>
        </div>

        {/* 3. État réinitialisé : en attente des futures données backend */}
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 mb-2">
              <Inbox size={20} aria-hidden={true} />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Aucune intervention enregistrée pour le moment
            </p>
            <p className="mt-0.5 text-[13px] text-slate-400 max-w-sm">
              Cet espace est prêt à recevoir les interventions synchronisées
              depuis l'API.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[13px] font-semibold text-slate-500">
                  <th scope="col" className="py-3 pr-4">
                    Date & heure
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Client
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Service
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Équipe
                  </th>
                  <th scope="col" className="pl-4 py-3 text-right">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    <td className="py-3.5 pr-4 font-mono text-[13px] text-slate-500">
                      {row.dateTime}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[#15364a]">
                      {row.client}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {row.service}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{row.team}</td>
                    <td className="pl-4 py-3.5 text-right">
                      <span
                        className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[13px] font-semibold ${
                          STATUS_CONFIG[row.status]?.className ||
                          "border-slate-200 bg-slate-100 text-slate-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Reveal>
  );
}
