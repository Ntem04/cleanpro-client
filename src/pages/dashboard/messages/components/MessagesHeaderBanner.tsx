import { Mail, RotateCw, PlusCircle, CheckCircle2 } from "lucide-react";

interface MessagesHeaderBannerProps {
  readonly unreadCount: number;
  readonly newlyReceivedCount: number;
  readonly isSyncing: boolean;
  readonly lastSyncTime?: string;
  readonly onSync: () => void;
  readonly onSimulateIncoming: () => void;
}

export default function MessagesHeaderBanner({
  unreadCount,
  newlyReceivedCount,
  isSyncing,
  lastSyncTime,
  onSync,
  onSimulateIncoming,
}: MessagesHeaderBannerProps) {
  // Formatage dynamique du libellé selon le nombre calculé de messages non lus
  const countLabel = (() => {
    if (unreadCount === 0) {
      return "0 nouveau message non lu";
    }
    if (unreadCount === 1) {
      return "1 nouveau message non lu";
    }
    return `${unreadCount} nouveaux messages non lus`;
  })();

  return (
    <div className="space-y-4">
      {/* Titre et sous-titre de la page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#15364a]">
            Messages
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Boîte de réception de l&apos;agence · Synchronisation base de données en direct
          </p>
        </div>

        {/* Boutons d'action pour synchroniser et simuler l'arrivée de messages depuis la base */}
        <div className="flex items-center gap-2">
          {/* Bouton de synchronisation avec la base de données */}
          <button
            type="button"
            onClick={onSync}
            disabled={isSyncing}
            title="Interroger la base de données pour récupérer les nouveaux messages"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
          >
            <RotateCw
              className={`h-3.5 w-3.5 text-[#135d3b] ${isSyncing ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span>{isSyncing ? "Calcul en cours..." : "Actualiser la base"}</span>
          </button>

          {/* Bouton de test : simuler un message client entrant */}
          <button
            type="button"
            onClick={onSimulateIncoming}
            title="Simule l'arrivée d'un nouveau message client enregistré en base"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#135d3b]/10 hover:bg-[#135d3b]/15 text-[#135d3b] border border-emerald-200 px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
          >
            <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>+ Simuler message</span>
          </button>
        </div>
      </div>

      {/* Bannière de notification dynamique */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-[#eef7f2] border border-emerald-100 px-4 py-3.5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100/80 text-[#135d3b]">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-[#135d3b]">
              {countLabel}
            </span>

            {/* Notification de nouveaux messages récemment arrivés depuis la base */}
            {newlyReceivedCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200/70 text-[#135d3b] px-2 py-0.5 text-xs font-bold">
                <CheckCircle2 className="h-3 w-3" />
                +{newlyReceivedCount} nouveau{newlyReceivedCount > 1 ? "x" : ""} reçu{newlyReceivedCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto text-xs text-slate-500">
          {lastSyncTime && (
            <span className="text-slate-400">
              Synchronisé à {lastSyncTime}
            </span>
          )}
          <span className="text-xs font-semibold text-[#135d3b] bg-emerald-100/70 border border-emerald-200/60 rounded-full px-3 py-1">
            Septembre 2025
          </span>
        </div>
      </div>
    </div>
  );
}
