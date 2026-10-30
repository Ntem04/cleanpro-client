import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type {
  LogItem,
  LogTypeFilter,
  LogLevelFilter,
  LogResultFilter,
  LogStats,
} from "../types";
import { dashboardLogsApi } from "../../../../services/dashboardLogsApi";

// Initialisation à vide (0 log, valeurs neutres/nulles selon la demande)
const INITIAL_LOGS: readonly LogItem[] = [];

export function useLogs() {
  const [logs, setLogs] = useState<LogItem[]>([...INITIAL_LOGS]);
  const [typeFilter, setTypeFilter] = useState<LogTypeFilter>("all");
  const [levelFilter, setLogLevelFilter] = useState<LogLevelFilter>("all");
  const [resultFilter, setResultFilter] = useState<LogResultFilter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronisation avec le backend et la base de données dès qu'ils sont démarrés ou mis à jour
  useEffect(() => {
    let isCancelled = false;

    const fetchCurrentLogs = async () => {
      try {
        const response = await dashboardLogsApi.getLogs();
        if (!isCancelled && response.logs) {
          setLogs(response.logs);
        }
      } catch {
        // En attente du démarrage du backend
      }
    };

    void fetchCurrentLogs();

    const handleLogsUpdated = () => {
      void fetchCurrentLogs();
    };

    window.addEventListener("cleanpro_logs_updated", handleLogsUpdated);

    return () => {
      isCancelled = true;
      window.removeEventListener("cleanpro_logs_updated", handleLogsUpdated);
    };
  }, []);

  // Filtrage combiné optimisé
  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      // Filtre Type (Audit vs Technique)
      if (typeFilter !== "all" && item.type !== typeFilter) {
        return false;
      }

      // Filtre Niveau de gravité
      if (levelFilter !== "all" && item.level !== levelFilter) {
        return false;
      }

      // Filtre Résultat (Succès / Échec)
      if (resultFilter !== "all" && item.result !== resultFilter) {
        return false;
      }

      // Filtre de recherche textuelle globale
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchAction = item.action.toLowerCase().includes(q);
        const matchUser = item.user.toLowerCase().includes(q);
        const matchTarget = item.target.toLowerCase().includes(q);
        const matchIp = item.ipAddress.toLowerCase().includes(q);
        const matchDetails = item.details.toLowerCase().includes(q);
        const matchEmail = item.userEmail?.toLowerCase().includes(q);
        return (
          matchAction ||
          matchUser ||
          matchTarget ||
          matchIp ||
          matchDetails ||
          Boolean(matchEmail)
        );
      }

      return true;
    });
  }, [logs, typeFilter, levelFilter, resultFilter, searchQuery]);

  // Statistiques épurées calculées dynamiquement (0 au départ)
  const stats: LogStats = useMemo(() => {
    const totalAudit = logs.filter((l) => l.type === "audit").length;
    const totalTechnical = logs.filter((l) => l.type === "technical").length;
    const totalWarnings = logs.filter((l) => l.level === "warning").length;
    const totalErrors = logs.filter(
      (l) => l.level === "error" || l.level === "critical"
    ).length;
    const blockedAccounts = logs.filter(
      (l) =>
        l.action.includes("bloqué") ||
        (l.metadata?.attemptsCount && l.metadata.attemptsCount >= 5)
    ).length;

    return {
      totalAudit,
      totalTechnical,
      totalWarnings,
      totalErrors,
      blockedAccounts,
      uptimeRate: logs.length === 0 ? "—" : "100%",
    };
  }, [logs]);

  // Détection d'alerte sécurité en cours (null/undefined si aucun log)
  const securityAlert = useMemo(() => {
    return logs.find(
      (l) =>
        l.level === "critical" ||
        (l.action.includes("bloqué") && l.result === "failure")
    );
  }, [logs]);

  // Exportation au format CSV
  const exportCsv = useCallback(() => {
    if (filteredLogs.length === 0) {
      setToastMessage("Aucun log à exporter pour le moment.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const headers = [
      "Date_Heure",
      "Type",
      "Niveau",
      "Utilisateur",
      "Email_Saisi",
      "Action",
      "Element_Concerne",
      "Adresse_IP",
      "Resultat",
      "Details",
    ];

    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.type}"`,
      `"${l.level}"`,
      `"${l.user}"`,
      `"${l.userEmail || ""}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.target.replace(/"/g, '""')}"`,
      `"${l.ipAddress}"`,
      `"${l.result}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `CleanPro_Logs_Audit_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage("Export CSV téléchargé avec succès.");
    setTimeout(() => setToastMessage(null), 3500);
  }, [filteredLogs]);

  // Exportation au format JSON sécurisé
  const exportJson = useCallback(() => {
    if (filteredLogs.length === 0) {
      setToastMessage("Aucun log à exporter pour le moment.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(filteredLogs, null, 2)
    )}`;
    const link = document.createElement("a");
    link.setAttribute("href", jsonString);
    link.setAttribute(
      "download",
      `CleanPro_Logs_Audit_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage("Export JSON téléchargé avec succès.");
    setTimeout(() => setToastMessage(null), 3500);
  }, [filteredLogs]);

  // Compteur interne pour faire défiler les scénarios de simulation réalistes
  const simulationStep = useRef<number>(0);

  // Simulation d'un nouvel événement de log fidèle aux exigences
  const simulateLogEvent = useCallback(() => {
    const scenarios: Array<Omit<LogItem, "id" | "timestamp">> = [
      {
        type: "audit",
        category: "security",
        level: "info",
        user: "Amina Diallo",
        userEmail: "amina.diallo@cleanpro.cm",
        action: "Connexion réussie",
        target: "Portail Administrateur CleanPro",
        ipAddress: "197.234.12.8",
        result: "success",
        details: "Authentification à deux facteurs validée avec succès.",
      },
      {
        type: "audit",
        category: "security",
        level: "warning",
        user: "Tentative externe",
        userEmail: "inconnu@domain.com",
        action: "Connexion échouée",
        target: "Formulaire d'authentification",
        ipAddress: "185.220.101.4",
        result: "failure",
        details: "Mot de passe erroné saisi (mot de passe masqué selon la norme OWASP).",
        metadata: { attemptsCount: 3 },
      },
      {
        type: "audit",
        category: "security",
        level: "critical",
        user: "Responsable d'agence",
        userEmail: "admin@cleanpro.cm",
        action: "Compte bloqué après trop d'échecs",
        target: "Module Sécurité des Comptes",
        ipAddress: "185.220.101.4",
        result: "failure",
        details: "5 tentatives échouées consécutives. Alerte e-mail envoyée immédiatement au Super Admin.",
        metadata: { attemptsCount: 5 },
      },
      {
        type: "audit",
        category: "content",
        level: "info",
        user: "Amina Diallo",
        userEmail: "amina.diallo@cleanpro.cm",
        action: "Modification tarif & description d'un service",
        target: "Nettoyage Bureaux & Locaux Commerciaux",
        ipAddress: "197.234.12.8",
        result: "success",
        details: "Mise à jour du forfait de base et publication immédiate sur la vitrine.",
        metadata: { oldPrice: "45 000 FCFA", newPrice: "50 000 FCFA" },
      },
      {
        type: "audit",
        category: "content",
        level: "info",
        user: "Amina Diallo",
        userEmail: "amina.diallo@cleanpro.cm",
        action: "Importation CSV du catalogue services",
        target: "catalogue_cleanpro_2026.csv",
        ipAddress: "197.234.12.8",
        result: "success",
        details: "Importation par lots exécutée avec succès.",
        metadata: { linesImported: 18, errorsCount: 0 },
      },
      {
        type: "audit",
        category: "contact",
        level: "info",
        user: "Visiteur Client",
        action: "Message de contact reçu",
        target: "Formulaire de devis express",
        ipAddress: "102.164.88.21",
        result: "success",
        details: "Notification e-mail d'alerte transmise à l'agence. Contenu masqué selon les normes RGPD.",
      },
      {
        type: "audit",
        category: "contact",
        level: "warning",
        user: "Bot externe",
        action: "Message bloqué comme spam",
        target: "Filtre anti-spam / Honeypot",
        ipAddress: "45.142.122.9",
        result: "failure",
        details: "Champs cachés honeypot complétés et soumission en moins de 1 seconde.",
        metadata: { isSpamBlocked: true },
      },
      {
        type: "technical",
        category: "technical",
        level: "error",
        user: "Serveur API Node.js",
        action: "Erreur serveur interne (500 Database timeout)",
        target: "Connecteur PostgreSQL Prisma",
        ipAddress: "127.0.0.1",
        result: "failure",
        details: "Délai d'attente du pool de connexion dépassé (timeout 10000ms).",
        metadata: {
          httpStatus: 500,
          errorStack: "Error: connect ETIMEDOUT to cluster at 10.0.4.12:5432\n    at ConnectionPool.acquire()",
        },
      },
      {
        type: "technical",
        category: "technical",
        level: "warning",
        user: "Amina Diallo",
        action: "Échec d'upload d'image (Format non conforme)",
        target: "CDN Service Images /upload",
        ipAddress: "197.234.12.8",
        result: "failure",
        details: "Fichier rejeté par le validateur MIME de sécurité (extension non autorisée).",
        metadata: { httpStatus: 415 },
      },
      {
        type: "technical",
        category: "technical",
        level: "warning",
        user: "Scanner automatisé",
        action: "Erreurs 404 répétées (Tentative de scan)",
        target: "Routeur Web : /wp-login.php & /admin/config",
        ipAddress: "91.241.19.84",
        result: "failure",
        details: "Plus de 12 requêtes successives sur des URL inexistantes en moins de 30 secondes.",
        metadata: { httpStatus: 404, targetRoute: "/wp-login.php" },
      },
    ];

    const currentScenario = scenarios[simulationStep.current % scenarios.length];
    simulationStep.current += 1;

    const newLog: LogItem = {
      ...currentScenario,
      id: `log-sim-${Date.now()}`,
      timestamp: `${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}`,
    };

    setLogs((prev) => [newLog, ...prev]);
    void dashboardLogsApi.recordLog(newLog);
    setToastMessage(`Événement consigné dans le journal : ${newLog.action}`);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  return {
    logs: filteredLogs,
    allLogsCount: logs.length,
    stats,
    securityAlert,
    typeFilter,
    setTypeFilter,
    levelFilter,
    setLogLevelFilter,
    resultFilter,
    setResultFilter,
    searchQuery,
    setSearchQuery,
    selectedLog,
    setSelectedLog,
    toastMessage,
    exportCsv,
    exportJson,
    simulateLogEvent,
  };
}
