import { Skeleton, SkeletonGroup } from "../../../../components/ui/Skeleton";

export default function ServicesCatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      {/* Colonne gauche (Cartes des services) */}
      <div className="space-y-4 xl:col-span-7">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonGroup
            key={i}
            className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-start"
          >
            {/* Image vignette */}
            <Skeleton className="h-36 w-full shrink-0 rounded-lg sm:w-44" />

            {/* Contenu */}
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-5/6 rounded-md" />

              {/* Prestations checklist */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded-xs" />
                  <Skeleton className="h-3 w-48 rounded-md" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded-xs" />
                  <Skeleton className="h-3 w-40 rounded-md" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded-xs" />
                  <Skeleton className="h-3 w-36 rounded-md" />
                </div>
              </div>

              {/* Badge + bouton */}
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>
          </SkeletonGroup>
        ))}
      </div>

      {/* Colonne droite (Panneau d'édition) */}
      <div className="xl:col-span-5">
        <SkeletonGroup className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
          <Skeleton className="h-5 w-44 rounded-md" />
          <Skeleton className="h-3 w-32 rounded-md" />

          <div className="space-y-3 pt-3">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />

            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-20 w-full rounded-md" />

            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-8 w-36 rounded-md" />

            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />

            <div className="flex gap-2 pt-4">
              <Skeleton className="h-9 w-28 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        </SkeletonGroup>
      </div>
    </div>
  );
}

