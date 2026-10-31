import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

/**
 * Détermination intelligente de l'URL de base de l'API CleanPro.
 * - En local (localhost / 127.0.0.1) : cible directement Express sur http://localhost:5000/api
 * - En accès ngrok ou distant : utilise '/api' relayé par le reverse proxy
 */
const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

function resolveBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (envUrl) {
    const cleaned = envUrl.replace(/\/$/, "");
    if (cleaned.endsWith("/api") || cleaned.endsWith("/api/v1")) {
      return cleaned;
    }
    return `${cleaned}/api`;
  }
  return isLocalhost ? "http://localhost:5000/api" : "/api";
}

const BASE_URL: string = resolveBaseUrl();

/**
 * Instance Axios sécurisée et centralisée pour l'ensemble de l'application CleanPro.
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 secondes pour éviter les connexions bloquées (CWE-400 DoS)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true", // Bypasse l'écran d'avertissement ngrok gratuit
  },
  // SÉCURITÉ : Permet l'échange sécurisé des cookies de session HttpOnly / SameSite
  withCredentials: true,
});

/**
 * ─── Intercepteur de Requête ───────────────────────────────────────────────
 * Injecte dynamiquement les tokens d'authentification ou tokens CSRF.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Récupération éventuelle d'un token d'accès en mémoire (ou header CSRF)
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (csrfToken && config.headers) {
      config.headers["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

/**
 * Format standardisé des erreurs API pour le frontend.
 */
export interface ApiErrorResponse {
  readonly message: string;
  readonly statusCode: number;
  readonly errors?: readonly string[];
}

/**
 * ─── Intercepteur de Réponse ───────────────────────────────────────────────
 * Centralise le traitement des codes de statut HTTP et formate les erreurs.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<{ message?: string; errors?: string[] }>) => {
    const statusCode = error.response?.status || 500;
    let userMessage =
      "Une erreur de communication est survenue avec le serveur.";

    if (error.code === "ECONNABORTED") {
      userMessage =
        "Le délai de réponse du serveur a expiré. Veuillez vérifier votre connexion.";
    } else if (statusCode === 400 || statusCode === 422) {
      userMessage =
        error.response?.data?.message ||
        "Les données transmises sont invalides.";
    } else if (statusCode === 401) {
      userMessage =
        "Session expirée ou identifiants invalides. Veuillez vous reconnecter.";
      // Si la session est invalide en dehors de la page login, redirection possible
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        // Optionnel : redirection douce
      }
    } else if (statusCode === 403) {
      userMessage =
        "Accès refusé. Vous ne disposez pas des autorisations nécessaires.";
    } else if (statusCode === 429) {
      userMessage =
        "Trop de requêtes effectuées. Veuillez patienter un instant avant de réessayer.";
    } else if (statusCode >= 500) {
      userMessage =
        "Le service est temporairement indisponible. Nos équipes sont informées.";
    }

    // Journalisation sécurisée uniquement en environnement de développement (CWE-532)
    if (import.meta.env.DEV) {
      console.error("[API Error Debug]", {
        url: error.config?.url,
        status: statusCode,
        details: error.response?.data,
      });
    }

    const standardizedError = Object.assign(new Error(userMessage), {
      statusCode,
      errors: error.response?.data?.errors,
    });

    return Promise.reject(standardizedError);
  },
);

export default apiClient;
