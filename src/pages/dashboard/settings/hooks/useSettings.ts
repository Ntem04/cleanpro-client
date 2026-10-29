import { useState, useEffect, useCallback } from "react";
import {
  dashboardServicesApi,
  type SettingsApiResponse,
  type UpdateSettingsPayload,
  INITIAL_SETTINGS_DATA,
} from "../../../../services/dashboardServicesApi";

export interface UseSettingsReturn {
  readonly settings: SettingsApiResponse;
  readonly isLoading: boolean;
  readonly isSaving: boolean;
  readonly isError: boolean;
  readonly saveSettings: (payload: UpdateSettingsPayload) => Promise<boolean>;
  readonly resetSettings: () => void;
  readonly reloadSettings: () => void;
}

/**
 * Hook useSettings — Gestion d'état et persistance des paramètres (BDD/Axios/Storage)
 */
export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<SettingsApiResponse>(INITIAL_SETTINGS_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await dashboardServicesApi.getSettings();
        if (!cancelled) {
          setSettings(data);
        }
      } catch {
        if (!cancelled) {
          setIsError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reloadSettings = useCallback(() => {
    setIsLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  const saveSettings = useCallback(
    async (payload: UpdateSettingsPayload): Promise<boolean> => {
      setIsSaving(true);
      try {
        const updated = await dashboardServicesApi.updateSettings(payload);
        setSettings(updated);
        return true;
      } catch {
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  const resetSettings = useCallback(() => {
    // Réinitialise avec les données de référence de capture
    setSettings(INITIAL_SETTINGS_DATA);
    try {
      sessionStorage.setItem(
        "cleanpro_dashboard_settings",
        JSON.stringify(INITIAL_SETTINGS_DATA)
      );
    } catch {
      // Ignorer si indisponible
    }
  }, []);

  return {
    settings,
    isLoading,
    isSaving,
    isError,
    saveSettings,
    resetSettings,
    reloadSettings,
  };
}
