import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import Reveal from "../../../components/ui/Reveal";
import ServicesFiltersBar from "./components/ServicesFiltersBar";
import ServiceCardItem from "./components/ServiceCardItem";
import ServiceEditPanel from "./components/ServiceEditPanel";
import ServicesCatalogSkeleton from "./components/ServicesCatalogSkeleton";
import AddServiceModal from "./components/AddServiceModal";
import { useServicesCatalog } from "./hooks/useServicesCatalog";
import type {
  ServiceCatalogItem,
  CreateServicePayload,
} from "../../../services/dashboardServicesApi";

export default function ServicesDashboardPage() {
  const { data, isLoading, isError, refetch, addServiceItem, updateServiceItem } =
    useServicesCatalog();

  // ── Persistance de session (sessionStorage) & synchronisation URL ──
  const [searchParams, setSearchParams] = useSearchParams();
  const urlParamService = searchParams.get("service");

  // Initialisation ou restauration depuis sessionStorage si l'URL ne porte pas encore le paramètre
  const selectedServiceId = useMemo(() => {
    if (urlParamService) {
      // Met à jour la sauvegarde temporaire
      try {
        sessionStorage.setItem("cleanpro_selected_service", urlParamService);
      } catch {
        // En cas de navigation privée stricte
      }
      return urlParamService;
    }

    // Si on arrive sans paramètre d'URL (ex: clic sur "Nos Services" dans le menu), on restaure
    try {
      const saved = sessionStorage.getItem("cleanpro_selected_service");
      return saved || null;
    } catch {
      return null;
    }
  }, [urlParamService]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const handleSelectService = (service: ServiceCatalogItem) => {
    try {
      sessionStorage.setItem("cleanpro_selected_service", service.id);
    } catch {
      // Ignorer si indisponible
    }

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("service", service.id);
        return next;
      },
      { replace: true }
    );
  };

  const handleDeselectService = () => {
    try {
      sessionStorage.removeItem("cleanpro_selected_service");
    } catch {
      // Ignorer si indisponible
    }

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("service");
        return next;
      },
      { replace: true }
    );
  };

  const handleCreateService = async (payload: CreateServicePayload): Promise<boolean> => {
    const created = await addServiceItem(payload);
    if (created) {
      handleSelectService(created);
      return true;
    }
    return false;
  };

  // Liste filtrée selon recherche et dropdowns
  const filteredServices = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((item) => {
      // Filtre catégorie
      if (categoryFilter !== "all" && item.id !== categoryFilter) {
        return false;
      }

      // Filtre statut (disponible, indisponible, desactive)
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      // Recherche textuelle
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesPresta = item.prestations.some((p) =>
          p.toLowerCase().includes(query)
        );
        return matchesTitle || matchesDesc || matchesPresta;
      }

      return true;
    });
  }, [data, categoryFilter, statusFilter, searchQuery]);

  // Service actif dans le panneau d'édition (uniquement si un service a été explicitement sélectionné)
  const activeService = useMemo(() => {
    if (!data?.data || !selectedServiceId) return null;
    return data.data.find((s) => s.id === selectedServiceId) ?? null;
  }, [data, selectedServiceId]);

  // Sauvegarde des modifications du service actif
  const handleSaveService = async (updated: Partial<ServiceCatalogItem>) => {
    if (!activeService) return false;
    return await updateServiceItem(activeService.id, updated);
  };

  // 1. État de chargement (Skeletons anti-CLS)
  if (isLoading) {
    return (
      <div className="space-y-6">
        <ServicesCatalogSkeleton />
      </div>
    );
  }

  // 2. État d'erreur avec relance sécurisée
  if (isError || !data) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50/60 p-6 text-center">
        <p className="text-sm font-semibold text-red-700">
          Impossible de charger le catalogue de services CleanPro.
        </p>
        <p className="text-sm text-red-600/80">
          Veuillez vérifier votre connexion ou réessayez dans un instant.
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
      {/* ── Filtres et Barre d'actions d'en-tête ─────────────────── */}
      <Reveal direction="down" delay={50}>
        <ServicesFiltersBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
          selectedStatus={statusFilter}
          onStatusChange={setStatusFilter}
          onAddService={() => setIsAddModalOpen(true)}
        />
      </Reveal>

      {/* ── Modal d'ajout de service (prête pour la BDD) ─────────── */}
      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateService}
      />

      {/* ── Grille principale 2 colonnes (Liste 7/12 + Panneau d'édition 5/12) ── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Colonne Gauche : Cartes des services */}
        <section
          aria-label="Liste des services CleanPro"
          className="space-y-4 xl:col-span-7"
        >
          {filteredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
              <p className="text-sm font-semibold text-slate-600">
                Aucun service ne correspond à votre recherche.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
                className="mt-3 text-sm font-semibold text-[#135d3b] hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            filteredServices.map((service, index) => (
              <Reveal
                key={service.id}
                direction="up"
                delay={index * 80}
              >
                <ServiceCardItem
                  service={service}
                  isSelected={service.id === activeService?.id}
                  onSelect={handleSelectService}
                />
              </Reveal>
            ))
          )}
        </section>

        {/* Colonne Droite : Formulaire d'édition & bloc info référence */}
        <aside
          aria-label="Panneau de modification du service"
          className="xl:col-span-5"
        >
          {activeService ? (
            <Reveal direction="left" delay={150}>
              <ServiceEditPanel
                service={activeService}
                onSave={handleSaveService}
                onCancel={handleDeselectService}
              />
            </Reveal>
          ) : (
            <div className="flex min-h-[380px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-[#15364a]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-bold text-[#15364a]">
                Aucun service sélectionné
              </h3>
              <p className="mt-1.5 max-w-xs text-sm text-slate-500 leading-relaxed">
                Cliquez sur le bouton <span className="font-semibold text-slate-700">« Modifier »</span> ou sur une carte à gauche pour afficher ses détails et éditer ses informations.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
