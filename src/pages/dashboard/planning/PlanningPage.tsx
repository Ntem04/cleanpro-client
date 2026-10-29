import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { RefreshCw, Pencil, Plus, CalendarCheck } from "lucide-react";
import Reveal from "../../../components/ui/Reveal";
import PlanningHeader from "./components/PlanningHeader";
import PlanningCalendarView from "./components/PlanningCalendarView";
import PlanningUpcomingList from "./components/PlanningUpcomingList";
import PlanningDetailPanel from "./components/PlanningDetailPanel";
import PlanningSkeleton from "./components/PlanningSkeleton";
import PlanInterventionModal from "./components/PlanInterventionModal";
import { usePlanning } from "./hooks/usePlanning";
import { formatWeekOption } from "./utils/weekUtils";
import type {
  PlanningSlotItem,
  CreatePlanningSlotPayload,
} from "../../../services/dashboardServicesApi";

export default function PlanningPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSlotId = searchParams.get("slot");

  const { data, isLoading, isError, refetch, addSlot, updateSlot, deleteSlot } = usePlanning();

  const [viewMode, setViewMode] = useState<"jour" | "semaine">("semaine");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Semaine sélectionnée : 0 = Semaine en cours, négatif = anciennes semaines antérieures, positif = futures
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const currentWeekInfo = useMemo(() => formatWeekOption(weekOffset), [weekOffset]);
  const isPastWeek = weekOffset < 0;

  // Choix de l'action / section active : "modifier" ou "ajouter"
  const [actionSection, setActionSection] = useState<"modifier" | "ajouter">("modifier");

  // Synchronisation ou restauration du créneau sélectionné avec sessionStorage
  const selectedSlotId = useMemo(() => {
    if (urlSlotId) {
      try {
        sessionStorage.setItem("cleanpro_selected_slot_v2", urlSlotId);
      } catch {
        // Ignorer en mode restreint
      }
      return urlSlotId;
    }

    try {
      const saved = sessionStorage.getItem("cleanpro_selected_slot_v2");
      return saved || null;
    } catch {
      return null;
    }
  }, [urlSlotId]);

  const handleSelectSlot = (slot: PlanningSlotItem) => {
    // Si l'utilisateur clique sur un créneau dans le planning, on active automatiquement la section "modifier"
    setActionSection("modifier");

    try {
      sessionStorage.setItem("cleanpro_selected_slot_v2", slot.id);
    } catch {
      // Ignorer
    }

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("slot", slot.id);
        return next;
      },
      { replace: true }
    );
  };

  const handleDeselectSlot = () => {
    try {
      sessionStorage.removeItem("cleanpro_selected_slot_v2");
    } catch {
      // Ignorer
    }

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("slot");
        return next;
      },
      { replace: true }
    );
  };

  // Navigation fluide vers la section sélectionnée (Modifier ou Ajouter)
  const handleNavigateSection = (section: "modifier" | "ajouter") => {
    setActionSection(section);

    if (section === "modifier" && !selectedSlotId && data?.slots?.length) {
      handleSelectSlot(data.slots[0]);
    }

    // Défilement doux vers la section cible
    setTimeout(() => {
      const targetId = section === "modifier" ? "section-modifier" : "section-ajouter";
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.focus();
      }
    }, 60);
  };

  // Créneau actif pour le panneau de droite
  const activeSlot = useMemo(() => {
    if (!data?.slots || !selectedSlotId) return null;
    return data.slots.find((s) => s.id === selectedSlotId) ?? null;
  }, [data, selectedSlotId]);

  // Filtrage des créneaux
  const filteredSlots = useMemo(() => {
    if (!data?.slots) return [];

    return data.slots.filter((slot) => {
      // Filtre service
      if (selectedService !== "all" && slot.category !== selectedService) {
        return false;
      }

      // Filtre recherche textuelle
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = slot.title.toLowerCase().includes(q);
        const matchesLoc = slot.location.toLowerCase().includes(q);
        return matchesTitle || matchesLoc;
      }

      return true;
    });
  }, [data, selectedService, searchQuery]);

  // Enregistrement des modifications
  const handleSaveSlot = async (updated: Partial<PlanningSlotItem>) => {
    if (!activeSlot) return false;
    return await updateSlot(activeSlot.id, updated);
  };

  // Planification / Ajout d'une nouvelle intervention
  const handleCreateSlot = async (payload: CreatePlanningSlotPayload) => {
    const created = await addSlot(payload);
    if (created) {
      handleSelectSlot(created);
      setActionSection("modifier");
      return true;
    }
    return false;
  };

  // Suppression / Annulation d'une intervention
  const handleDeleteSlot = async (id: string): Promise<boolean> => {
    const ok = await deleteSlot(id);
    if (ok) {
      const remaining = data?.slots.filter((s) => s.id !== id) ?? [];
      if (remaining.length > 0) {
        handleSelectSlot(remaining[0]);
      } else {
        handleDeselectSlot();
      }
      return true;
    }
    return false;
  };

  // 1. État de chargement (Skeletons)
  if (isLoading) {
    return <PlanningSkeleton />;
  }

  // 2. État d'erreur
  if (isError || !data) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50/60 p-6 text-center">
        <p className="text-sm font-semibold text-red-700">
          Impossible de charger le planning des interventions.
        </p>
        <p className="text-sm text-red-600/80">
          Vérifiez votre connexion réseau et réessayez.
        </p>
        <button
          type="button"
          onClick={refetch}
          className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3.5 py-2 text-sm font-semibold text-red-700 shadow-xs hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-500"
        >
          <RefreshCw size={14} aria-hidden={true} />
          <span>Réessayer</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── En-tête, Période & Filtres ── */}
      <Reveal direction="down" delay={40}>
        <PlanningHeader
          periodLabel={currentWeekInfo.label}
          badgeLabel={
            data.slots.length === 0
              ? "0 intervention"
              : `${data.slots.length} intervention${data.slots.length > 1 ? "s" : ""}`
          }
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          weekOffset={weekOffset}
          onWeekOffsetChange={setWeekOffset}
          onPrevWeek={() => setWeekOffset((prev) => Math.max(prev - 1, -8))}
          onNextWeek={() => setWeekOffset((prev) => Math.min(prev + 1, 4))}
          onResetCurrentWeek={() => setWeekOffset(0)}
          isPastWeek={isPastWeek}
          onPlanIntervention={() => handleNavigateSection("ajouter")}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedService={selectedService}
          onServiceChange={setSelectedService}
          selectedTeam={selectedTeam}
          onTeamChange={setSelectedTeam}
        />
      </Reveal>

      {/* ── Sélecteur d'action au-dessus (Modifier ou Ajouter avec redirection vers la section précise) ── */}
      <Reveal direction="down" delay={60}>
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-[#15364a]">
              <CalendarCheck size={20} aria-hidden={true} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#15364a]">
                Actions sur les interventions
              </h2>
              <p className="text-sm text-slate-500">
                Choisissez ci-dessous l'opération à effectuer pour accéder directement à sa section dédiée.
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => handleNavigateSection("modifier")}
              className={`inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold transition ${
                actionSection === "modifier"
                  ? "bg-[#135d3b] text-white shadow-xs"
                  : "text-slate-700 hover:text-[#135d3b] hover:bg-white/60"
              }`}
            >
              <Pencil size={15} aria-hidden={true} />
              <span>Modifier</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigateSection("ajouter")}
              className={`inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold transition ${
                actionSection === "ajouter"
                  ? "bg-[#135d3b] text-white shadow-xs"
                  : "text-slate-700 hover:text-[#135d3b] hover:bg-white/60"
              }`}
            >
              <Plus size={15} aria-hidden={true} />
              <span>Ajouter</span>
            </button>
          </div>
        </div>
      </Reveal>

      {/* ── Modal de secours (si nécessaire pour saisie rapide modale) ── */}
      <PlanInterventionModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSubmit={handleCreateSlot}
      />

      {/* ── Grille principale (Planning 8/12 + Détail 4/12) ── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Colonne Gauche (Grille horaire + Liste prochaine interventions) */}
        <section
          aria-label="Planning et interventions"
          className="space-y-6 xl:col-span-8"
        >
          <Reveal direction="up" delay={80}>
            <PlanningCalendarView
              slots={filteredSlots}
              selectedSlotId={selectedSlotId}
              onSelectSlot={handleSelectSlot}
              onPlanFirst={() => handleNavigateSection("ajouter")}
              isPastWeek={isPastWeek}
              onResetCurrentWeek={() => setWeekOffset(0)}
            />
          </Reveal>

          <Reveal direction="up" delay={140}>
            <PlanningUpcomingList
              slots={filteredSlots}
              selectedSlotId={selectedSlotId}
              onSelectSlot={handleSelectSlot}
            />
          </Reveal>
        </section>

        {/* Colonne Droite (Section Modifier / Section Ajouter) */}
        <aside
          aria-label="Panneau d'action d'intervention"
          className="xl:col-span-4"
        >
          <Reveal direction="left" delay={120}>
            <PlanningDetailPanel
              slot={activeSlot}
              activeAction={actionSection}
              onActionChange={handleNavigateSection}
              onSave={handleSaveSlot}
              onCreate={handleCreateSlot}
              onDelete={handleDeleteSlot}
              onCancel={handleDeselectSlot}
              isPastWeek={isPastWeek}
            />
          </Reveal>
        </aside>
      </div>
    </div>
  );
}
