import { useState, useEffect } from "react";
import {
  dashboardServicesApi,
  type RecentInterventionsApiResponse,
} from "../../../../services/dashboardServicesApi";

interface UseRecentInterventionsReturn {
  readonly data: RecentInterventionsApiResponse | null;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly refetch: () => void;
}

/**
 * Hook — useRecentInterventions
 *
 * Gère le cycle de vie de la requête API des dernières interventions :
 * - isLoading → affichage du Skeleton du tableau
 * - isError   → affichage du composant d'erreur avec action de retry
 * - data      → rendu des lignes de données reçues
 * - Nettoyage sécurisé pour éviter les setState post-démontage
 */
export function useRecentInterventions(): UseRecentInterventionsReturn {
  const [data, setData] = useState<RecentInterventionsApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [fetchKey, setFetchKey] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await dashboardServicesApi.getRecentInterventions();
        if (!cancelled) {
          setData(response);
        }
      } catch {
        // OWASP CWE-209 : Protection contre l'exposition de stack traces
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

