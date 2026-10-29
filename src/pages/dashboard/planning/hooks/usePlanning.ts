import { useState, useEffect } from "react";
import {
  dashboardServicesApi,
  type PlanningApiResponse,
  type PlanningSlotItem,
  type CreatePlanningSlotPayload,
} from "../../../../services/dashboardServicesApi";

interface UsePlanningReturn {
  readonly data: PlanningApiResponse | null;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly refetch: () => void;
  readonly addSlot: (
    payload: CreatePlanningSlotPayload
  ) => Promise<PlanningSlotItem | null>;
  readonly updateSlot: (
    id: string,
    payload: Partial<Omit<PlanningSlotItem, "id">>
  ) => Promise<boolean>;
  readonly deleteSlot: (id: string) => Promise<boolean>;
}

/**
 * Hook — usePlanning
 *
 * Gère le cycle de vie du planning d'interventions :
 * - Chargement avec Skeletons anti-CLS
 * - Gestion d'erreur sécurisée
 * - Création et mise à jour optimistes
 * - Annulation mémoire propre (CWE-672)
 */
export function usePlanning(weekParam?: string): UsePlanningReturn {
  const [data, setData] = useState<PlanningApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [fetchKey, setFetchKey] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await dashboardServicesApi.getPlanning(weekParam);
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

    return () => {
      cancelled = true;
    };
  }, [fetchKey, weekParam]);

  const refetch = () => setFetchKey((k) => k + 1);

  const addSlot = async (
    payload: CreatePlanningSlotPayload
  ): Promise<PlanningSlotItem | null> => {
    try {
      const created = await dashboardServicesApi.createPlanningSlot(payload);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          slots: [...prev.slots, created],
        };
      });
      return created;
    } catch {
      return null;
    }
  };

  const updateSlot = async (
    id: string,
    payload: Partial<Omit<PlanningSlotItem, "id">>
  ): Promise<boolean> => {
    try {
      const updated = await dashboardServicesApi.updatePlanningSlot(id, payload);
      setData((prev) => {
        if (!prev) return prev;
        const updatedSlots = prev.slots.map((slot) =>
          slot.id === id ? { ...slot, ...updated } : slot
        );
        return {
          ...prev,
          slots: updatedSlots,
        };
      });
      return true;
    } catch {
      return false;
    }
  };

  const deleteSlot = async (id: string): Promise<boolean> => {
    try {
      await dashboardServicesApi.deletePlanningSlot(id);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          slots: prev.slots.filter((slot) => slot.id !== id),
        };
      });
      return true;
    } catch {
      return false;
    }
  };

  return { data, isLoading, isError, refetch, addSlot, updateSlot, deleteSlot };
}

