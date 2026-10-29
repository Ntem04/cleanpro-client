import { Plus, Search, ChevronDown } from "lucide-react";
import type { ChangeEvent } from "react";

interface ServicesFiltersBarProps {
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly selectedCategory: string;
  readonly onCategoryChange: (category: string) => void;
  readonly selectedStatus: string;
  readonly onStatusChange: (status: string) => void;
  readonly onAddService: () => void;
}

export default function ServicesFiltersBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  onAddService,
}: ServicesFiltersBarProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Nettoyage anti-XSS immédiat
    const sanitized = e.target.value.replace(/[<>]/g, "");
    onSearchChange(sanitized);
  };

  return (
    <div className="space-y-4">
      {/* En-tête : Titre & Bouton "+ Ajouter un service" */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#15364a]">
            Nos Services
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Les quatre services CleanPro · Contenu du catalogue de référence
          </p>
        </div>

        <button
          type="button"
          onClick={onAddService}
          className="inline-flex items-center justify-center gap-1.5 self-start rounded-md bg-[#135d3b] px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-[#0f4d30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#135d3b] sm:self-auto"
        >
          <Plus size={15} aria-hidden={true} />
          <span>Ajouter un service</span>
        </button>
      </div>

      {/* Barre de recherche et filtres déroulants */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Champ de recherche */}
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
            placeholder="Rechercher un service..."
            aria-label="Rechercher un service par mot-clé"
            className="w-full rounded-md border border-slate-200/90 bg-white py-2 pl-10 pr-3.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
          />
        </div>

        {/* Filtres dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Filtre Services */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              aria-label="Filtrer par type de service"
              className="appearance-none rounded-md border border-slate-200/90 bg-white py-2 pl-3.5 pr-8 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
            >
              <option value="all">Tous les services</option>
              <option value="bureaux">Bureaux & Espaces professionnels</option>
              <option value="residences">Résidences & Appartements</option>
              <option value="industries">Industries & Entrepôts</option>
              <option value="espaces-publics">Espaces publics & Événements</option>
            </select>
            <ChevronDown
              size={14}
              aria-hidden={true}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* Filtre Statut */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label="Filtrer par statut du service"
              className="appearance-none rounded-md border border-slate-200/90 bg-white py-2 pl-3.5 pr-8 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
            >
              <option value="all">Statut : Tous</option>
              <option value="disponible">Statut : Disponible</option>
              <option value="indisponible">Statut : Indisponible</option>
              <option value="desactive">Statut : Désactivé (Maintenance)</option>
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

