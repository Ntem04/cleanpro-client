import { ResponsiveContainer, PieChart, Pie, Tooltip } from "recharts";
import { RefreshCw } from "lucide-react";
import Reveal from "../../../../components/ui/Reveal";
import { Skeleton, SkeletonGroup } from "../../../../components/ui/Skeleton";
import { useServicesDistribution } from "../hooks/useServicesDistribution";
import type { ServiceDistributionItem } from "../../../../services/dashboardServicesApi";

// ─── Tooltip géométrique personnalisé (zéro pilule) ──────────────────────────

interface DonutTooltipProps {
  readonly active?: boolean;
  readonly payload?: ReadonlyArray<{ payload?: ServiceDistributionItem }>;
}

function DonutTooltip({ active, payload }: DonutTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload;
  if (!item) return null;

  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-md">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-xs"
          style={{ backgroundColor: item.color }}
          aria-hidden="true"
        />
        <p className="text-sm font-semibold text-[#15364a]">{item.name}</p>
      </div>
      <p className="mt-1 text-[13px] text-slate-500 tabular-nums">
        <span className="font-bold text-[#15364a]">{item.percentage}%</span>
        {" · "}
        <span>{item.value} interventions</span>
      </p>
    </div>
  );
}

// ─── Skeleton de chargement ───────────────────────────────────────────────────

function ServicesDistributionSkeleton() {
  return (
    <SkeletonGroup className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
      {/* Titre */}
      <Skeleton className="h-4 w-44 mb-1" />
      <Skeleton className="h-3 w-32 mb-6" />

      {/* Corps : donut + légende */}
      <div className="grid grid-cols-12 items-center gap-6">
        {/* Donut placeholder */}
        <div className="col-span-5 flex items-center justify-center">
          <Skeleton className="h-40 w-40 rounded-full" />
        </div>

        {/* Légende placeholder */}
        <div className="col-span-7 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-1">
                <Skeleton className="h-2.5 w-2.5 shrink-0" />
                <Skeleton className="h-3 flex-1" />
              </div>
              <Skeleton className="h-3 w-8 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonGroup>
  );
}

// ─── État d'erreur ────────────────────────────────────────────────────────────

function ServicesDistributionError({
  onRetry,
}: Readonly<{ onRetry: () => void }>) {
  return (
    <div className="flex min-h-55 flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50/60 p-5 text-center">
      <p className="text-sm font-semibold text-red-700">
        Impossible de charger la répartition des services.
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

// ─── Composant principal ──────────────────────────────────────────────────────

export default function ServicesDistributionCard() {
  const { data, isLoading, isError, refetch } = useServicesDistribution();

  // 1. État de chargement — Skeleton
  if (isLoading) {
    return <ServicesDistributionSkeleton />;
  }

  // 2. État d'erreur — Message + Retry
  if (isError || !data) {
    return <ServicesDistributionError onRetry={refetch} />;
  }

  const total = typeof data.total === "number" ? data.total : 0;
  const services = Array.isArray(data.data) ? data.data : [];

  return (
    <Reveal direction="up" delay={100}>
      <section
        aria-labelledby="services-distribution-title"
        className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs"
      >
        {/* En-tête */}
        <div className="mb-5">
          <h2
            id="services-distribution-title"
            className="text-sm font-bold text-[#15364a]"
          >
            Répartition des services
          </h2>
          <p className="mt-0.5 text-sm text-slate-400">
            Par type de prestation
          </p>
        </div>

        {/* Corps : Donut + Légende côte à côte */}
        <div className="grid grid-cols-12 items-center gap-4">
          {/* ── Donut Chart ──────────────────────────────────────── */}
          <div
            className="relative col-span-12 mx-auto h-48 w-48 sm:col-span-5 sm:h-44 sm:w-full"
            aria-hidden="true"
          >
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Tooltip content={<DonutTooltip />} />
                <Pie
                  data={
                    total === 0
                      ? [{ name: "En attente", percentage: 100, fill: "#e2e8f0" }]
                      : services.map((service) => ({
                          ...service,
                          fill: service.color,
                        }))
                  }
                  dataKey="percentage"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="52%"
                  outerRadius="72%"
                  paddingAngle={total === 0 ? 0 : 2}
                  startAngle={90}
                  endAngle={-270}
                  stroke="#ffffff"
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={600}
                  animationEasing="ease-out"
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Compteur central absolu : 324 / Total */}
            <div
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
              aria-hidden="true"
            >
              <span className="text-2xl font-black tracking-tight text-[#15364a] tabular-nums leading-none">
                {total}
              </span>
              <span className="mt-0.5 text-[13px] font-medium text-slate-400">
                Total
              </span>
            </div>
          </div>

          {/* ── Légende ─────────────────────────────────────────── */}
          <div className="col-span-12 sm:col-span-7">
            <ul
              className="space-y-3"
              aria-label="Légende de la répartition des prestations"
            >
              {(services as ServiceDistributionItem[]).map((service: ServiceDistributionItem, idx: number) => (
                <Reveal key={service.name} direction="right" delay={idx * 60}>
                  <li className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {/* Puce couleur géométrique */}
                      <span
                        className="h-3 w-3 shrink-0 rounded-sm"
                        style={{ backgroundColor: service.color }}
                        aria-hidden="true"
                      />
                      <span className="truncate font-medium text-slate-600">
                        {service.name}
                      </span>
                    </div>
                    <span className="ml-3 shrink-0 font-bold tabular-nums text-[#135d3b]">
                      {service.percentage}%
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>

        {/* Table accessible masquée pour lecteurs d'écran (WCAG 2.2 AA) */}
        <table className="sr-only">
          <caption>Répartition des prestations de nettoyage CleanPro</caption>
          <thead>
            <tr>
              <th scope="col">Type de prestation</th>
              <th scope="col">Pourcentage</th>
              <th scope="col">Nombre d'interventions</th>
            </tr>
          </thead>
          <tbody>
            {(services as ServiceDistributionItem[]).map((s: ServiceDistributionItem) => (
              <tr key={s.name}>
                <td>{s.name}</td>
                <td>{s.percentage}%</td>
                <td>{s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Reveal>
  );
}
