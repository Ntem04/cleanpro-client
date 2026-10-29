import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ChevronDown, RefreshCw } from "lucide-react";
import Reveal from "../../../../components/ui/Reveal";
import { Skeleton, SkeletonGroup } from "../../../../components/ui/Skeleton";
import { useInterventionsEvolution } from "../hooks/useInterventionsEvolution";
import type { InterventionHistoryPoint } from "../../../../services/dashboardServicesApi";

// ─── Tooltip accessible géométrique (Zéro pilule) ───────────────────────────

interface CustomTooltipProps {
  readonly active?: boolean;
  readonly payload?: ReadonlyArray<{ value?: number; payload?: InterventionHistoryPoint }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    const item = payload[0];
    return (
      <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-center shadow-md">
        <p className="text-[13px] font-medium text-slate-400">{item.payload?.date}</p>
        <p className="text-sm font-bold text-[#15364a] tabular-nums">
          {item.value} interventions
        </p>
      </div>
    );
  }
  return null;
};

// ─── Skeleton de chargement adapté au tracé et aux informations ─────────────

function InterventionsChartSkeleton() {
  return (
    <SkeletonGroup className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div>
        {/* Titre et sélecteur */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <Skeleton className="h-4 w-44 mb-1" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-7 w-28" />
        </div>

        {/* Sous-titre et badge pic */}
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-6 w-44" />
        </div>
      </div>

      {/* Zone du graphique */}
      <div className="mt-6 flex h-48 w-full items-end gap-3 px-2 pb-2">
        <Skeleton className="h-16 flex-1" />
        <Skeleton className="h-24 flex-1" />
        <Skeleton className="h-32 flex-1" />
        <Skeleton className="h-28 flex-1" />
        <Skeleton className="h-44 flex-1" />
        <Skeleton className="h-30 flex-1" />
        <Skeleton className="h-36 flex-1" />
      </div>
    </SkeletonGroup>
  );
}

// ─── État d'erreur avec bouton de réessai ────────────────────────────────────

function InterventionsChartError({
  onRetry,
}: Readonly<{ onRetry: () => void }>) {
  return (
    <div className="flex min-h-55 flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50/60 p-5 text-center">
      <p className="text-sm font-semibold text-red-700">
        Impossible de charger l'évolution des interventions.
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

// ─── Composant principal ────────────────────────────────────────────────────

export default function InterventionsChartCard() {
  const { data, isLoading, isError, refetch } = useInterventionsEvolution(7);

  // 1. État de chargement — Skeleton
  if (isLoading) {
    return <InterventionsChartSkeleton />;
  }

  // 2. État d'erreur — Fallback avec action Retry
  if (isError || !data) {
    return <InterventionsChartError onRetry={refetch} />;
  }

  const period = data.period || "7 derniers jours";
  const peak = data.peak || { date: "--", interventions: 0 };
  const points = Array.isArray(data.data) ? data.data : [];

  return (
    <Reveal direction="up" delay={80}>
      <section
        aria-labelledby="interventions-evolution-title"
        className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs"
      >
        {/* En-tête de la carte */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="interventions-evolution-title" className="text-sm font-bold text-[#15364a]">
                Évolution des interventions
              </h2>
              <p className="mt-0.5 text-sm text-slate-400">
                Nombre d'interventions réalisées · {period}
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-sm font-medium text-slate-600 shadow-2xs hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#135d3b]"
            >
              <span>7 derniers jours</span>
              <ChevronDown size={14} className="text-slate-400" aria-hidden={true} />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-[13px] text-slate-400">
            <span>Tracé de la capture</span>
            {/* Badge géométrique du pic visible dans la maquette */}
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[13px] font-semibold text-slate-700">
              Pic : {peak.date} · {peak.interventions} interventions
            </span>
          </div>
        </div>

        {/* Graphique Recharts interactif */}
        <div className="mt-4 h-48 w-full" aria-label={`Graphique d'évolution des interventions sur la période ${period}`}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart data={points as unknown as any[]} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#135d3b" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#135d3b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={13}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={13}
                tickLine={false}
                axisLine={false}
                domain={[0, 80]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="interventions"
                stroke="#135d3b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#chartColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Table accessible masquée pour lecteurs d'écran (WCAG 2.2 AA) */}
        <table className="sr-only">
          <caption>Historique de l'évolution des interventions</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Nombre d'interventions</th>
            </tr>
          </thead>
          <tbody>
            {(points as InterventionHistoryPoint[]).map((pt: InterventionHistoryPoint) => (
              <tr key={pt.date}>
                <td>{pt.date}</td>
                <td>{pt.interventions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Reveal>
  );
}
