import { Skeleton, SkeletonGroup } from "../../../../components/ui/Skeleton";

export default function PlanningSkeleton() {
  return (
    <div className="space-y-6">
      {/* Skeleton d'en-tête */}
      <SkeletonGroup className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-6 w-44 rounded-md" />
            <Skeleton className="h-3 w-64 rounded-md" />
          </div>
          <Skeleton className="h-9 w-44 rounded-md" />
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-56 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>

        <div className="flex justify-between gap-4">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
      </SkeletonGroup>

      {/* Grille principale 2 colonnes */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <SkeletonGroup className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <Skeleton className="h-5 w-52 rounded-md" />
            <Skeleton className="h-3 w-72 rounded-md" />
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Skeleton className="h-72 w-full rounded-lg" />
              <Skeleton className="h-72 w-full rounded-lg" />
            </div>
          </SkeletonGroup>

          <SkeletonGroup className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
            <Skeleton className="h-5 w-44 rounded-md" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </SkeletonGroup>
        </div>

        <div className="xl:col-span-4">
          <SkeletonGroup className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-3 w-28 rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </SkeletonGroup>
        </div>
      </div>
    </div>
  );
}

