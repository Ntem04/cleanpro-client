import apiClient from './apiClient';

export interface TelemetryVisitEvent {
  readonly id: string;
  readonly ip: string;
  readonly type: 'visiteur' | 'attaquant';
  readonly label: string;
  readonly page: string;
  readonly timestamp: string;
  readonly status: number;
  readonly userAgent: string;
  readonly location?: string;
  readonly details?: string;
}

export interface PageTelemetryItem {
  readonly path: string;
  readonly title: string;
  readonly uniqueVisitors: number;
  readonly totalHits: number;
  readonly lastVisitAt?: string;
  readonly recentVisitors: ReadonlyArray<{
    readonly id: string;
    readonly ip: string;
    readonly userAgent: string;
    readonly location?: string;
    readonly timestamp: string;
    readonly status: number;
  }>;
}

export interface AttackTargetItem {
  readonly target: string;
  readonly blockedCount: number;
  readonly lastAttemptAt: string;
  readonly lastAttackerIp: string;
  readonly tool: string;
}

export interface TelemetryStats {
  readonly totalVisitors: number;
  readonly totalAttackers: number;
  readonly activeToday: number;
  readonly pages: readonly PageTelemetryItem[];
  readonly attackTargets: readonly AttackTargetItem[];
  readonly topPages: ReadonlyArray<{ readonly page: string; readonly views: number; readonly attacks: number }>;
  readonly recentActivity: readonly TelemetryVisitEvent[];
}

// Cache d'état de session mémoire pour éviter les rafales d'appels lors de re-rendus rapides
const sessionTrackedPages = new Set<string>();

/**
 * Génère ou récupère un identifiant de visiteur unique anonyme par profil de navigateur.
 * Cet identifiant persiste dans le navigateur pour garantir qu'un même utilisateur
 * ne sera comptabilisé qu'une seule et unique fois par page.
 */
function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'vid_anonymous';
  }
  let vid = localStorage.getItem('cleanpro_vid');
  if (!vid) {
    vid = 'v_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now().toString(36);
    localStorage.setItem('cleanpro_vid', vid);
  }
  return vid;
}

export const telemetryApi = {
  /**
   * Récupère les métriques de télémétrie par page avec dé-duplication stricte
   */
  async getStats(): Promise<TelemetryStats> {
    try {
      const response = await apiClient.get<{ success: boolean; data: TelemetryStats }>('/telemetry/stats');
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Fallback local fail-safe
    }

    return {
      totalVisitors: 0,
      totalAttackers: 0,
      activeToday: 0,
      pages: [],
      attackTargets: [],
      topPages: [],
      recentActivity: [],
    };
  },

  /**
   * Enregistre une visite de page côté backend.
   * La dé-duplication fait autorité côté backend via l'identifiant persistant de visiteur (visitorId).
   * Recharger ou revisiter une page déjà vue n'incrémente jamais le compteur.
   */
  async trackPage(path: string): Promise<void> {
    if (typeof window === 'undefined') return;

    // Ne jamais tracer les routes internes d'administration ou login
    if (path.startsWith('/dashboard') || path.startsWith('/login')) {
      return;
    }

    // Si un compte admin est actif dans ce navigateur (ex: Chrome connecté en admin),
    // on n'enregistre pas ses navigations comme des visites de visiteurs légitimes.
    try {
      const userStr = localStorage.getItem('cleanpro_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && (user.role === 'admin' || user.role === 'superadmin')) {
          return;
        }
      }
    } catch {
      // Ignore
    }

    // Évite la double émission concurrente dans la même session active
    if (sessionTrackedPages.has(path)) {
      return;
    }
    sessionTrackedPages.add(path);

    try {
      const visitorId = getOrCreateVisitorId();
      await apiClient.post('/telemetry/track', {
        path,
        visitorId,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      });
    } catch {
      // En cas d'erreur réseau temporaire, on permet un nouvel essai ultérieur
      sessionTrackedPages.delete(path);
    }
  },
};
