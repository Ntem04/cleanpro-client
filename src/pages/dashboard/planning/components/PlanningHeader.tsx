import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  ChevronDown,
  History,
  RotateCcw,
} from "lucide-react";
import type { ChangeEvent } from "react";
import { getAvailableWeekOptions } from "../utils/weekUtils";

interface PlanningHeaderProps {
  readonly periodLabel: string;
  readonly badgeLabel: string;
  readonly viewMode: "jour" | "semaine";
  readonly onViewModeChange: (mode: "jour" | "semaine") => void;
  readonly weekOffset: number;
  readonly onWeekOffsetChange: (offset: number) => void;
  readonly onPrevWeek: () => void;
  readonly onNextWeek: () => void;
  readonly onResetCurrentWeek: () => void;
  readonly isPastWeek: boolean;
  readonly onPlanIntervention: () => void;
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly selectedService: string;
  readonly onServiceChange: (service: string) => void;
  readonly selectedTeam: string;
  readonly onTeamChange: (team: string) => void;
}

export default function PlanningHeader({
  badgeLabel,
  viewMode,
  onViewModeChange,
  weekOffset,
  onWeekOffsetChange,
  onPrevWeek,
  onNextWeek,
  onResetCurrentWeek,
  isPastWeek,
  onPlanIntervention,
  searchQuery,
  onSearchChange,
  selectedService,
  onServiceChange,
  selectedTeam,
  onTeamChange,
}: PlanningHeaderProps) {
  const weekOptions = getAvailableWeekOptions();

  // Séparation en 3 groupes : Anciennes semaines (passées), Semaine en cours, Semaines futures
  const pastOptions = weekOptions.filter((opt) => opt.group === "past").reverse();
  const currentOption = weekOptions.find((opt) => opt.group === "current");
  const futureOptions = weekOptions.filter((opt) => opt.group === "future");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value.replace(/[<>]/g, ""));
  };

  return (
    <div className="space-y-4">
      {/* ── Titre principal & Bouton "Planifier une intervention" ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#15364a]">
            Planning
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Agenda et planification des interventions · Prêt pour la synchronisation
          </p>
        </div>

        <button
          type="button"
          onClick={onPlanIntervention}
          className="inline-flex items-center justify-center gap-1.5 self-start rounded-md bg-[#135d3b] px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-[#0f4d30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#135d3b] sm:self-auto"
        >
          <Plus size={15} aria-hidden={true} />
          <span>Planifier une intervention</span>
        </button>
      </div>

      {/* ── Sélecteur de période & Mode Vue (Jour / Semaine) ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Navigation semaine avec flèches chevrons + Sélecteur déroulant complet des anciennes semaines */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-lg border border-slate-200/90 bg-white p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={onPrevWeek}
              aria-label="Semaine précédente"
              title="Semaine précédente"
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-[#135d3b]"
            >
              <ChevronLeft size={16} aria-hidden={true} />
            </button>

            {/* Menu déroulant contenant les options pour les anciennes semaines avant la semaine en cours */}
            <div className="relative">
              <select
                value={weekOffset}
                onChange={(e) => onWeekOffsetChange(Number(e.target.value))}
                aria-label="Sélectionner la semaine du planning"
                className="appearance-none bg-transparent py-1.5 pl-2.5 pr-7 text-sm font-bold text-[#15364a] cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-[#135d3b] rounded"
              >
                {/* 1. Anciennes semaines avant la semaine en cours */}
                <optgroup label="⏪ Anciennes semaines (Archives avant la semaine en cours)">
                  {pastOptions.map((opt) => (
                    <option key={opt.offset} value={opt.offset}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>

                {/* 2. Semaine en cours */}
                {currentOption && (
                  <optgroup label="📍 Semaine active">
                    <option value={currentOption.offset}>
                      {currentOption.label}
                    </option>
                  </optgroup>
                )}

                {/* 3. Semaines futures */}
                <optgroup label="⏩ Semaines à venir (Prévisionnel)">
                  {futureOptions.map((opt) => (
                    <option key={opt.offset} value={opt.offset}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown
                size={14}
                aria-hidden={true}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>

            <button
              type="button"
              onClick={onNextWeek}
              aria-label="Semaine suivante"
              title="Semaine suivante"
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-[#135d3b]"
            >
              <ChevronRight size={16} aria-hidden={true} />
            </button>
          </div>

          {/* Badge Période / Statut Archive si ancienne semaine */}
          {isPastWeek ? (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-[13px] font-semibold text-amber-800">
              <History size={13} aria-hidden={true} />
              <span>Ancienne semaine · {badgeLabel}</span>
            </span>
          ) : (
            <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100/80 px-2.5 py-1 text-[13px] font-medium text-slate-700">
              {badgeLabel}
            </span>
          )}

          {/* Raccourci 1-clic pour revenir à la semaine en cours */}
          {isPastWeek && (
            <button
              type="button"
              onClick={onResetCurrentWeek}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[13px] font-medium text-[#135d3b] shadow-2xs hover:bg-[#eef7f2] transition focus-visible:outline-2 focus-visible:outline-[#135d3b]"
              title="Revenir à la semaine en cours"
            >
              <RotateCcw size={13} aria-hidden={true} />
              <span>Semaine en cours</span>
            </button>
          )}
        </div>

        {/* Boutons bascule Jour / Semaine */}
        <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange("jour")}
            className={`rounded px-3 py-1 text-sm font-semibold transition ${
              viewMode === "jour"
                ? "bg-[#135d3b] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Jour
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("semaine")}
            className={`rounded px-3 py-1 text-sm font-semibold transition ${
              viewMode === "semaine"
                ? "bg-[#135d3b] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Semaine
          </button>
        </div>
      </div>

      {/* ── Barre de recherche & Filtres déroulants ── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Recherche */}
        <div className="relative flex-1">
          <Search
            size={16}
            aria-hidden={true}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Rechercher une intervention..."
            aria-label="Rechercher une intervention dans le planning"
            className="w-full rounded-md border border-slate-200/90 bg-white py-2 pl-10 pr-3.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
          />
        </div>

        {/* Dropdowns : Tous les services & Équipe */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Tous les services */}
          <div className="relative">
            <select
              value={selectedService}
              onChange={(e) => onServiceChange(e.target.value)}
              aria-label="Filtrer par service"
              className="appearance-none rounded-md border border-slate-200/90 bg-white py-2 pl-3.5 pr-8 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
            >
              <option value="all">Tous les services</option>
              <option value="bureau">Bureaux & Espaces professionnels</option>
              <option value="residence">Résidences & Espaces communs</option>
              <option value="industrie">Nettoyage industriel</option>
              <option value="evenement">Événement spécial</option>
            </select>
            <ChevronDown
              size={14}
              aria-hidden={true}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* Équipe */}
          <div className="relative">
            <select
              value={selectedTeam}
              onChange={(e) => onTeamChange(e.target.value)}
              aria-label="Filtrer par équipe affectée"
              className="appearance-none rounded-md border border-slate-200/90 bg-white py-2 pl-3.5 pr-8 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
            >
              <option value="all">Équipe : À compléter</option>
              <option value="alpha">Équipe Alpha</option>
              <option value="beta">Équipe Bêta</option>
              <option value="gamma">Équipe Gamma</option>
            </select>
            <ChevronDown
              size={14}
              aria-hidden={true}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
