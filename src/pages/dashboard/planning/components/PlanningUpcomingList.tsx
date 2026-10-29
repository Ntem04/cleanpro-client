import { Building2, Home, Factory, Calendar } from "lucide-react";
import type { PlanningSlotItem } from "../../../../services/dashboardServicesApi";

interface PlanningUpcomingListProps {
  readonly slots: readonly PlanningSlotItem[];
  readonly selectedSlotId: string | null;
  readonly onSelectSlot: (slot: PlanningSlotItem) => void;
}

export default function PlanningUpcomingList({
  slots,
  selectedSlotId,
  onSelectSlot,
}: PlanningUpcomingListProps) {
  const getIcon = (category: PlanningSlotItem["category"]) => {
    switch (category) {
      case "bureau":
        return <Building2 size={16} aria-hidden={true} className="text-[#135d3b]" />;
      case "residence":
        return <Home size={16} aria-hidden={true} className="text-[#135d3b]" />;
      case "industrie":
        return <Factory size={16} aria-hidden={true} className="text-[#135d3b]" />;
      case "evenement":
        return <Calendar size={16} aria-hidden={true} className="text-[#135d3b]" />;
    }
  };

  return (
    <section
      aria-label="Liste des prochaines interventions du planning"
      className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs"
    >
      <div className="mb-4">
        <h2 className="text-sm font-bold text-[#15364a]">
          Prochaines interventions
        </h2>
        <p className="mt-0.5 text-sm text-slate-400">
          {slots.length === 0
            ? "0 intervention à venir"
            : `${slots.length} intervention${slots.length > 1 ? "s" : ""} programmée${slots.length > 1 ? "s" : ""}`}
        </p>
      </div>

      {slots.length === 0 ? (
        <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-sm text-slate-400">
          Aucune intervention à venir pour le moment. Le calendrier est actuellement vierge.
        </div>
      ) : (
        <div className="space-y-2">
          {slots.map((slot) => {
          const isSelected = slot.id === selectedSlotId;
          return (
            <div
              key={slot.id}
              onClick={() => onSelectSlot(slot)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectSlot(slot);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
              className={`flex items-center justify-between rounded-lg p-3 text-sm cursor-pointer transition-all ${
                isSelected
                  ? "border border-slate-300 bg-slate-100 shadow-xs"
                  : "border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80"
              }`}
            >
              {/* Icône + Titre & Lieu */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
                  {getIcon(slot.category)}
                </div>
                <div>
                  <h3 className="font-bold text-[#15364a] text-sm">
                    {slot.title}
                  </h3>
                  <p className="text-[13px] text-slate-500">
                    {slot.location}
                  </p>
                </div>
              </div>

              {/* Date & Plage horaire */}
              <div className="text-right tabular-nums">
                <p className="text-[13px] text-slate-500 font-medium">
                  {slot.dateFormatted}
                </p>
                <p className="text-sm font-bold text-[#15364a]">
                  {slot.startTime}–{slot.endTime}
                </p>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </section>
  );
}

