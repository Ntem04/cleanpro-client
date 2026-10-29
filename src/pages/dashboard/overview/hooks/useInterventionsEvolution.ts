import { useState, useEffect } from "react";
import {
  dashboardServicesApi,
  type InterventionsHistoryApiResponse,
} from "../../../../services/dashboardServicesApi";

interface UseInterventionsEvolutionReturn {
  readonly data: InterventionsHistoryApiResponse | null;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly refetch: () => void;
}

/**
 * Hook — useInterventionsEvolution
 *
 * Gère le cycle de vie de la requête API d'évolution des interventions :
 * - isLoading → affichage du Skeleton du graphique
 * - isError   → affichage de l'état d'erreur avec bouton réessai
 * - data      → affichage du graphique Recharts avec Reveal
 * - Nettoyage sécurisé pour éviter les setState post-démontage
 */
export function useInterventionsEvolution(days: number = 7): UseInterventionsEvolutionReturn {
  const [data, setData] = useState<InterventionsHistoryApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [fetchKey, setFetchKey] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await dashboardServicesApi.getInterventionsEvolution(days);
        if (!cancelled) {
          setData(response);
        }
      } catch {
        // OWASP CWE-209 : Aucune fuite d'erreur technique vers le client
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
  }, [days, fetchKey]);

  const refetch = () => setFetchKey((k) => k + 1);

  return { data, isLoading, isError, refetch };
}

