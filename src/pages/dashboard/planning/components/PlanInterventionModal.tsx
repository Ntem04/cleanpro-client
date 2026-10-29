import { useState, type FormEvent } from "react";
import { X, CheckCircle, Calendar } from "lucide-react";
import type { CreatePlanningSlotPayload } from "../../../../services/dashboardServicesApi";

interface PlanInterventionModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (payload: CreatePlanningSlotPayload) => Promise<boolean>;
}

export default function PlanInterventionModal({
  isOpen,
  onClose,
  onSubmit,
}: PlanInterventionModalProps) {
  const [dateValue, setDateValue] = useState(() => new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("12:00");
  const [team, setTeam] = useState("");
  const [category, setCategory] = useState<"bureau" | "residence" | "industrie" | "evenement">("bureau");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      setErrorMsg("Veuillez renseigner l'intitulé et le lieu de l'intervention.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const [year, month, dayNum] = dateValue.split("-").map(Number);
    const dateObj = new Date(year, (month || 1) - 1, dayNum || 1);
    const rawDay = dateObj.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
    const formattedDay = rawDay.charAt(0).toUpperCase() + rawDay.slice(1);
    const dateFormatted = `${String(dayNum || 1).padStart(2, "0")}/${String(month || 1).padStart(2, "0")}/${year || 2026}`;

    const success = await onSubmit({
      day: formattedDay,
      dateFormatted,
      title: title.trim(),
      location: location.trim(),
      startTime,
      endTime,
      team: team.trim() || "Équipe générale",
      category,
      colorTheme: category === "bureau" || category === "residence" ? "emerald" : "sky",
    });

    setIsSubmitting(false);

    if (success) {
      setTitle("");
      setLocation("");
      setTeam("");
      onClose();
    } else {
      setErrorMsg("Une erreur est survenue lors de l'enregistrement de l'intervention.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-intervention-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-[#15364a]">
              <Calendar size={17} aria-hidden={true} />
            </div>
            <div>
              <h2
                id="plan-intervention-title"
                className="text-base font-bold text-[#15364a]"
              >
                Planifier une intervention
              </h2>
              <p className="text-sm text-slate-500">
                Ajouter un nouveau créneau dans l'agenda CleanPro.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la boîte de dialogue"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-[#135d3b]"
          >
            <X size={18} aria-hidden={true} />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-2.5 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Date de l'intervention */}
          <div>
            <label
              htmlFor="plan-date-input"
              className="block text-sm font-semibold text-slate-700"
            >
              Date de l'intervention *
            </label>
            <input
              id="plan-date-input"
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
            />
          </div>

          {/* Intitulé */}
          <div>
            <label
              htmlFor="plan-title-input"
              className="block text-sm font-semibold text-slate-700"
            >
              Intitulé de l'intervention *
            </label>
            <input
              id="plan-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.replace(/[<>]/g, ""))}
              placeholder="ex: Nettoyage approfondi des bureaux"
              required
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label
              htmlFor="plan-category-select"
              className="block text-sm font-semibold text-slate-700"
            >
              Catégorie de prestation
            </label>
            <select
              id="plan-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as "bureau" | "residence" | "industrie" | "evenement")}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
            >
              <option value="bureau">Bureaux & Espaces professionnels</option>
              <option value="residence">Résidences & Espaces communs</option>
              <option value="industrie">Nettoyage industriel</option>
              <option value="evenement">Événement spécial</option>
            </select>
          </div>

          {/* Lieu */}
          <div>
            <label
              htmlFor="plan-location-input"
              className="block text-sm font-semibold text-slate-700"
            >
              Lieu / Client *
            </label>
            <input
              id="plan-location-input"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value.replace(/[<>]/g, ""))}
              placeholder="ex: Siège social – Yaoundé"
              required
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
            />
          </div>

          {/* Horaires */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="plan-start-input"
                className="block text-sm font-semibold text-slate-700"
              >
                Heure de début
              </label>
              <input
                id="plan-start-input"
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value.replace(/[<>]/g, ""))}
                placeholder="08:00"
                required
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 tabular-nums transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
              />
            </div>
            <div>
              <label
                htmlFor="plan-end-input"
                className="block text-sm font-semibold text-slate-700"
              >
                Heure de fin
              </label>
              <input
                id="plan-end-input"
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value.replace(/[<>]/g, ""))}
                placeholder="12:00"
                required
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 tabular-nums transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
              />
            </div>
          </div>

          {/* Équipe */}
          <div>
            <label
              htmlFor="plan-team-input"
              className="block text-sm font-semibold text-slate-700"
            >
              Équipe assignée
            </label>
            <input
              id="plan-team-input"
              type="text"
              value={team}
              onChange={(e) => setTeam(e.target.value.replace(/[<>]/g, ""))}
              placeholder="ex: Équipe Alpha"
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-slate-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#135d3b] px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#0f4d30] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-[#135d3b]"
            >
              <CheckCircle size={14} aria-hidden={true} />
              <span>{isSubmitting ? "Planification en cours..." : "Planifier"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

