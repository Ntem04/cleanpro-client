import { useState, useEffect } from "react";
import {
  dashboardServicesApi,
  type UpcomingInterventionsApiResponse,
} from "../../../../services/dashboardServicesApi";

interface UseUpcomingInterventionsReturn {
  readonly data: UpcomingInterventionsApiResponse | null;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly refetch: () => void;
}

/**
 * Hook — useUpcomingInterventions
 *
 * Gère le cycle de vie de la requête API des prochaines interventions :
 * - isLoading → affichage du Skeleton de la liste latérale
 * - isError   → affichage de l'état d'erreur
 * - data      → rendu de la liste planifiée
 */
export function useUpcomingInterventions(): UseUpcomingInterventionsReturn {
  const [data, setData] = useState<UpcomingInterventionsApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [fetchKey, setFetchKey] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await dashboardServicesApi.getUpcomingInterventions();
        if (!cancelled) {
          setData(response);
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

    const handlePlanningUpdated = () => {
      void load();
    };

    window.addEventListener("cleanpro_planning_updated", handlePlanningUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("cleanpro_planning_updated", handlePlanningUpdated);
    };
  }, [fetchKey]);

  const refetch = () => setFetchKey((k) => k + 1);

  return { data, isLoading, isError, refetch };
}

