import apiClient, { type ApiErrorResponse } from "./apiClient";
import { dashboardLogsApi } from "./dashboardLogsApi";

export interface LoginPayload {
  readonly identifier: string;
  readonly password: string;
}

export interface UserProfile {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: "client" | "admin" | "agent";
  readonly avatarUrl?: string;
}

export interface AuthResponse {
  readonly success: boolean;
  readonly message: string;
  readonly data?: {
    readonly user?: UserProfile;
    readonly token?: string;
  };
  readonly user?: UserProfile;
}

/**
 * Service d'authentification pour la gestion de session et la connexion avec l'API.
 */
export const authService = {
  /**
   * Transmet les identifiants de connexion vers l'endpoint /auth/login.
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", payload);
      const user = response.data?.data?.user || response.data?.user;

      if (user) {
        try {
          localStorage.setItem("cleanpro_user", JSON.stringify(user));
        } catch {
          // Ignore
        }
      }

      void dashboardLogsApi.recordAuditLog({
        category: "security",
        action: "Connexion réussie",
        target: payload.identifier,
        result: "success",
        user: payload.identifier,
        userEmail: payload.identifier.includes("@") ? payload.identifier : undefined,
        details: `Connexion administrateur réussie pour ${payload.identifier}.`,
      });

      return {
        success: response.data.success,
        message: response.data.message,
        user,
        data: response.data.data,
      };
    } catch (error) {
      void dashboardLogsApi.recordAuditLog({
        category: "security",
        action: "Échec de connexion",
        target: payload.identifier,
        result: "failure",
        user: payload.identifier,
        userEmail: payload.identifier.includes("@") ? payload.identifier : undefined,
        details: `Tentative d'accès refusée ou identifiants erronés pour ${payload.identifier}.`,
        level: "warning",
      });
      throw error as ApiErrorResponse;
    }
  },

  /**
   * Termine la session courante côté serveur et invalide les cookies HttpOnly.
   */
  async logout(): Promise<void> {
    void dashboardLogsApi.recordAuditLog({
      category: "security",
      action: "Déconnexion",
      target: "Session active",
      result: "success",
      details: "Déconnexion volontaire de l'espace administrateur.",
    });

    try {
      localStorage.removeItem("cleanpro_user");
    } catch {
      // Ignore
    }

    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      throw error as ApiErrorResponse;
    }
  },

  /**
   * Récupère le profil de l'utilisateur authentifié depuis la BDD (GET /auth/me).
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<any>("/auth/me");
      const userProfile = response.data?.data || response.data?.user || response.data;
      if (userProfile && userProfile.id) {
        try {
          localStorage.setItem("cleanpro_user", JSON.stringify(userProfile));
        } catch {
          // Ignore
        }
        return userProfile as UserProfile;
      }
      throw new Error("Profil utilisateur invalide.");
    } catch (error) {
      try {
        localStorage.removeItem("cleanpro_user");
      } catch {
        // Ignore
      }
      throw error as ApiErrorResponse;
    }
  },

  /**
   * Met à jour la photo de profil / avatar de l'administrateur dans la BDD.
   * Endpoint prévu : PATCH /auth/avatar
   */
  async updateAvatar(avatarUrl: string): Promise<UserProfile> {
    try {
      const response = await apiClient.patch<UserProfile>("/auth/avatar", {
        avatarUrl,
      });
      return response.data;
    } catch (error) {
      throw error as ApiErrorResponse;
    }
  },

  /**
   * Met à jour le profil (nom, avatar) de l'administrateur dans la BDD (PATCH /auth/profile).
   */
  async updateProfile(payload: { name?: string; avatarUrl?: string }): Promise<UserProfile> {
    try {
      const response = await apiClient.patch<any>("/auth/profile", payload);
      const updated = response.data?.data || response.data?.user || response.data;
      if (updated) {
        try {
          const current = localStorage.getItem("cleanpro_user");
          const merged = current ? { ...JSON.parse(current), ...updated } : updated;
          localStorage.setItem("cleanpro_user", JSON.stringify(merged));
        } catch {
          // Ignore
        }
      }
      return updated as UserProfile;
    } catch (error) {
      throw error as ApiErrorResponse;
    }
  },
};
