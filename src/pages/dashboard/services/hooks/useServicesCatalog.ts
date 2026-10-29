import { useState, useEffect } from "react";
import {
  dashboardServicesApi,
  type ServicesCatalogApiResponse,
  type ServiceCatalogItem,
  type CreateServicePayload,
} from "../../../../services/dashboardServicesApi";

interface UseServicesCatalogReturn {
  readonly data: ServicesCatalogApiResponse | null;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly refetch: () => void;
  readonly addServiceItem: (
    payload: CreateServicePayload
  ) => Promise<ServiceCatalogItem | null>;
  readonly updateServiceItem: (
    id: string,
    payload: Partial<Omit<ServiceCatalogItem, "id">>
  ) => Promise<boolean>;
}

/**
 * Hook — useServicesCatalog
 *
 * Gère le cycle de vie asynchrone du catalogue de services CleanPro :
 * - Chargement avec Skeletons (anti-CLS)
 * - Gestion d'erreur avec retry sécurisé (CWE-209)
 * - Mise à jour optimiste et sécurisée d'un service (titre, description, prestations, statut)
 * - Nettoyage anti-fuite mémoire (CWE-672)
 */
export function useServicesCatalog(): UseServicesCatalogReturn {
  const [data, setData] = useState<ServicesCatalogApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [fetchKey, setFetchKey] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await dashboardServicesApi.getCatalog();
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
  }, [fetchKey]);

  const refetch = () => setFetchKey((k) => k + 1);

  const addServiceItem = async (
    payload: CreateServicePayload
  ): Promise<ServiceCatalogItem | null> => {
    try {
      const created = await dashboardServicesApi.createService(payload);
      setData((prev) => {
        if (!prev) {
          return {
            total: 1,
            data: [created],
          };
        }
        return {
          total: prev.total + 1,
          data: [created, ...prev.data],
        };
      });
      return created;
    } catch {
      return null;
    }
  };

  const updateServiceItem = async (
    id: string,
    payload: Partial<Omit<ServiceCatalogItem, "id">>
  ): Promise<boolean> => {
    try {
      const updated = await dashboardServicesApi.updateService(id, payload);
      setData((prev) => {
        if (!prev) return prev;
        const updatedList = prev.data.map((item) =>
          item.id === id ? { ...item, ...updated } : item
        );
        return {
          ...prev,
          data: updatedList,
        };
      });
      return true;
    } catch {
      return false;
    }
  };

  return { data, isLoading, isError, refetch, addServiceItem, updateServiceItem };
}

