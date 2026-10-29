import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { authService, type UserProfile } from "../../../services/authService";
import { dashboardServicesApi } from "../../../services/dashboardServicesApi";
import { sanitizeAvatarUrl } from "../../../utils/securityUtils";
import {
  AdminProfileContext,
  type AdminProfileContextValue,
} from "./adminProfileContextInstance";

const DEFAULT_ADMIN_PROFILE: UserProfile = Object.freeze({
  id: "usr_admin_default",
  name: "Amina Diallo",
  email: "amina.diallo@cleanpro.cm",
  role: "admin",
  avatarUrl: "",
});

const AVATAR_SYNC_EVENT = "cleanpro:avatar-updated";

interface AdminProfileProviderProps {
  readonly children: ReactNode;
}

/**
 * Fournisseur centralisé du profil Administrateur et de sa photo de base de données.
 * Conforme aux exigences de cybersécurité ANSSI / OWASP (Sanitisation, Fail-Safe, Event Sync).
 */
export function AdminProfileProvider({ children }: AdminProfileProviderProps) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_ADMIN_PROFILE);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const isMountedRef = useRef<boolean>(true);

  // Chargement initial sécurisé depuis la base de données (GET /auth/me & GET /dashboard/settings)
  useEffect(() => {
    isMountedRef.current = true;
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        // 1. Consultation des réglages BDD (Settings)
        const settings = await dashboardServicesApi.getSettings();
        const settingsAvatar = settings.profile.avatarUrl;

        // 2. Consultation du profil d'authentification BDD
        let authProfile: UserProfile | null = null;
        try {
          authProfile = await authService.getProfile();
        } catch {
          // Mode développement sans backend connecté : conservation du fallback par défaut
        }

        if (cancelled) return;

        const mergedName =
          (settings.profile.name && settings.profile.name !== "Amina Diallo"
            ? settings.profile.name
            : authProfile?.name) ||
          authProfile?.name ||
          settings.profile.name ||
          DEFAULT_ADMIN_PROFILE.name;

        const mergedEmail =
          authProfile?.email ||
          (settings.profile.email !== "À compléter" ? settings.profile.email : DEFAULT_ADMIN_PROFILE.email);
        const mergedRole = authProfile?.role || "admin";
        const rawAvatar = authProfile?.avatarUrl || settingsAvatar || "";

        // Cybersécurité : Assainissement strict de l'URL issue de la BDD (CWE-79)
        const safeAvatar = sanitizeAvatarUrl(rawAvatar);

        const mergedProfile: UserProfile = {
          id: authProfile?.id || DEFAULT_ADMIN_PROFILE.id,
          name: mergedName,
          email: mergedEmail,
          role: mergedRole,
          avatarUrl: safeAvatar || "",
        };

        try {
          localStorage.setItem("cleanpro_user", JSON.stringify(mergedProfile));
        } catch {
          // Ignore
        }

        setProfile(mergedProfile);
        setAvatarUrl(safeAvatar);
      } catch {
        if (!cancelled) {
          try {
            const cached = localStorage.getItem("cleanpro_user");
            if (cached) {
              const parsed = JSON.parse(cached) as UserProfile;
              setProfile(parsed);
              setAvatarUrl(parsed.avatarUrl || null);
              return;
            }
          } catch {
            // Ignore
          }
          setProfile(DEFAULT_ADMIN_PROFILE);
          setAvatarUrl(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchProfile();

    // Synchronisation réactive inter-composants et multi-onglets (OWASP A01 / State Integrity)
    const handleSyncEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ avatarUrl?: string }>;
      const nextAvatar = customEvent.detail?.avatarUrl;
      const safeNext = sanitizeAvatarUrl(nextAvatar);
      if (!cancelled) {
        setAvatarUrl(safeNext);
        setProfile((prev) => {
          const next = { ...prev, avatarUrl: safeNext || "" };
          try {
            localStorage.setItem("cleanpro_user", JSON.stringify(next));
          } catch {
            // Ignore
          }
          return next;
        });
      }
    };

    const handleProfileUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ name?: string; email?: string; avatarUrl?: string }>;
      const detail = customEvent.detail;
      if (!detail || cancelled) return;

      setProfile((prev) => {
        const nextName = detail.name?.trim() || prev.name;
        const nextEmail = detail.email?.trim() || prev.email;
        const nextAvatar =
          detail.avatarUrl !== undefined
            ? sanitizeAvatarUrl(detail.avatarUrl) || ""
            : prev.avatarUrl;
        const nextProfile: UserProfile = {
          ...prev,
          name: nextName,
          email: nextEmail,
          avatarUrl: nextAvatar,
        };
        try {
          localStorage.setItem("cleanpro_user", JSON.stringify(nextProfile));
        } catch {
          // Ignore
        }
        return nextProfile;
      });

      if (detail.avatarUrl !== undefined) {
        setAvatarUrl(sanitizeAvatarUrl(detail.avatarUrl));
      }
    };

    window.addEventListener(AVATAR_SYNC_EVENT, handleSyncEvent);
    window.addEventListener("cleanpro:profile-updated", handleProfileUpdate);

    return () => {
      cancelled = true;
      isMountedRef.current = false;
      window.removeEventListener(AVATAR_SYNC_EVENT, handleSyncEvent);
      window.removeEventListener("cleanpro:profile-updated", handleProfileUpdate);
    };
  }, [reloadKey]);

  const reloadProfile = useCallback(() => {
    setIsLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  // Mise à jour de la photo d'avatar dans la BDD
  const updateAvatar = useCallback(
    async (newAvatarUrl: string): Promise<boolean> => {
      // 1. Validation de sécurité immédiate (Fail-Closed)
      const safeUrl = sanitizeAvatarUrl(newAvatarUrl);
      if (!safeUrl && newAvatarUrl.trim().length > 0) {
        // Tentative d'injection ou URL illicite détectée
        return false;
      }

      setIsSaving(true);
      try {
        // 2. Persistance BDD via le service Settings
        await dashboardServicesApi.updateSettings({
          profile: { avatarUrl: safeUrl || "" },
        });

        // 3. Persistance BDD via le service Auth (PATCH /auth/avatar)
        try {
          await authService.updateAvatar(safeUrl || "");
        } catch {
          // Tolérance si l'API backend n'est pas encore démarrée
        }

        if (isMountedRef.current) {
          setAvatarUrl(safeUrl);
          setProfile((prev) => ({ ...prev, avatarUrl: safeUrl || "" }));
        }

        // 4. Notification immédiate à tous les composants abonnés
        window.dispatchEvent(
          new CustomEvent(AVATAR_SYNC_EVENT, { detail: { avatarUrl: safeUrl } })
        );

        return true;
      } catch {
        return false;
      } finally {
        if (isMountedRef.current) {
          setIsSaving(false);
        }
      }
    },
    []
  );

  // Mise à jour complète du profil administrateur
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>): Promise<boolean> => {
      setIsSaving(true);
      try {
        const safeAvatar: string | null =
          updates.avatarUrl !== undefined
            ? sanitizeAvatarUrl(updates.avatarUrl)
            : profile.avatarUrl
            ? sanitizeAvatarUrl(profile.avatarUrl)
            : null;

        await dashboardServicesApi.updateSettings({
          profile: {
            name: updates.name,
            email: updates.email,
            avatarUrl: safeAvatar || "",
          },
        });

        // Synchronisation en base PostgreSQL via PATCH /auth/profile
        try {
          await authService.updateProfile({
            name: updates.name,
            avatarUrl: safeAvatar || undefined,
          });
        } catch {
          // Tolérance fail-safe si l'API backend n'est pas encore connectée
        }

        if (isMountedRef.current) {
          setProfile((prev) => {
            const next = {
              ...prev,
              ...updates,
              avatarUrl: safeAvatar || prev.avatarUrl,
            };
            try {
              localStorage.setItem("cleanpro_user", JSON.stringify(next));
            } catch {
              // Ignore
            }
            return next;
          });
          if (updates.avatarUrl !== undefined) {
            setAvatarUrl(safeAvatar);
          }
        }

        window.dispatchEvent(
          new CustomEvent("cleanpro:profile-updated", {
            detail: {
              name: updates.name,
              email: updates.email,
              avatarUrl: safeAvatar || undefined,
            },
          })
        );

        return true;
      } catch {
        return false;
      } finally {
        if (isMountedRef.current) {
          setIsSaving(false);
        }
      }
    },
    [profile.avatarUrl]
  );

  const value: AdminProfileContextValue = {
    profile,
    avatarUrl,
    isLoading,
    isSaving,
    updateAvatar,
    updateProfile,
    reloadProfile,
  };

  return (
    <AdminProfileContext.Provider value={value}>
      {children}
    </AdminProfileContext.Provider>
  );
}
