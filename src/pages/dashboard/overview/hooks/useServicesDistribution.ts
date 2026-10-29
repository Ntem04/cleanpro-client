import { useState, useEffect } from "react";
import {
  dashboardServicesApi,
  type ServicesDistributionApiResponse,
} from "../../../../services/dashboardServicesApi";

interface UseServicesDistributionReturn {
  readonly data: ServicesDistributionApiResponse | null;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly refetch: () => void;
}

/**
 * Hook — useServicesDistribution
 *
 * Gère le cycle de vie complet de la requête API :
 * - isLoading → affiche les Skeletons
 * - isError   → affiche un message d'erreur avec retry
 * - data      → rend le Donut Chart + légende
 *
 * Annulation propre de la requête sur démontage (évite les setState sur
 * composant démonté — CWE-672).
 */
export function useServicesDistribution(): UseServicesDistributionReturn {
  const [data, setData] = useState<ServicesDistributionApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [fetchKey, setFetchKey] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await dashboardServicesApi.getDistribution();
        if (!cancelled) {
          setData(response);
        }
      } catch {
        // Erreur générique côté client — jamais de détails techniques exposés (CWE-209)
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

    const handleDataUpdated = () => {
      void load();
    };

    window.addEventListener("cleanpro_planning_updated", handleDataUpdated);
    window.addEventListener("cleanpro_services_updated", handleDataUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("cleanpro_planning_updated", handleDataUpdated);
      window.removeEventListener("cleanpro_services_updated", handleDataUpdated);
    };
  }, [fetchKey]);

  const refetch = () => setFetchKey((k) => k + 1);

  return { data, isLoading, isError, refetch };
}

