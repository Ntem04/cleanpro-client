import { dashboardLogsApi } from "./dashboardLogsApi";
import { apiClient } from "./apiClient";

// ─── Types pour la répartition des services ───────────────────────────────────

export interface ServiceDistributionItem {
  /** Libellé de la catégorie de prestation */
  readonly name: string;
  /** Pourcentage de la catégorie (0–100) */
  readonly percentage: number;
  /** Nombre réel d'interventions calculé ou reçu du backend */
  readonly value: number;
  /** Couleur hexadécimale pour le segment du graphique */
  readonly color: string;
}

export interface ServicesDistributionApiResponse {
  readonly total: number;
  /** Pourcentage d'évolution par rapport au mois dernier (ex: +8%) */
  readonly changePercentage?: number;
  readonly data: readonly ServiceDistributionItem[];
}

// ─── Types pour l'évolution des interventions ─────────────────────────────────

export interface InterventionHistoryPoint {
  readonly date: string;
  readonly interventions: number;
}

export interface InterventionsHistoryApiResponse {
  readonly period: string;
  readonly peak: {
    readonly date: string;
    readonly interventions: number;
  };
  readonly data: readonly InterventionHistoryPoint[];
}

// ─── Types pour les dernières interventions (Tableau) ─────────────────────────

export type InterventionStatus = "Terminée" | "En cours" | "Planifiée";

export interface RecentInterventionItem {
  readonly id: string;
  readonly dateTime: string;
  readonly client: string;
  readonly service: string;
  readonly team: string;
  readonly status: InterventionStatus;
}

export interface RecentInterventionsApiResponse {
  readonly total: number;
  readonly data: readonly RecentInterventionItem[];
}

// ─── Types pour les prochaines interventions (Colonne latérale) ───────────────

export interface UpcomingInterventionItem {
  readonly id: string;
  readonly title: string;
  readonly location: string;
  readonly schedule: string;
  readonly category?: "bureau" | "residence" | "industrie" | "evenement";
}

export interface UpcomingInterventionsApiResponse {
  readonly total: number;
  readonly data: readonly UpcomingInterventionItem[];
}

// ─── Types pour le planning d'interventions ───────────────────────────────────

export interface PlanningSlotItem {
  readonly id: string;
  readonly day: "Mardi 16 septembre" | "Mercredi 17 septembre" | string;
  readonly dateFormatted: string; // ex: "16/09/2025"
  readonly title: string; // ex: "Nettoyage de bureaux"
  readonly location: string; // ex: "Siège social – Yaoundé"
  readonly startTime: string; // ex: "08:00"
  readonly endTime: string; // ex: "12:00"
  readonly team: string; // ex: "À compléter" ou "Équipe Alpha"
  readonly category: "bureau" | "residence" | "industrie" | "evenement";
  readonly colorTheme?: "emerald" | "sky" | "amber";
}

export interface PlanningApiResponse {
  readonly periodLabel: string;
  readonly badgeLabel: string;
  readonly slots: readonly PlanningSlotItem[];
}

export type CreatePlanningSlotPayload = Omit<PlanningSlotItem, "id">;

// ─── Types pour le catalogue Nos Services ────────────────────────────────────

export type ServiceAvailabilityStatus = "disponible" | "indisponible" | "desactive";

export interface ServiceCatalogItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly prestations: readonly string[];
  readonly status: ServiceAvailabilityStatus;
  readonly badgeLabel?: string;
  readonly isSelected?: boolean;
}

export interface ServicesCatalogApiResponse {
  readonly total: number;
  readonly data: readonly ServiceCatalogItem[];
}

export type CreateServicePayload = Omit<ServiceCatalogItem, "id" | "badgeLabel" | "isSelected">;

// ─── Types pour les Paramètres (Settings) ────────────────────────────────────

export interface SettingsProfileData {
  readonly name: string;
  readonly role: string;
  readonly email: string;
  readonly avatarUrl?: string;
}

export interface SettingsCompanyData {
  readonly name: string;
  readonly signature: string;
  readonly logoUrl?: string;
}

export interface SettingsContactData {
  readonly phone: string;
  readonly whatsapp: string;
  readonly email: string;
  readonly address: string;
  readonly officeNote: string;
}

export interface SettingsOpeningHoursData {
  readonly weekdays: string;
  readonly saturday: string;
  readonly sunday: string;
  readonly visitors: string;
}

export interface SettingsNotificationPreferencesData {
  readonly interventions: string;
  readonly clientMessages: string;
  readonly reports: string;
}

export interface SettingsApiResponse {
  readonly profile: SettingsProfileData;
  readonly company: SettingsCompanyData;
  readonly contact: SettingsContactData;
  readonly openingHours: SettingsOpeningHoursData;
  readonly notifications: SettingsNotificationPreferencesData;
}

export type UpdateSettingsPayload = {
  readonly profile?: Partial<SettingsProfileData>;
  readonly company?: Partial<SettingsCompanyData>;
  readonly contact?: Partial<SettingsContactData>;
  readonly openingHours?: Partial<SettingsOpeningHoursData>;
  readonly notifications?: Partial<SettingsNotificationPreferencesData>;
};

// ─── Types pour la Gestion des Comptes Administrateurs ───────────────────────

export interface AdminAccountItem {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: "Super Administrateur" | "Administrateur" | "Responsable d'agence" | string;
  readonly avatarUrl?: string;
  readonly createdAt: string;
  readonly isCurrentUser?: boolean;
}

export type CreateAdminPayload = Omit<AdminAccountItem, "id" | "createdAt" | "isCurrentUser"> & {
  readonly password?: string;
};

// ─── Service API (Axios prêt pour le branchement backend) ─────────────────────

export const dashboardServicesApi = {
  /**
   * Récupère le planning des interventions pour une semaine donnée.
   * Endpoint prévu : GET /dashboard/planning?week=2025-W38
   */
  async getPlanning(_week?: string): Promise<PlanningApiResponse> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: {
          periodLabel: string;
          badgeLabel: string;
          slots: PlanningSlotItem[];
        };
      }>("/dashboard/planning");

      if (response.data?.success && response.data?.data) {
        const payload = response.data.data;
        const slots = Array.isArray(payload.slots) ? payload.slots : [];
        const result: PlanningApiResponse = {
          periodLabel: payload.periodLabel || "Semaine en cours",
          badgeLabel: payload.badgeLabel || `${slots.length} intervention${slots.length > 1 ? "s" : ""}`,
          slots,
        };
        try {
          sessionStorage.setItem("cleanpro_planning_slots_v2", JSON.stringify(slots));
        } catch {
          // Mode restreint
        }
        return result;
      }
    } catch {
      // Fallback résilient en cas de déconnexion réseau temporaire (CWE-755)
    }

    try {
      const stored = sessionStorage.getItem("cleanpro_planning_slots_v2");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return {
            ...INITIAL_PLANNING_DATA,
            badgeLabel: `${parsed.length} intervention${parsed.length > 1 ? "s" : ""}`,
            slots: parsed,
          };
        }
      }
    } catch {
      // Ignorer
    }

    return INITIAL_PLANNING_DATA;
  },

  /**
   * Crée un nouveau créneau d'intervention dans le planning (PostgreSQL via API Express).
   */
  async createPlanningSlot(payload: CreatePlanningSlotPayload): Promise<PlanningSlotItem> {
    let createdSlot: PlanningSlotItem | null = null;

    try {
      const response = await apiClient.post<{
        success: boolean;
        data: PlanningSlotItem;
      }>("/dashboard/planning", payload);

      if (response.data?.success && response.data?.data) {
        createdSlot = response.data.data;
      }
    } catch {
      // Fallback local résilient
    }

    if (!createdSlot) {
      createdSlot = {
        id: `slot-${Date.now()}`,
        ...payload,
      };
    }

    try {
      const stored = sessionStorage.getItem("cleanpro_planning_slots_v2");
      const currentSlots = stored ? (JSON.parse(stored) as PlanningSlotItem[]) : [];
      const nextSlots = Array.isArray(currentSlots) ? [...currentSlots, createdSlot] : [createdSlot];
      sessionStorage.setItem("cleanpro_planning_slots_v2", JSON.stringify(nextSlots));
    } catch {
      // Ignorer
    }

    // Notification globale pour les cartes de l'Overview et du Planning
    window.dispatchEvent(new CustomEvent("cleanpro_planning_updated", { detail: createdSlot }));

    // Journal d'audit automatique
    void dashboardLogsApi.recordAuditLog({
      category: "content",
      action: "Planification d'une intervention",
      target: createdSlot.title,
      result: "success",
      details: `Nouvelle intervention planifiée pour le ${createdSlot.day} à ${createdSlot.location} (${createdSlot.startTime}–${createdSlot.endTime}).`,
    });

    return createdSlot;
  },

  /**
   * Met à jour un créneau d'intervention du planning dans PostgreSQL.
   */
  async updatePlanningSlot(
    id: string,
    payload: Partial<Omit<PlanningSlotItem, "id">>
  ): Promise<PlanningSlotItem> {
    let updatedSlot: PlanningSlotItem | null = null;

    try {
      const response = await apiClient.put<{
        success: boolean;
        data: PlanningSlotItem;
      }>(`/dashboard/planning/${id}`, payload);

      if (response.data?.success && response.data?.data) {
        updatedSlot = response.data.data;
      }
    } catch {
      // Fallback local
    }

    if (!updatedSlot) {
      const current = await this.getPlanning();
      const existing = current.slots.find((s) => s.id === id);
      if (!existing) {
        throw new Error(`Créneau introuvable: ${id}`);
      }
      updatedSlot = { ...existing, ...payload };
    }

    try {
      const stored = sessionStorage.getItem("cleanpro_planning_slots_v2");
      const currentSlots = stored ? (JSON.parse(stored) as PlanningSlotItem[]) : [];
      if (Array.isArray(currentSlots)) {
        const nextSlots = currentSlots.map((s) => (s.id === id ? updatedSlot! : s));
        sessionStorage.setItem("cleanpro_planning_slots_v2", JSON.stringify(nextSlots));
      }
    } catch {
      // Ignorer
    }

    window.dispatchEvent(new CustomEvent("cleanpro_planning_updated", { detail: updatedSlot }));

    void dashboardLogsApi.recordAuditLog({
      category: "content",
      action: "Modification d'une intervention",
      target: updatedSlot.title,
      result: "success",
      details: `Intervention modifiée : ${updatedSlot.title} (${updatedSlot.startTime}–${updatedSlot.endTime}).`,
    });

    return updatedSlot;
  },

  /**
   * Supprime un créneau d'intervention du planning dans PostgreSQL.
   */
  async deletePlanningSlot(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/dashboard/planning/${id}`);
    } catch {
      // Fallback local
    }

    try {
      const current = await this.getPlanning();
      const target = current.slots.find((s) => s.id === id);
      const nextSlots = current.slots.filter((s) => s.id !== id);
      sessionStorage.setItem("cleanpro_planning_slots_v2", JSON.stringify(nextSlots));

      window.dispatchEvent(new CustomEvent("cleanpro_planning_updated", { detail: { id } }));

      if (target) {
        void dashboardLogsApi.recordAuditLog({
          category: "content",
          action: "Annulation d'une intervention",
          target: target.title,
          result: "success",
          details: `Intervention ${target.title} annulée et retirée du planning.`,
        });
      }
    } catch {
      // Ignorer si indisponible
    }

    return true;
  },

  /**
   * Récupère le catalogue complet des services depuis PostgreSQL.
   */
  async getCatalog(): Promise<ServicesCatalogApiResponse> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: {
          total: number;
          data: ServiceCatalogItem[];
        };
      }>("/services");

      if (response.data?.success && response.data?.data) {
        const payload = response.data.data;
        const list = Array.isArray(payload.data) ? payload.data : [];
        const result: ServicesCatalogApiResponse = {
          total: payload.total ?? list.length,
          data: list,
        };
        try {
          sessionStorage.setItem("cleanpro_services_catalog_v2", JSON.stringify(list));
        } catch {
          // Ignorer
        }
        return result;
      }
    } catch {
      // Fallback local résilient
    }

    try {
      const stored = sessionStorage.getItem("cleanpro_services_catalog_v2");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return {
            total: parsed.length,
            data: parsed as readonly ServiceCatalogItem[],
          };
        }
      }
    } catch {
      // Ignorer
    }

    return INITIAL_SERVICES_CATALOG_DATA;
  },

  /**
   * Crée un nouveau service dans PostgreSQL.
   */
  async createService(payload: CreateServicePayload): Promise<ServiceCatalogItem> {
    let createdService: ServiceCatalogItem | null = null;

    try {
      const response = await apiClient.post<{
        success: boolean;
        data: ServiceCatalogItem;
      }>("/services", payload);

      if (response.data?.success && response.data?.data) {
        createdService = response.data.data;
      }
    } catch {
      // Fallback local
    }

    if (!createdService) {
      const newId = payload.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 30) || `service-${Date.now()}`;

      createdService = {
        id: newId,
        title: payload.title,
        description: payload.description,
        image: payload.image || "services-bureaux0",
        prestations: payload.prestations,
        status: payload.status,
        badgeLabel: payload.status === "disponible" ? "Disponible" : payload.status === "indisponible" ? "Indisponible" : "Désactivé (Maintenance)",
        isSelected: false,
      };
    }

    try {
      const current = await this.getCatalog();
      const nextList = [createdService, ...current.data];
      sessionStorage.setItem("cleanpro_services_catalog_v2", JSON.stringify(nextList));
    } catch {
      // Ignorer si indisponible
    }

    window.dispatchEvent(new CustomEvent("cleanpro_services_updated", { detail: createdService }));

    void dashboardLogsApi.recordAuditLog({
      category: "content",
      action: "Création d'un nouveau service",
      target: createdService.title,
      result: "success",
      details: `Service « ${createdService.title} » ajouté au catalogue PostgreSQL et dashboard.`,
    });

    return createdService;
  },

  /**
   * Met à jour un service existant dans PostgreSQL.
   */
  async updateService(
    id: string,
    payload: Partial<Omit<ServiceCatalogItem, "id">>
  ): Promise<ServiceCatalogItem> {
    let updatedService: ServiceCatalogItem | null = null;

    try {
      const response = await apiClient.put<{
        success: boolean;
        data: ServiceCatalogItem;
      }>(`/services/${id}`, payload);

      if (response.data?.success && response.data?.data) {
        updatedService = response.data.data;
      }
    } catch {
      // Fallback local
    }

    if (!updatedService) {
      const current = await this.getCatalog();
      const existing = current.data.find((s) => s.id === id);
      if (!existing) {
        throw new Error(`Service introuvable: ${id}`);
      }
      updatedService = { ...existing, ...payload };
    }

    try {
      const current = await this.getCatalog();
      const nextList = current.data.map((s) => (s.id === id ? updatedService! : s));
      sessionStorage.setItem("cleanpro_services_catalog_v2", JSON.stringify(nextList));
    } catch {
      // Ignorer si indisponible
    }

    window.dispatchEvent(new CustomEvent("cleanpro_services_updated", { detail: updatedService }));

    void dashboardLogsApi.recordAuditLog({
      category: "content",
      action: "Modification d'un service",
      target: updatedService.title,
      result: "success",
      details: `Mise à jour des informations pour le service « ${updatedService.title} » dans PostgreSQL.`,
    });

    return updatedService;
  },

  /**
   * Supprime un service du catalogue PostgreSQL.
   */
  async deleteService(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/services/${id}`);
    } catch {
      // Fallback local
    }

    try {
      const current = await this.getCatalog();
      const target = current.data.find((s) => s.id === id);
      const nextList = current.data.filter((s) => s.id !== id);
      sessionStorage.setItem("cleanpro_services_catalog_v2", JSON.stringify(nextList));

      window.dispatchEvent(new CustomEvent("cleanpro_services_updated", { detail: { id } }));

      if (target) {
        void dashboardLogsApi.recordAuditLog({
          category: "content",
          action: "Suppression d'un service",
          target: target.title,
          result: "success",
          details: `Service « ${target.title} » retiré du catalogue PostgreSQL.`,
        });
      }
    } catch {
      // Ignorer si indisponible
    }

    return true;
  },

  /**
   * Récupère la répartition réelle des services synchronisée avec les interventions du planning.
   * Endpoint prévu : GET /dashboard/services/distribution
   */
  async getDistribution(): Promise<ServicesDistributionApiResponse> {
    const planning = await this.getPlanning();
    const slots = Array.isArray(planning?.slots) ? planning.slots : [];

    if (slots.length === 0) {
      return INITIAL_DISTRIBUTION_DATA;
    }

    const total = slots.length;
    const bureauCount = slots.filter((s) => s.category === "bureau").length;
    const residenceCount = slots.filter((s) => s.category === "residence").length;
    const industrieCount = slots.filter((s) => s.category === "industrie").length;
    const evenementCount = slots.filter((s) => s.category === "evenement").length;
    const otherCount = Math.max(0, total - (bureauCount + residenceCount + industrieCount + evenementCount));

    return {
      total,
      changePercentage: 0,
      data: [
        {
          name: "Bureaux & Espaces pro",
          percentage: total > 0 ? Math.round((bureauCount / total) * 100) : 0,
          value: bureauCount,
          color: "#137547",
        },
        {
          name: "Résidences & Appartements",
          percentage: total > 0 ? Math.round((residenceCount / total) * 100) : 0,
          value: residenceCount,
          color: "#2ecc8e",
        },
        {
          name: "Industries & Entrepôts",
          percentage: total > 0 ? Math.round((industrieCount / total) * 100) : 0,
          value: industrieCount,
          color: "#3b82f6",
        },
        {
          name: "Espaces publics & Événements",
          percentage: total > 0 ? Math.round((evenementCount / total) * 100) : 0,
          value: evenementCount,
          color: "#f5b738",
        },
        {
          name: "Autres",
          percentage: total > 0 ? Math.round((otherCount / total) * 100) : 0,
          value: otherCount,
          color: "#c4b5fd",
        },
      ],
    };
  },

  /**
   * Récupère l'historique d'évolution calculé dynamiquement depuis les interventions réelles.
   * Endpoint prévu : GET /dashboard/interventions/evolution?days=7
   */
  async getInterventionsEvolution(_days: number = 7): Promise<InterventionsHistoryApiResponse> {
    const planning = await this.getPlanning();
    const slots = Array.isArray(planning?.slots) ? planning.slots : [];

    if (slots.length === 0) {
      return INITIAL_EVOLUTION_DATA;
    }

    const dayCounts: Record<string, number> = {
      Lun: 0,
      Mar: 0,
      Mer: 0,
      Jeu: 0,
      Ven: 0,
      Sam: 0,
      Dim: 0,
    };

    slots.forEach((s) => {
      const dayLower = (s?.day || "").toLowerCase();
      if (dayLower.includes("lun")) dayCounts["Lun"]++;
      else if (dayLower.includes("mar")) dayCounts["Mar"]++;
      else if (dayLower.includes("mer")) dayCounts["Mer"]++;
      else if (dayLower.includes("jeu")) dayCounts["Jeu"]++;
      else if (dayLower.includes("ven")) dayCounts["Ven"]++;
      else if (dayLower.includes("sam")) dayCounts["Sam"]++;
      else if (dayLower.includes("dim")) dayCounts["Dim"]++;
      else dayCounts["Lun"]++;
    });

    const points = Object.entries(dayCounts).map(([date, interventions]) => ({
      date,
      interventions,
    }));

    const maxPoint = points.reduce(
      (max, p) => (p.interventions > max.interventions ? p : max),
      { date: "--", interventions: 0 }
    );

    return {
      period: planning.periodLabel || "Période en cours",
      peak: maxPoint || { date: "--", interventions: 0 },
      data: points,
    };
  },

  /**
   * Récupère les dernières interventions dynamiquement synchronisées avec le planning.
   * Endpoint prévu : GET /dashboard/interventions/recent
   */
  async getRecentInterventions(): Promise<RecentInterventionsApiResponse> {
    const planning = await this.getPlanning();
    const slots = Array.isArray(planning?.slots) ? planning.slots : [];

    if (slots.length === 0) {
      return INITIAL_RECENT_INTERVENTIONS_DATA;
    }

    const categoryLabels: Record<string, string> = {
      bureau: "Bureaux & Espaces pro",
      residence: "Résidences & Appartements",
      industrie: "Industries & Entrepôts",
      evenement: "Espaces publics & Événements",
    };

    const mapped: RecentInterventionItem[] = slots.map((s) => ({
      id: s.id,
      client: s.location || "Client CleanPro",
      service: s.title || categoryLabels[s.category] || "Nettoyage professionnel",
      dateTime: `${s.dateFormatted || s.day} à ${s.startTime}`,
      team: s.team || "Équipe CleanPro",
      status: "Planifiée" as const,
    }));

    return {
      total: mapped.length,
      data: mapped,
    };
  },

  /**
   * Récupère les prochaines interventions synchronisées avec le planning d'interventions.
   * Endpoint prévu : GET /dashboard/interventions/upcoming
   */
  async getUpcomingInterventions(): Promise<UpcomingInterventionsApiResponse> {
    const planning = await this.getPlanning();
    const slots = Array.isArray(planning?.slots) ? planning.slots : [];

    if (slots.length === 0) {
      return INITIAL_UPCOMING_INTERVENTIONS_DATA;
    }

    const mapped: UpcomingInterventionItem[] = slots.map((s) => ({
      id: s.id,
      title: s.title,
      location: s.location,
      schedule: `${s.day} (${s.startTime} - ${s.endTime})`,
      category: s.category,
    }));

    return {
      total: mapped.length,
      data: mapped,
    };
  },

  /**
   * Récupère les paramètres complets du dashboard (profil, entreprise, coordonnées, horaires, notifications).
   * Endpoint prévu : GET /dashboard/settings
   */
  async getSettings(): Promise<SettingsApiResponse> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: SettingsApiResponse;
      }>("/settings");

      if (response.data?.success && response.data?.data) {
        const result = response.data.data;
        try {
          localStorage.setItem("cleanpro_dashboard_settings", JSON.stringify(result));
          sessionStorage.setItem("cleanpro_dashboard_settings", JSON.stringify(result));
        } catch {
          // Ignorer
        }
        return result;
      }
    } catch {
      // Fallback local résilient
    }

    try {
      const stored =
        localStorage.getItem("cleanpro_dashboard_settings") ||
        sessionStorage.getItem("cleanpro_dashboard_settings");
      if (stored) {
        return JSON.parse(stored) as SettingsApiResponse;
      }
    } catch {
      // Ignorer si stockage indisponible
    }

    return INITIAL_SETTINGS_DATA;
  },

  /**
   * Met à jour les paramètres du dashboard dans PostgreSQL via l'API.
   */
  async updateSettings(payload: UpdateSettingsPayload): Promise<SettingsApiResponse> {
    let updated: SettingsApiResponse | null = null;

    try {
      const response = await apiClient.put<{
        success: boolean;
        data: SettingsApiResponse;
      }>("/settings", payload);

      if (response.data?.success && response.data?.data) {
        updated = response.data.data;
      }
    } catch {
      // Fallback local en cas de coupure réseau
    }

    if (!updated) {
      const current = await this.getSettings();
      updated = {
        profile: { ...current.profile, ...(payload.profile || {}) },
        company: { ...current.company, ...(payload.company || {}) },
        contact: { ...current.contact, ...(payload.contact || {}) },
        openingHours: { ...current.openingHours, ...(payload.openingHours || {}) },
        notifications: { ...current.notifications, ...(payload.notifications || {}) },
      };
    }

    try {
      localStorage.setItem("cleanpro_dashboard_settings", JSON.stringify(updated));
      sessionStorage.setItem("cleanpro_dashboard_settings", JSON.stringify(updated));
    } catch {
      // Ignorer si stockage indisponible
    }

    // Diffusion de l'événement global pour synchroniser Header, Footer, TopBar, Sidebar
    window.dispatchEvent(new CustomEvent("cleanpro_settings_updated", { detail: updated }));

    if (payload.profile) {
      window.dispatchEvent(
        new CustomEvent("cleanpro:profile-updated", {
          detail: payload.profile,
        })
      );
    }

    if (payload.profile?.avatarUrl !== undefined) {
      window.dispatchEvent(
        new CustomEvent("cleanpro:avatar-updated", {
          detail: { avatarUrl: payload.profile.avatarUrl },
        })
      );
    }

    void dashboardLogsApi.recordAuditLog({
      category: "content",
      action: "Mise à jour des coordonnées et paramètres",
      target: updated.company.name,
      result: "success",
      details: `Coordonnées modifiées (Nom admin: ${updated.profile.name}, Téléphone: ${updated.contact.phone}).`,
    });

    return updated;
  },

  /**
   * Récupère la liste des comptes administrateurs depuis PostgreSQL ou le stockage local synchronisé.
   * Endpoint : GET /auth/admins
   */
  async getAdmins(): Promise<readonly AdminAccountItem[]> {
    // Récupération du profil actuel pour synchronisation en direct
    let currentUserProfile: { name?: string; email?: string; avatarUrl?: string; role?: string } | null = null;
    try {
      const userRaw = localStorage.getItem("cleanpro_user");
      if (userRaw) currentUserProfile = JSON.parse(userRaw);
    } catch {
      // Ignore
    }

    try {
      const response = await apiClient.get<any>("/auth/admins");
      const list = response.data?.data || response.data;
      if (Array.isArray(list) && list.length > 0) {
        const synced = list.map((a: any) => {
          if (a.isCurrentUser && currentUserProfile) {
            return {
              ...a,
              name: currentUserProfile.name || a.name,
              avatarUrl: currentUserProfile.avatarUrl !== undefined ? currentUserProfile.avatarUrl : a.avatarUrl,
            };
          }
          return a;
        });
        try {
          localStorage.setItem("cleanpro_dashboard_admins", JSON.stringify(synced));
        } catch {
          // Ignore
        }
        return synced as readonly AdminAccountItem[];
      }
    } catch {
      // Tolérance fail-safe
    }

    try {
      const stored = localStorage.getItem("cleanpro_dashboard_admins") || sessionStorage.getItem("cleanpro_dashboard_admins");
      if (stored) {
        const parsed = JSON.parse(stored) as AdminAccountItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((a) => {
            if (a.isCurrentUser && currentUserProfile) {
              return {
                ...a,
                name: currentUserProfile.name || a.name,
                avatarUrl: currentUserProfile.avatarUrl !== undefined ? currentUserProfile.avatarUrl : a.avatarUrl,
              };
            }
            return a;
          });
        }
      }
    } catch {
      // Ignore
    }

    return INITIAL_ADMINS_DATA.map((a) => {
      if (a.isCurrentUser && currentUserProfile) {
        return {
          ...a,
          name: currentUserProfile.name || a.name,
          email: currentUserProfile.email || a.email,
          avatarUrl: currentUserProfile.avatarUrl || a.avatarUrl,
        };
      }
      return a;
    });
  },

  /**
   * Crée un nouveau compte administrateur dans PostgreSQL.
   * Endpoint : POST /auth/admins
   */
  async createAdmin(payload: CreateAdminPayload): Promise<AdminAccountItem> {
    try {
      const response = await apiClient.post<any>("/auth/admins", {
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        role: payload.role,
        password: payload.password,
        avatarUrl: payload.avatarUrl || "",
      });
      const created = response.data?.data || response.data;
      if (created && created.id) {
        const current = await this.getAdmins();
        const nextList = [...current, created];
        try {
          localStorage.setItem("cleanpro_dashboard_admins", JSON.stringify(nextList));
        } catch {
          // Ignore
        }
        window.dispatchEvent(new CustomEvent("cleanpro_admins_updated", { detail: created }));
        return created as AdminAccountItem;
      }
    } catch {
      // Fallback local fail-safe
    }

    const current = await this.getAdmins();
    const newAdmin: AdminAccountItem = {
      id: `admin-${Date.now()}`,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      role: payload.role,
      avatarUrl: payload.avatarUrl || "",
      createdAt: new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date()),
      isCurrentUser: false,
    };

    const nextList = [...current, newAdmin];
    try {
      localStorage.setItem("cleanpro_dashboard_admins", JSON.stringify(nextList));
    } catch {
      // Ignorer si indisponible
    }

    window.dispatchEvent(new CustomEvent("cleanpro_admins_updated", { detail: newAdmin }));

    void dashboardLogsApi.recordAuditLog({
      category: "security",
      action: "Création d'un compte administrateur",
      target: newAdmin.email,
      result: "success",
      details: `Compte créé pour ${newAdmin.name} avec le rôle ${newAdmin.role}.`,
    });

    return newAdmin;
  },

  /**
   * Supprime un compte administrateur dans PostgreSQL.
   * Endpoint : DELETE /auth/admins/:id
   */
  async deleteAdmin(id: string): Promise<boolean> {
    try {
      const current = await this.getAdmins();
      const target = current.find((a) => a.id === id);
      if (target?.isCurrentUser) {
        throw new Error("Impossible de supprimer le compte administrateur principal connecté.");
      }

      try {
        await apiClient.delete(`/auth/admins/${id}`);
      } catch {
        // Fallback local
      }

      const nextList = current.filter((a) => a.id !== id);
      try {
        localStorage.setItem("cleanpro_dashboard_admins", JSON.stringify(nextList));
      } catch {
        // Ignore
      }

      window.dispatchEvent(new CustomEvent("cleanpro_admins_updated", { detail: { id } }));

      if (target) {
        void dashboardLogsApi.recordAuditLog({
          category: "security",
          action: "Suppression d'un compte administrateur",
          target: target.email,
          result: "success",
          details: `Compte administrateur ${target.name} (${target.email}) supprimé.`,
        });
      }

      return true;
    } catch {
      return false;
    }
  },
};

// ─── Données initiales du catalogue de référence (fidèles à la capture) ───────

export const INITIAL_SERVICES_CATALOG_DATA: ServicesCatalogApiResponse = Object.freeze({
  total: 4,
  data: Object.freeze([
    {
      id: "bureaux",
      title: "Bureaux & Espaces professionnels",
      description:
        "Nous assurons le nettoyage quotidien ou ponctuel de vos bureaux, salles de réunion et espaces de travail, afin de garantir un environnement propre, sain et agréable pour vos équipes et vos visiteurs.",
      image: "services-bureaux0",
      prestations: Object.freeze([
        "Bureaux, open spaces, salles de réunion",
        "Désinfection des surfaces",
        "Gestion des déchets",
      ]),
      status: "disponible" as const,
      badgeLabel: "Disponible",
      isSelected: false,
    },
    {
      id: "residences",
      title: "Résidences & Appartements",
      description:
        "Nous prenons soin de votre intérieur avec des prestations de nettoyage complètes et personnalisées, pour un cadre de vie propre et agréable.",
      image: "services-residences",
      prestations: Object.freeze([
        "Ménage régulier ou ponctuel",
        "Nettoyage en profondeur",
        "Lavage des vitres",
      ]),
      status: "disponible" as const,
      badgeLabel: "Disponible",
      isSelected: false,
    },
    {
      id: "industries",
      title: "Industries & Entrepôts",
      description:
        "Nous intervenons dans les environnements industriels et logistiques pour un nettoyage en profondeur, sécurisé et conforme aux normes de sécurité.",
      image: "industriesImage",
      prestations: Object.freeze([
        "Grands espaces et zones de stockage",
        "Équipements industriels",
        "Nettoyage haute pression",
      ]),
      status: "disponible" as const,
      badgeLabel: "Disponible",
      isSelected: false,
    },
    {
      id: "espaces-publics",
      title: "Espaces publics & Événements",
      description:
        "Nous intervenons dans les lieux publics et lors de vos événements pour garantir un espace propre, accueillant et sécurisé pour tous.",
      image: "services-publics",
      prestations: Object.freeze([
        "Centres commerciaux",
        "Événements professionnels et privés",
        "Nettoyage après événement",
      ]),
      status: "disponible" as const,
      badgeLabel: "Disponible",
      isSelected: false,
    },
  ]),
});

// ─── Données initialisées à zéro / prêtes pour Axios ──────────────────────────

const INITIAL_DISTRIBUTION_DATA: ServicesDistributionApiResponse = Object.freeze({
  total: 0,
  changePercentage: 0,
  data: Object.freeze([
    {
      name: "Bureaux & Espaces pro",
      percentage: 0,
      value: 0,
      color: "#137547",
    },
    {
      name: "Résidences & Appartements",
      percentage: 0,
      value: 0,
      color: "#2ecc8e",
    },
    {
      name: "Industries & Entrepôts",
      percentage: 0,
      value: 0,
      color: "#3b82f6",
    },
    {
      name: "Espaces publics & Événements",
      percentage: 0,
      value: 0,
      color: "#f5b738",
    },
    {
      name: "Autres",
      percentage: 0,
      value: 0,
      color: "#c4b5fd",
    },
  ]),
});

const INITIAL_EVOLUTION_DATA: InterventionsHistoryApiResponse = Object.freeze({
  period: "Période en cours",
  peak: {
    date: "--",
    interventions: 0,
  },
  data: Object.freeze([
    { date: "Lun", interventions: 0 },
    { date: "Mar", interventions: 0 },
    { date: "Mer", interventions: 0 },
    { date: "Jeu", interventions: 0 },
    { date: "Ven", interventions: 0 },
    { date: "Sam", interventions: 0 },
    { date: "Dim", interventions: 0 },
  ]),
});

// Tableau "Dernières interventions" initialisé vide, prêt pour Axios
const INITIAL_RECENT_INTERVENTIONS_DATA: RecentInterventionsApiResponse = Object.freeze({
  total: 0,
  data: Object.freeze([]),
});

// Carte "Prochaines interventions" initialisée vide, prête pour Axios
const INITIAL_UPCOMING_INTERVENTIONS_DATA: UpcomingInterventionsApiResponse = Object.freeze({
  total: 0,
  data: Object.freeze([]),
});

// ─── Données initiales du planning (initialisé vierge / 0 intervention, prêt pour BDD) ──────
export const INITIAL_PLANNING_DATA: PlanningApiResponse = Object.freeze({
  periodLabel: "Semaine en cours",
  badgeLabel: "0 intervention",
  slots: Object.freeze([]),
});

// ─── Données initiales des paramètres (fidèles à la capture) ─────────────────
export const INITIAL_SETTINGS_DATA: SettingsApiResponse = Object.freeze({
  profile: Object.freeze({
    name: "Amina Diallo",
    role: "Responsable d'agence",
    email: "À compléter",
    avatarUrl: "",
  }),
  company: Object.freeze({
    name: "CleanPro",
    signature: "Services de Nettoyage",
    logoUrl: "",
  }),
  contact: Object.freeze({
    phone: "+237678123456",
    whatsapp: "+237678123456",
    email: "contact@cleanpro.cm",
    address: "Avenue de la Paix, Yaoundé Cameroun",
    officeNote: "Nos bureaux sont ouverts sur rendez-vous.",
  }),
  openingHours: Object.freeze({
    weekdays: "8h00–17h00",
    saturday: "8h00–12h00",
    sunday: "Fermé",
    visitors: "Sur rendez-vous",
  }),
  notifications: Object.freeze({
    interventions: "Non renseigné",
    clientMessages: "Non renseigné",
    reports: "Non renseigné",
  }),
});

// ─── Données initiales des comptes administrateurs ───────────────────────────
export const INITIAL_ADMINS_DATA: readonly AdminAccountItem[] = Object.freeze([
  {
    id: "admin-amina-1",
    name: "Amina Diallo",
    email: "amina.diallo@cleanpro.cm",
    role: "Responsable d'agence",
    avatarUrl: "",
    createdAt: "15/01/2025",
    isCurrentUser: true,
  },
]);



