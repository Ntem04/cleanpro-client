import apiClient from "./apiClient";
import type {
  MessageItem,
  MessagesApiResponse,
  UnreadCountApiResponse,
  SendReplyPayload,
} from "../pages/dashboard/messages/types";

const STORAGE_KEY = "cleanpro_dashboard_messages_v2";
const LAST_COUNT_KEY = "cleanpro_dashboard_messages_last_count";

/**
 * Récupère les messages stockés localement en cache (fallback hors-ligne)
 */
export function getLocalMessages(): MessageItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as MessageItem[];
    }
  } catch {
    // En cas d'erreur de parsing, retourne le tableau vide initial
  }
  return [];
}

/**
 * Sauvegarde les messages dans le cache local
 */
export function saveLocalMessages(messages: MessageItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Ignore storage quota error
  }
}

/**
 * Récupère le dernier compte enregistré de messages non lus pour calculer les nouveaux reçus
 */
export function getLastRecordedUnreadCount(): number {
  try {
    const val = localStorage.getItem(LAST_COUNT_KEY);
    return val !== null ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

/**
 * Enregistre le compte de messages non lus
 */
export function saveRecordedUnreadCount(count: number): void {
  try {
    localStorage.setItem(LAST_COUNT_KEY, count.toString());
  } catch {
    // Ignore error
  }
}

/**
 * Diffuse l'événement global pour notifier la barre latérale et les compteurs
 */
export function notifyUnreadCountChange(unreadCount: number, newlyReceivedCount = 0): void {
  window.dispatchEvent(
    new CustomEvent("cleanpro_messages_count", {
      detail: { unreadCount, newlyReceivedCount },
    })
  );
}

/**
 * ─── Service API : Messages du Dashboard & Récupération Base de données ───────
 */
export const dashboardMessagesApi = {
  /**
   * Récupère la liste de tous les messages depuis le futur backend / la base de données.
   * Calcule le nombre total de messages et le nombre de messages non lus.
   */
  async getMessages(): Promise<MessagesApiResponse> {
    try {
      // Tentative d'appel au backend REST Express / Prisma
      const response = await apiClient.get<any>("/dashboard/messages");
      const rawData = response.data?.data;
      const messageList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];

      if (messageList.length > 0 || (response.data && response.data.success)) {
        saveLocalMessages(messageList);
        const unreadCount =
          typeof rawData?.unreadCount === "number"
            ? rawData.unreadCount
            : messageList.filter((m: any) => m.status === "unread").length;
        saveRecordedUnreadCount(unreadCount);
        notifyUnreadCountChange(unreadCount);
        return {
          success: true,
          unreadCount,
          total: typeof rawData?.total === "number" ? rawData.total : messageList.length,
          data: messageList,
        };
      }
    } catch {
      // Fallback local élégant si le backend n'est pas encore lancé
    }

    const localMessages = getLocalMessages();
    const unreadCount = localMessages.filter((m) => m.status === "unread").length;
    notifyUnreadCountChange(unreadCount);

    return {
      success: true,
      unreadCount,
      total: localMessages.length,
      data: localMessages,
    };
  },

  /**
   * Récupère et calcule le nombre de nouveaux messages non lus reçus depuis la base.
   * Compare le nombre actuel avec le précédent pour déduire les nouveaux arrivages.
   */
  async getUnreadCount(): Promise<UnreadCountApiResponse> {
    const previousCount = getLastRecordedUnreadCount();

    try {
      const response = await apiClient.get<UnreadCountApiResponse>(
        "/dashboard/messages/unread-count"
      );
      if (response.data && typeof response.data.unreadCount === "number") {
        const currentCount = response.data.unreadCount;
        const newlyReceived = Math.max(0, currentCount - previousCount);
        saveRecordedUnreadCount(currentCount);
        notifyUnreadCountChange(currentCount, newlyReceived);
        return {
          success: true,
          unreadCount: currentCount,
          newlyReceivedCount: newlyReceived,
          timestamp: new Date().toISOString(),
        };
      }
    } catch {
      // Fallback local si backend déconnecté
    }

    const localMessages = getLocalMessages();
    const currentCount = localMessages.filter((m) => m.status === "unread").length;
    const newlyReceived = Math.max(0, currentCount - previousCount);
    saveRecordedUnreadCount(currentCount);
    notifyUnreadCountChange(currentCount, newlyReceived);

    return {
      success: true,
      unreadCount: currentCount,
      newlyReceivedCount: newlyReceived,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Marque un message comme lu et recalcule les compteurs
   */
  async markAsRead(id: string): Promise<boolean> {
    try {
      await apiClient.patch(`/dashboard/messages/${id}/read`);
    } catch {
      // Fallback local
    }

    const messages = getLocalMessages().map((m) =>
      m.id === id ? { ...m, status: (m.status === "read" ? "unread" : "read") as MessageItem["status"] } : m
    );
    saveLocalMessages(messages);
    const unread = messages.filter((m) => m.status === "unread").length;
    saveRecordedUnreadCount(unread);
    notifyUnreadCountChange(unread);
    return true;
  },

  /**
   * Archive un message
   */
  async archiveMessage(id: string): Promise<boolean> {
    try {
      await apiClient.patch(`/dashboard/messages/${id}/archive`);
    } catch {
      // Fallback local
    }

    const messages = getLocalMessages().map((m) =>
      m.id === id ? { ...m, status: "archived" as const } : m
    );
    saveLocalMessages(messages);
    const unread = messages.filter((m) => m.status === "unread").length;
    saveRecordedUnreadCount(unread);
    notifyUnreadCountChange(unread);
    return true;
  },

  /**
   * Supprime un message
   */
  async deleteMessage(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/dashboard/messages/${id}`);
    } catch {
      // Fallback local
    }

    const messages = getLocalMessages().filter((m) => m.id !== id);
    saveLocalMessages(messages);
    const unread = messages.filter((m) => m.status === "unread").length;
    saveRecordedUnreadCount(unread);
    notifyUnreadCountChange(unread);
    return true;
  },

  /**
   * Envoie une réponse au message et lève l'erreur pour affichage utilisateur en cas d'échec SMTP
   */
  async sendReply(id: string, payload: SendReplyPayload): Promise<boolean> {
    const response = await apiClient.post(`/dashboard/messages/${id}/reply`, payload);
    return response.data?.success ?? true;
  },

  /**
   * Enregistre un message réel soumis par un visiteur via le formulaire de contact du site.
   * Il est immédiatement disponible dans la boîte de messagerie du dashboard avec recalcul en direct des non-lus.
   */
  addIncomingContactMessage(payload: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): MessageItem {
    const newMessage: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: payload.name.trim(),
      subtitle: `Sujet : ${payload.subject}`,
      source: "Formulaire de contact web",
      snippet:
        payload.message.length > 80
          ? `${payload.message.slice(0, 80).trim()}...`
          : payload.message.trim(),
      email: payload.email.trim().toLowerCase(),
      subject: payload.subject,
      content: payload.message.trim(),
      date: new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
      status: "unread",
      createdAt: new Date().toISOString(),
      isNew: true,
    };

    const current = getLocalMessages();
    const updated = [newMessage, ...current];
    saveLocalMessages(updated);

    const prevCount = getLastRecordedUnreadCount();
    const unreadCount = updated.filter((m) => m.status === "unread").length;
    const newlyReceived = Math.max(1, unreadCount - prevCount);
    saveRecordedUnreadCount(unreadCount);
    notifyUnreadCountChange(unreadCount, newlyReceived);

    return newMessage;
  },

  /**
   * Simule la réception d'un nouveau message client provenant de la base ou du formulaire de contact.
   * Utile pour tester et vérifier immédiatement le calcul en direct des nouveaux messages non lus.
   */
  simulateIncomingDbMessage(senderName = "Groupe Alpha"): MessageItem {
    const newMessage: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: senderName,
      subtitle: "Nouveau message client reçu de la base",
      source: "Base de données CleanPro",
      snippet: "Demande d'intervention de nettoyage reçue en ligne.",
      email: `${senderName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      subject: "Demande de devis nettoyage locaux",
      content: "Bonjour, nous souhaiterions obtenir un devis pour l'entretien de nos bureaux.",
      date: new Date().toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      }),
      status: "unread",
      createdAt: new Date().toISOString(),
      isNew: true,
    };

    const current = getLocalMessages();
    const updated = [newMessage, ...current];
    saveLocalMessages(updated);

    const prevCount = getLastRecordedUnreadCount();
    const unreadCount = updated.filter((m) => m.status === "unread").length;
    const newlyReceived = Math.max(1, unreadCount - prevCount);
    saveRecordedUnreadCount(unreadCount);
    notifyUnreadCountChange(unreadCount, newlyReceived);

    return newMessage;
  },
};
