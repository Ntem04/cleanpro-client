import { type ReactNode } from "react";
import { clsx } from "clsx";

interface SkeletonProps {
  readonly className?: string;
}

/**
 * Skeleton — Bloc de chargement animé (shimmer)
 * Utilisé pendant les appels API pour éviter les CLS (Core Web Vitals).
 * Respecte prefers-reduced-motion (WCAG 2.2 AA).
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Chargement en cours…"
      aria-live="polite"
      aria-busy="true"
      className={clsx(
        "rounded-md bg-slate-200 motion-safe:animate-pulse",
        className
      )}
    />
  );
}

interface SkeletonGroupProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * SkeletonGroup — Groupe de skeletons avec ARIA live region englobante.
 */
export function SkeletonGroup({ children, className }: SkeletonGroupProps) {
  return (
    <div
      role="status"
      aria-label="Chargement des données…"
      aria-busy="true"
      aria-live="polite"
      className={className}
    >
      {children}
      <span className="sr-only">Chargement en cours…</span>
    </div>
  );
}

