import { CalendarCheck2, Plus, History, RotateCcw } from "lucide-react";
import type { PlanningSlotItem } from "../../../../services/dashboardServicesApi";

interface PlanningCalendarViewProps {
  readonly slots: readonly PlanningSlotItem[];
  readonly selectedSlotId: string | null;
  readonly onSelectSlot: (slot: PlanningSlotItem) => void;
  readonly onPlanFirst?: () => void;
  readonly isPastWeek?: boolean;
  readonly onResetCurrentWeek?: () => void;
}

const HOURS = ["07:00", "09:00", "11:00", "13:00", "15:00", "17:00"];

export default function PlanningCalendarView({
  slots,
  selectedSlotId,
  onSelectSlot,
  onPlanFirst,
  isPastWeek = false,
  onResetCurrentWeek,
}: PlanningCalendarViewProps) {
  // Regroupement dynamique par jour
  const days = Array.from(new Set(slots.map((s) => s.day)));

  return (
    <section
      aria-label="Planning des créneaux horaires"
      className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs"
    >
      {/* En-tête de la section */}
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#15364a] flex items-center gap-2">
            <span>Interventions du planning</span>
            {isPastWeek && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-800">
                <History size={11} aria-hidden={true} />
                <span>Archive / Semaine passée</span>
              </span>
            )}
          </h2>
          <p className="mt-0.5 text-sm text-slate-400">
            {isPastWeek
              ? "Historique des interventions passées · Consultation et régularisation"
              : "Créneaux enregistrés et synchronisés · Données prêtes pour la base de données"}
          </p>
        </div>
      </div>

      {slots.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-16 px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200/80 text-slate-400 shadow-2xs">
            {isPastWeek ? (
              <History size={26} className="text-amber-600" aria-hidden={true} />
            ) : (
              <CalendarCheck2 size={26} aria-hidden={true} />
            )}
          </div>
          <h3 className="mt-4 text-sm font-bold text-[#15364a]">
            {isPastWeek
              ? "Aucune intervention archivée pour cette ancienne semaine"
              : "Aucun créneau planifié"}
          </h3>
          <p className="mt-1.5 max-w-md text-sm text-slate-500 leading-relaxed">
            {isPastWeek
              ? "Cette semaine est passée (antérieure à la semaine en cours). Les interventions régularisées ou synchronisées pour cette période apparaîtront dans cet historique."
              : "Le planning est actuellement vierge (0 intervention). Les créneaux ajoutés ou synchronisés depuis la base de données apparaîtront automatiquement dans ce calendrier."}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {isPastWeek && onResetCurrentWeek && (
              <button
                type="button"
                onClick={onResetCurrentWeek}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-[#15364a] shadow-xs hover:bg-slate-50 transition"
              >
                <RotateCcw size={14} aria-hidden={true} />
                <span>Revenir à la semaine en cours</span>
              </button>
            )}
            {onPlanFirst && (
              <button
                type="button"
                onClick={onPlanFirst}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#135d3b] px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#0f4d30] transition focus-visible:outline-2 focus-visible:outline-[#135d3b]"
              >
                <Plus size={15} aria-hidden={true} />
                <span>
                  {isPastWeek
                    ? "Ajouter une intervention à cette archive"
                    : "Planifier une première intervention"}
                </span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Grille horaire */
        <div className="grid grid-cols-12 gap-3 sm:gap-4 pt-2">
          {/* Colonne des heures */}
          <div className="col-span-2 sm:col-span-1 space-y-12 sm:space-y-14 pt-11 text-right pr-2">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="text-[13px] font-medium text-slate-400"
              >
                {hour}
              </div>
            ))}
          </div>

          {/* Colonnes des jours dynamiques */}
          <div
            className={`col-span-10 sm:col-span-11 grid grid-cols-1 ${
              days.length === 1
                ? "md:grid-cols-1"
                : days.length === 2
                  ? "md:grid-cols-2"
                  : "md:grid-cols-3"
            } gap-4`}
          >
            {days.map((dayName) => {
              const daySlots = slots.filter((s) => s.day === dayName);
              return (
                <div key={dayName} className="space-y-3">
                  <div className="rounded-lg bg-[#eef7f2] px-3.5 py-2 text-center text-sm font-bold text-[#15364a] border border-emerald-100">
                    {dayName}
                  </div>

                  <div className="min-h-90 space-y-4 rounded-lg bg-slate-50/50 p-2.5 border border-dashed border-slate-200/70">
                    {daySlots.length === 0 ? (
                      <div className="flex h-32 items-center justify-center text-sm text-slate-400">
                        Aucune intervention
                      </div>
                    ) : (
                      daySlots.map((slot) => {
                        const isSelected = slot.id === selectedSlotId;
                        const isEmerald =
                          slot.colorTheme === "emerald" ||
                          slot.category === "bureau" ||
                          slot.category === "residence";

                        return (
                          <article
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
                            className={`relative flex flex-col justify-between rounded-lg p-3.5 text-sm cursor-pointer transition-all duration-150 border-l-4 focus-visible:outline-2 focus-visible:outline-[#135d3b] ${
                              isSelected
                                ? isEmerald
                                  ? "border-emerald-600 bg-emerald-100/90 shadow-md ring-1 ring-emerald-500/30"
                                  : "border-sky-600 bg-sky-100/90 shadow-md ring-1 ring-sky-500/30"
                                : isEmerald
                                  ? "border-emerald-500 bg-[#e8f5ee] hover:bg-emerald-100/70 shadow-2xs"
                                  : "border-sky-500 bg-[#edf5fc] hover:bg-sky-100/70 shadow-2xs"
                            }`}
                          >
                            <div>
                              <h3 className="font-bold text-[#15364a] text-sm">
                                {slot.title}
                              </h3>
                              <p className="mt-0.5 text-[13px] text-slate-500">
                                {slot.location}
                              </p>
                            </div>

                            <div
                              className={`mt-3 flex items-center justify-between text-[13px] font-semibold tabular-nums ${
                                isEmerald ? "text-[#135d3b]" : "text-sky-800"
                              }`}
                            >
                              <span>
                                {slot.startTime}–{slot.endTime}
                              </span>
                              {slot.team && (
                                <span className="text-[11px] text-slate-500 font-normal">
                                  {slot.team}
                                </span>
                              )}
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
