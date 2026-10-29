import apiClient from "./apiClient";
import type { LogItem, LogStats, LogCategory, LogResult, LogLevel } from "../pages/dashboard/logs/types";

const STORAGE_KEY = "cleanpro_dashboard_logs_v2";

export interface LogsApiResponse {
  readonly success: boolean;
  readonly total: number;
  readonly data: readonly LogItem[];
  readonly stats: LogStats;
}

export interface RecordAuditLogParams {
  category: LogCategory;
  action: string;
  target: string;
  result: LogResult;
  details: string;
  user?: string;
  userEmail?: string;
  ipAddress?: string;
  level?: LogLevel;
  metadata?: LogItem["metadata"];
}

export interface RecordTechnicalLogParams {
  category: LogCategory;
  action: string;
  target: string;
  result: LogResult;
  details: string;
  level?: LogLevel;
  httpStatus?: number;
  errorStack?: string;
  ipAddress?: string;
}

/**
 * Service API pour la synchronisation des journaux (Audit & Technique)
 * avec le backend Node.js et la base de données.
 */
export const dashboardLogsApi = {
  /**
   * Récupère les logs depuis le backend avec fallback local
   */
  async getLogs(params?: {
    type?: string;
    level?: string;
    result?: string;
    q?: string;
  }): Promise<{ logs: LogItem[]; stats?: LogStats }> {
    try {
      const response = await apiClient.get<any>("/dashboard/logs", {
        params,
      });

      const rawData = response.data?.data;
      const logList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];
      const stats = rawData?.stats || response.data?.stats;

      if (logList.length > 0 || (response.data && response.data.success)) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(logList));
        } catch {
          // Ignore
        }
        return {
          logs: [...logList],
          stats,
        };
      }
    } catch {
      // Le backend n'est pas encore démarré, utilisation du cache local
    }

    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return { logs: parsed as LogItem[] };
        }
      }
    } catch {
      // Ignore cache error
    }

    return { logs: [] };
  },

  /**
   * Envoie un nouvel événement de log vers le backend pour archivage sécurisé et stockage local
   */
  async recordLog(entry: Omit<LogItem, "id" | "timestamp">): Promise<boolean> {
    const fullLog: LogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };

    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      const list: LogItem[] = cached ? JSON.parse(cached) : [];
      const updated = [fullLog, ...list].slice(0, 500); // Conserver jusqu'à 500 logs
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }

    // Déclenche l'événement pour la mise à jour en direct de la page Logs
    window.dispatchEvent(new CustomEvent("cleanpro_logs_updated", { detail: fullLog }));

    try {
      await apiClient.post("/dashboard/logs", fullLog);
      return true;
    } catch {
      // Sauvegarde locale de secours déjà effectuée
      return true;
    }
  },

  /**
   * Enregistre un événement dans le Journal d'Audit (Qui a fait quoi)
   */
  async recordAuditLog(params: RecordAuditLogParams): Promise<boolean> {
    return this.recordLog({
      type: "audit",
      level: params.level || (params.result === "failure" ? "warning" : "info"),
      category: params.category,
      action: params.action,
      target: params.target,
      result: params.result,
      details: params.details,
      user: params.user || "Amina Diallo (Admin)",
      userEmail: params.userEmail || "amina.diallo@cleanpro.cm",
      ipAddress: params.ipAddress || "127.0.0.1",
      metadata: params.metadata,
    });
  },

  /**
   * Enregistre un événement dans le Journal Technique (Ce qui a planté / Erreurs)
   */
  async recordTechnicalLog(params: RecordTechnicalLogParams): Promise<boolean> {
    return this.recordLog({
      type: "technical",
      level: params.level || (params.result === "failure" ? "error" : "info"),
      category: params.category,
      action: params.action,
      target: params.target,
      result: params.result,
      details: params.details,
      user: "Système CleanPro",
      ipAddress: params.ipAddress || "127.0.0.1",
      metadata: {
        httpStatus: params.httpStatus,
        errorStack: params.errorStack,
      },
    });
  },

  /**
   * Déclenche la purge des logs de plus de 90 jours
   */
  async purgeOldLogs(): Promise<number> {
    try {
      const response = await apiClient.delete<{
        data?: { purgedCount?: number };
      }>("/dashboard/logs/purge");
      return response.data?.data?.purgedCount ?? 0;
    } catch {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const list: LogItem[] = JSON.parse(cached);
          const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
          const fresh = list.filter((l) => new Date(l.timestamp).getTime() >= ninetyDaysAgo);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
          window.dispatchEvent(new CustomEvent("cleanpro_logs_updated"));
          return list.length - fresh.length;
        }
      } catch {
        // Ignore
      }
      return 0;
    }
  },
};
