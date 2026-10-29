import { useState, useEffect, useCallback } from "react";
import {
  dashboardServicesApi,
  type AdminAccountItem,
  type CreateAdminPayload,
  INITIAL_ADMINS_DATA,
} from "../../../../services/dashboardServicesApi";

export interface UseAdminAccountsReturn {
  readonly admins: readonly AdminAccountItem[];
  readonly isLoading: boolean;
  readonly isSubmitting: boolean;
  readonly error: string | null;
  readonly addAdmin: (payload: CreateAdminPayload) => Promise<{ success: boolean; error?: string }>;
  readonly removeAdmin: (id: string) => Promise<{ success: boolean; error?: string }>;
  readonly reloadAdmins: () => void;
}

/**
 * Hook useAdminAccounts — Gestion du cycle de vie des comptes administrateurs (BDD / SessionStorage / Axios)
 */
export function useAdminAccounts(): UseAdminAccountsReturn {
  const [admins, setAdmins] = useState<readonly AdminAccountItem[]>(INITIAL_ADMINS_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await dashboardServicesApi.getAdmins();
        if (!cancelled) {
          setAdmins(data);
        }
      } catch {
        if (!cancelled) {
          setError("Impossible de charger les comptes administrateurs.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    // Synchronisation en direct quand le profil administrateur connecté est modifié
    const handleProfileUpdate = (e: Event) => {
      const custom = e as CustomEvent<{ name?: string; email?: string; avatarUrl?: string }>;
      const detail = custom.detail;
      if (!detail || cancelled) return;

      setAdmins((prev) =>
        prev.map((item) => {
          if (item.isCurrentUser) {
            return {
              ...item,
              name: detail.name ? detail.name.trim() : item.name,
              email: detail.email ? detail.email.trim() : item.email,
              avatarUrl: detail.avatarUrl !== undefined ? detail.avatarUrl : item.avatarUrl,
            };
          }
          return item;
        })
      );
    };

    const handleAvatarUpdate = (e: Event) => {
      const custom = e as CustomEvent<{ avatarUrl?: string }>;
      const newAvatar = custom.detail?.avatarUrl;
      if (cancelled) return;

      setAdmins((prev) =>
        prev.map((item) => {
          if (item.isCurrentUser) {
            return {
              ...item,
              avatarUrl: newAvatar !== undefined ? newAvatar : item.avatarUrl,
            };
          }
          return item;
        })
      );
    };

    const handleAdminsUpdated = () => {
      if (!cancelled) {
        void load();
      }
    };

    window.addEventListener("cleanpro:profile-updated", handleProfileUpdate);
    window.addEventListener("cleanpro:avatar-updated", handleAvatarUpdate);
    window.addEventListener("cleanpro_admins_updated", handleAdminsUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("cleanpro:profile-updated", handleProfileUpdate);
      window.removeEventListener("cleanpro:avatar-updated", handleAvatarUpdate);
      window.removeEventListener("cleanpro_admins_updated", handleAdminsUpdated);
    };
  }, [reloadKey]);

  const reloadAdmins = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  }, []);

  const addAdmin = useCallback(
    async (payload: CreateAdminPayload): Promise<{ success: boolean; error?: string }> => {
      setIsSubmitting(true);
      setError(null);

      // Validation de doublon d'email
      const current = await dashboardServicesApi.getAdmins();
      const emailExists = current.some(
        (a) => a.email.toLowerCase() === payload.email.trim().toLowerCase()
      );

      if (emailExists) {
        setIsSubmitting(false);
        return {
          success: false,
          error: "Un compte administrateur avec cette adresse e-mail existe déjà.",
        };
      }

      try {
        const created = await dashboardServicesApi.createAdmin(payload);
        setAdmins((prev) => [...prev, created]);
        return { success: true };
      } catch {
        return {
          success: false,
          error: "Erreur lors de la création du compte administrateur en BDD.",
        };
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const removeAdmin = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const success = await dashboardServicesApi.deleteAdmin(id);
        if (success) {
          setAdmins((prev) => prev.filter((a) => a.id !== id));
          return { success: true };
        } else {
          return {
            success: false,
            error: "Erreur lors de la suppression du compte administrateur.",
          };
        }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Erreur lors de la suppression.",
        };
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  return {
    admins,
    isLoading,
    isSubmitting,
    error,
    addAdmin,
    removeAdmin,
    reloadAdmins,
  };
}

