import { useState, type FormEvent } from "react";
import {
  Pencil,
  Plus,
  Check,
  AlertCircle,
  Calendar,
  Database,
  Trash2,
  AlertTriangle,
  History,
} from "lucide-react";
import type {
  PlanningSlotItem,
  CreatePlanningSlotPayload,
} from "../../../../services/dashboardServicesApi";

interface PlanningDetailPanelProps {
  readonly slot: PlanningSlotItem | null;
  readonly activeAction: "modifier" | "ajouter";
  readonly onActionChange: (action: "modifier" | "ajouter") => void;
  readonly onSave: (updated: Partial<PlanningSlotItem>) => Promise<boolean>;
  readonly onCreate: (payload: CreatePlanningSlotPayload) => Promise<boolean>;
  readonly onDelete: (id: string) => Promise<boolean>;
  readonly onCancel: () => void;
  readonly isPastWeek?: boolean;
}

export default function PlanningDetailPanel({
  slot,
  activeAction,
  onActionChange,
  onSave,
  onCreate,
  onDelete,
  onCancel,
  isPastWeek = false,
}: PlanningDetailPanelProps) {
  return (
    <div className="space-y-4">
      {/* ── Onglets de sélection d'action (au-dessus du panneau) ── */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-2 shadow-2xs">
        <div className="grid grid-cols-2 gap-1.5 bg-slate-100/90 p-1 rounded-lg border border-slate-200/80">
          <button
            type="button"
            onClick={() => onActionChange("modifier")}
            className={`inline-flex items-center justify-center gap-2 rounded-md py-2 px-3 text-sm font-semibold transition ${
              activeAction === "modifier"
                ? "bg-[#135d3b] text-white shadow-xs"
                : "text-slate-700 hover:text-[#135d3b] hover:bg-white/70"
            }`}
          >
            <Pencil size={15} aria-hidden={true} />
            <span>Modifier</span>
          </button>

          <button
            type="button"
            onClick={() => onActionChange("ajouter")}
            className={`inline-flex items-center justify-center gap-2 rounded-md py-2 px-3 text-sm font-semibold transition ${
              activeAction === "ajouter"
                ? "bg-[#135d3b] text-white shadow-xs"
                : "text-slate-700 hover:text-[#135d3b] hover:bg-white/70"
            }`}
          >
            <Plus size={15} aria-hidden={true} />
            <span>Ajouter</span>
          </button>
        </div>
      </div>

      {/* Alerte si ancienne semaine */}
      {isPastWeek && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 shadow-2xs">
          <History size={16} className="text-amber-700 shrink-0 mt-0.5" aria-hidden={true} />
          <div>
            <p className="font-bold text-amber-900">Mode Historique · Ancienne semaine</p>
            <p className="mt-0.5 text-amber-800 leading-relaxed">
              Vous consultez une semaine passée (antérieure à la semaine en cours). Les interventions modifiées ou créées ici seront classées dans les archives historiques.
            </p>
          </div>
        </div>
      )}

      {/* ── Affichage de la section correspondante ── */}
      {activeAction === "modifier" ? (
        <PlanningEditSection
          slot={slot}
          onSave={onSave}
          onDelete={onDelete}
          onCancel={onCancel}
          onSwitchToAdd={() => onActionChange("ajouter")}
          isPastWeek={isPastWeek}
        />
      ) : (
        <PlanningAddSection
          onCreate={onCreate}
          onCancel={() => onActionChange("modifier")}
          isPastWeek={isPastWeek}
        />
      )}

      {/* Encadré d'information sur la synchronisation */}
      <aside
        aria-label="Informations d'agenda"
        className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm"
      >
        <h4 className="font-bold text-[#15364a]">Agenda synchronisé</h4>
        <p className="mt-1 leading-relaxed text-slate-600">
          Les créneaux créés ou modifiés sont immédiatement enregistrés et prêts pour la synchronisation avec votre base de données.
        </p>
      </aside>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 : MODIFIER L'INTERVENTION SÉLECTIONNÉE
// ─────────────────────────────────────────────────────────────────────────────

interface PlanningEditSectionProps {
  readonly slot: PlanningSlotItem | null;
  readonly onSave: (updated: Partial<PlanningSlotItem>) => Promise<boolean>;
  readonly onDelete: (id: string) => Promise<boolean>;
  readonly onCancel: () => void;
  readonly onSwitchToAdd: () => void;
  readonly isPastWeek?: boolean;
}

function PlanningEditSection({
  slot,
  onSave,
  onDelete,
  onCancel,
  onSwitchToAdd,
  isPastWeek = false,
}: PlanningEditSectionProps) {
  if (!slot) {
    return (
      <section
        id="section-modifier"
        tabIndex={-1}
        aria-labelledby="section-modifier-empty-heading"
        className="flex min-h-[380px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-xs"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-[#15364a]">
          <Calendar size={24} aria-hidden={true} />
        </div>
        <h3
          id="section-modifier-empty-heading"
          className="mt-3 text-sm font-bold text-[#15364a]"
        >
          Section Modifier l'intervention
        </h3>
        <p className="mt-1.5 max-w-xs text-sm text-slate-500 leading-relaxed">
          Sélectionnez un créneau sur le planning à gauche pour charger ses détails, ou commencez par ajouter une nouvelle intervention.
        </p>
        <button
          type="button"
          onClick={onSwitchToAdd}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-[#135d3b] px-3.5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#0f4d30] transition"
        >
          <Plus size={15} aria-hidden={true} />
          <span>Ajouter une intervention</span>
        </button>
      </section>
    );
  }

  return (
    <PlanningEditForm
      key={slot.id}
      slot={slot}
      onSave={onSave}
      onDelete={onDelete}
      onCancel={onCancel}
      isPastWeek={isPastWeek}
    />
  );
}

function PlanningEditForm({
  slot,
  onSave,
  onDelete,
  onCancel,
  isPastWeek = false,
}: {
  readonly slot: PlanningSlotItem;
  readonly onSave: (updated: Partial<PlanningSlotItem>) => Promise<boolean>;
  readonly onDelete: (id: string) => Promise<boolean>;
  readonly onCancel: () => void;
  readonly isPastWeek?: boolean;
}) {
  const [title, setTitle] = useState(slot.title);
  const [location, setLocation] = useState(slot.location);
  const [startTime, setStartTime] = useState(slot.startTime);
  const [endTime, setEndTime] = useState(slot.endTime);
  const [team, setTeam] = useState(slot.team || "À compléter");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "success" | "error">("idle");

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setFeedback("idle");
    const ok = await onDelete(slot.id);
    setIsDeleting(false);
    if (!ok) {
      setFeedback("error");
      setIsConfirmingDelete(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback("idle");

    const ok = await onSave({
      title: title.trim(),
      location: location.trim(),
      startTime,
      endTime,
      team: team.trim(),
    });

    setIsSubmitting(false);
    if (ok) {
      setFeedback("success");
      setTimeout(() => setFeedback("idle"), 3000);
    } else {
      setFeedback("error");
    }
  };

  return (
    <section
      id="section-modifier"
      tabIndex={-1}
      aria-labelledby="section-modifier-heading"
      className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs scroll-mt-24"
    >
      {/* En-tête de la section Modifier */}
      <div className="border-b border-slate-100 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-slate-700">
              <Pencil size={13} aria-hidden={true} />
            </span>
            <h2
              id="section-modifier-heading"
              className="text-sm font-bold text-[#15364a]"
            >
              Section Modifier l'intervention
            </h2>
          </div>
          <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100/80 px-2 py-0.5 text-[13px] font-semibold text-slate-700">
            {slot.dateFormatted || slot.day}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          Modifiez les informations du créneau sélectionné dans l'agenda.
        </p>
      </div>

      {/* Formulaire de modification */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
        {/* Intervention */}
        <div>
          <label
            htmlFor="slot-title-input"
            className="block text-sm font-semibold text-slate-700"
          >
            Intervention *
          </label>
          <input
            id="slot-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.replace(/[<>]/g, ""))}
            required
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
          />
        </div>

        {/* Lieu */}
        <div>
          <label
            htmlFor="slot-location-input"
            className="block text-sm font-semibold text-slate-700"
          >
            Lieu *
          </label>
          <input
            id="slot-location-input"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value.replace(/[<>]/g, ""))}
            required
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
          />
        </div>

        {/* Début & Fin */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="slot-start-time"
              className="block text-sm font-semibold text-slate-700"
            >
              Début *
            </label>
            <input
              id="slot-start-time"
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
              htmlFor="slot-end-time"
              className="block text-sm font-semibold text-slate-700"
            >
              Fin *
            </label>
            <input
              id="slot-end-time"
              type="text"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value.replace(/[<>]/g, ""))}
              placeholder="12:00"
              required
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 tabular-nums transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
            />
          </div>
        </div>

        {/* Équipe affectée */}
        <div>
          <label
            htmlFor="slot-team-input"
            className="block text-sm font-semibold text-slate-700"
          >
            Équipe affectée
          </label>
          <input
            id="slot-team-input"
            type="text"
            value={team}
            onChange={(e) => setTeam(e.target.value.replace(/[<>]/g, ""))}
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
          />
          <p className="mt-1 text-[13px] text-slate-400 leading-snug">
            L'équipe de ce créneau n'est pas explicitement fournie. L'historique des dernières interventions n'est pas utilisé pour l'attribuer.
          </p>
        </div>

        {/* Feedback */}
        {feedback === "success" && (
          <div className="flex items-center gap-2 rounded-md bg-slate-50 p-2 text-sm text-slate-800 border border-slate-200">
            <Check size={14} className="text-[#135d3b]" aria-hidden={true} />
            <span>Intervention mise à jour avec succès.</span>
          </div>
        )}
        {feedback === "error" && (
          <div className="flex items-center gap-2 rounded-md bg-red-50 p-2 text-sm text-red-700 border border-red-200">
            <AlertCircle size={14} aria-hidden={true} />
            <span>Une erreur est survenue lors de l'enregistrement.</span>
          </div>
        )}

        {/* Actions : Modifier / Annuler / Supprimer avec confirmation */}
        <div className="pt-2 border-t border-slate-100">
          {isConfirmingDelete ? (
            <div className="rounded-lg border border-red-200 bg-red-50/90 p-3.5 text-sm">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-red-900">
                    Confirmer l'annulation de cette tâche ?
                  </p>
                  <p className="mt-1 text-xs text-red-700 leading-relaxed">
                    Cette intervention sera définitivement supprimée du planning et de la base de données.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleConfirmDelete}
                      disabled={isDeleting}
                      className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition focus-visible:outline-2 focus-visible:outline-red-500 disabled:opacity-60"
                    >
                      <Trash2 size={13} aria-hidden={true} />
                      <span>{isDeleting ? "Suppression en cours..." : "Oui, supprimer définitivement"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(false)}
                      disabled={isDeleting}
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Ne pas supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isDeleting}
                  className="inline-flex items-center justify-center rounded-md bg-[#135d3b] px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-[#0f4d30] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-[#135d3b]"
                >
                  {isSubmitting
                    ? "Enregistrement..."
                    : isPastWeek
                      ? "Enregistrer dans l'historique"
                      : "Modifier"}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting || isDeleting}
                  className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-slate-400"
                >
                  Annuler
                </button>
              </div>

              {/* Bouton de suppression en cas d'annulation */}
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                disabled={isSubmitting || isDeleting}
                className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50/70 px-3 py-2 text-sm font-semibold text-red-700 shadow-2xs transition hover:bg-red-100/80 focus-visible:outline-2 focus-visible:outline-red-500 disabled:opacity-60"
                title="Annuler et supprimer cette intervention"
              >
                <Trash2 size={14} aria-hidden={true} />
                <span>Supprimer</span>
              </button>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 : AJOUTER UNE NOUVELLE INTERVENTION (BDD-READY)
// ─────────────────────────────────────────────────────────────────────────────

interface PlanningAddSectionProps {
  readonly onCreate: (payload: CreatePlanningSlotPayload) => Promise<boolean>;
  readonly onCancel: () => void;
  readonly isPastWeek?: boolean;
}

function PlanningAddSection({
  onCreate,
  onCancel,
  isPastWeek = false,
}: PlanningAddSectionProps) {
  const [dateValue, setDateValue] = useState(() => new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("12:00");
  const [team, setTeam] = useState("");
  const [category, setCategory] = useState<"bureau" | "residence" | "industrie" | "evenement">("bureau");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      setErrorMsg("Veuillez renseigner l'intitulé et le lieu de l'intervention.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setFeedback("idle");

    const [year, month, dayNum] = dateValue.split("-").map(Number);
    const dateObj = new Date(year, (month || 1) - 1, dayNum || 1);
    const rawDay = dateObj.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
    const formattedDay = rawDay.charAt(0).toUpperCase() + rawDay.slice(1);
    const dateFormatted = `${String(dayNum || 1).padStart(2, "0")}/${String(month || 1).padStart(2, "0")}/${year || 2026}`;

    const success = await onCreate({
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
      setFeedback("success");
      // Réinitialiser les champs
      setTitle("");
      setLocation("");
      setTeam("");
      setTimeout(() => setFeedback("idle"), 3000);
    } else {
      setFeedback("error");
      setErrorMsg("Une erreur est survenue lors de l'enregistrement dans la base de données.");
    }
  };

  return (
    <section
      id="section-ajouter"
      tabIndex={-1}
      aria-labelledby="section-ajouter-heading"
      className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs scroll-mt-24"
    >
      {/* En-tête de la section Ajouter */}
      <div className="border-b border-slate-100 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-slate-700">
              <Plus size={13} aria-hidden={true} />
            </span>
            <h2
              id="section-ajouter-heading"
              className="text-sm font-bold text-[#15364a]"
            >
              Section Ajouter une intervention
            </h2>
          </div>
          <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[13px] font-semibold text-slate-700">
            Nouveau créneau
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          Enregistrez une nouvelle intervention dans la base de données CleanPro.
        </p>
      </div>

      {errorMsg && (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-2.5 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
        {/* Date de l'intervention */}
        <div>
          <label
            htmlFor="add-slot-date"
            className="block text-sm font-semibold text-slate-700"
          >
            Date de l'intervention *
          </label>
          <input
            id="add-slot-date"
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
            htmlFor="add-slot-title"
            className="block text-sm font-semibold text-slate-700"
          >
            Intitulé de l'intervention *
          </label>
          <input
            id="add-slot-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.replace(/[<>]/g, ""))}
            placeholder="ex: Nettoyage approfondi des locaux"
            required
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
          />
        </div>

        {/* Lieu */}
        <div>
          <label
            htmlFor="add-slot-location"
            className="block text-sm font-semibold text-slate-700"
          >
            Lieu d'intervention *
          </label>
          <input
            id="add-slot-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value.replace(/[<>]/g, ""))}
            placeholder="ex: Siège social – Yaoundé"
            required
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
          />
        </div>

        {/* Catégorie */}
        <div>
          <label
            htmlFor="add-slot-category"
            className="block text-sm font-semibold text-slate-700"
          >
            Type de prestation *
          </label>
          <div className="relative mt-1">
            <select
              id="add-slot-category"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value as "bureau" | "residence" | "industrie" | "evenement"
                )
              }
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
            >
              <option value="bureau">Bureaux & Espaces professionnels</option>
              <option value="residence">Résidences & Appartements</option>
              <option value="industrie">Industries & Entrepôts</option>
              <option value="evenement">Événements & Espaces publics</option>
            </select>
          </div>
        </div>

        {/* Horaires Début & Fin */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="add-slot-start"
              className="block text-sm font-semibold text-slate-700"
            >
              Heure début *
            </label>
            <input
              id="add-slot-start"
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
              htmlFor="add-slot-end"
              className="block text-sm font-semibold text-slate-700"
            >
              Heure fin *
            </label>
            <input
              id="add-slot-end"
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
            htmlFor="add-slot-team"
            className="block text-sm font-semibold text-slate-700"
          >
            Équipe affectée
          </label>
          <input
            id="add-slot-team"
            type="text"
            value={team}
            onChange={(e) => setTeam(e.target.value.replace(/[<>]/g, ""))}
            placeholder="ex: Équipe Alpha"
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
          />
        </div>

        {/* Feedback */}
        {feedback === "success" && (
          <div className="flex items-center gap-2 rounded-md bg-slate-50 p-2 text-sm text-slate-800 border border-slate-200">
            <Check size={14} className="text-[#135d3b]" aria-hidden={true} />
            <span>Intervention ajoutée et enregistrée avec succès !</span>
          </div>
        )}
        {feedback === "error" && (
          <div className="flex items-center gap-2 rounded-md bg-red-50 p-2 text-sm text-red-700 border border-red-200">
            <AlertCircle size={14} aria-hidden={true} />
            <span>Erreur lors de l'enregistrement de l'intervention.</span>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#135d3b] px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-[#0f4d30] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-[#135d3b]"
          >
            <Database size={15} aria-hidden={true} />
            <span>
              {isSubmitting
                ? "Enregistrement..."
                : isPastWeek
                  ? "Archiver dans l'historique"
                  : "Ajouter au planning"}
            </span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-slate-400"
          >
            Annuler
          </button>
        </div>
      </form>
    </section>
  );
}
