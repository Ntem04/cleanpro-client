import { useState, useEffect, useMemo, useCallback } from "react";
import type { MessageItem, MessageFilterTab } from "../types";
import {
  dashboardMessagesApi,
  getLocalMessages,
  saveLocalMessages,
  getLastRecordedUnreadCount,
  saveRecordedUnreadCount,
  notifyUnreadCountChange,
} from "../../../../services/dashboardMessagesApi";

export function useMessages() {
  // Initialisation à 0 message (conformément à la demande de l'utilisateur)
  const [messages, setMessages] = useState<MessageItem[]>(() => {
    return getLocalMessages();
  });

  const [activeTab, setActiveTab] = useState<MessageFilterTab>("unread");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [newlyReceivedCount, setNewlyReceivedCount] = useState<number>(0);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");

  // Calcul du nombre de messages non lus (0 au démarrage)
  const unreadCount = useMemo(() => {
    return messages.filter((m: MessageItem) => m.status === "unread").length;
  }, [messages]);

  // Dérivation de l'ID sélectionné actif sans cascading render
  const activeSelectedId = useMemo(() => {
    if (selectedId && messages.some((m: MessageItem) => m.id === selectedId)) {
      return selectedId;
    }
    return messages[0]?.id ?? "";
  }, [messages, selectedId]);

  const selectedMessage = useMemo(() => {
    return messages.find((m: MessageItem) => m.id === activeSelectedId) || null;
  }, [messages, activeSelectedId]);

  // Synchronisation avec la base de données (backend) sur demande
  const syncWithDatabase = useCallback(async () => {
    setIsSyncing(true);
    try {
      const prevUnread = getLastRecordedUnreadCount();
      const response = await dashboardMessagesApi.getMessages();

      setMessages([...response.data]);
      saveLocalMessages([...response.data]);

      // Calcul du nombre de nouveaux messages non lus nouvellement reçus
      const currentUnread = response.data.filter((m: MessageItem) => m.status === "unread").length;
      const diff = Math.max(0, currentUnread - prevUnread);
      setNewlyReceivedCount(diff);
      saveRecordedUnreadCount(currentUnread);
      notifyUnreadCountChange(currentUnread, diff);

      setLastSyncTime(
        new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch {
      // Ignorer l'erreur réseau si le serveur n'est pas encore en ligne
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Synchronisation initiale au montage du composant
  useEffect(() => {
    let isCancelled = false;
    const initialUnread = getLocalMessages().filter((m: MessageItem) => m.status === "unread").length;
    notifyUnreadCountChange(initialUnread);

    void (async () => {
      try {
        const prevUnread = getLastRecordedUnreadCount();
        const response = await dashboardMessagesApi.getMessages();
        if (isCancelled) return;

        setMessages([...response.data]);
        saveLocalMessages([...response.data]);

        const currentUnread = response.data.filter((m: MessageItem) => m.status === "unread").length;
        const diff = Math.max(0, currentUnread - prevUnread);
        setNewlyReceivedCount(diff);
        saveRecordedUnreadCount(currentUnread);
        notifyUnreadCountChange(currentUnread, diff);

        setLastSyncTime(
          new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      } catch {
        // En cas de non disponibilité du backend
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Écoute les événements globaux de messages
  useEffect(() => {
    const handleCountChange = (e: Event) => {
      const custom = e as CustomEvent<{ unreadCount: number; newlyReceivedCount?: number }>;
      if (custom.detail && typeof custom.detail.newlyReceivedCount === "number") {
        setNewlyReceivedCount(custom.detail.newlyReceivedCount);
      }
    };
    window.addEventListener("cleanpro_messages_count", handleCountChange);
    return () => {
      window.removeEventListener("cleanpro_messages_count", handleCountChange);
    };
  }, []);

  // Filtrage selon onglet et recherche
  const filteredMessages = useMemo(() => {
    return messages.filter((msg: MessageItem) => {
      if (activeTab === "unread" && msg.status !== "unread") return false;
      if (activeTab === "read" && msg.status !== "read") return false;
      if (activeTab === "archived" && msg.status !== "archived") return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchSender = msg.sender.toLowerCase().includes(query);
        const matchSub = msg.subtitle.toLowerCase().includes(query);
        const matchSource = msg.source.toLowerCase().includes(query);
        const matchSnippet = msg.snippet.toLowerCase().includes(query);
        return matchSender || matchSub || matchSource || matchSnippet;
      }

      return true;
    });
  }, [messages, activeTab, searchQuery]);

  const markAsRead = useCallback(async (id: string) => {
    await dashboardMessagesApi.markAsRead(id);
    setMessages((prev) =>
      prev.map((msg: MessageItem) =>
        msg.id === id
          ? { ...msg, status: msg.status === "read" ? "unread" : "read" }
          : msg
      )
    );
  }, []);

  const archiveMessage = useCallback(async (id: string) => {
    await dashboardMessagesApi.archiveMessage(id);
    setMessages((prev) =>
      prev.map((msg: MessageItem) => (msg.id === id ? { ...msg, status: "archived" } : msg))
    );
  }, []);

  const deleteMessage = useCallback(async (id: string) => {
    await dashboardMessagesApi.deleteMessage(id);
    setMessages((prev) => prev.filter((msg: MessageItem) => msg.id !== id));
  }, []);

  // Simule l'arrivée d'un nouveau message depuis la base de données
  const simulateIncomingMessage = useCallback((sender = "Groupe Alpha") => {
    const newMsg = dashboardMessagesApi.simulateIncomingDbMessage(sender);
    setMessages((prev) => [newMsg, ...prev]);
    setSelectedId(newMsg.id);
  }, []);

  return {
    messages,
    filteredMessages,
    selectedMessage,
    selectedId: activeSelectedId,
    setSelectedId,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    unreadCount,
    newlyReceivedCount,
    isSyncing,
    lastSyncTime,
    syncWithDatabase,
    simulateIncomingMessage,
    markAsRead,
    archiveMessage,
    deleteMessage,
  };
}
