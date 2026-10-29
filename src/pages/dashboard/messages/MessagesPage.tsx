import { useRef } from "react";
import Reveal from "../../../components/ui/Reveal";
import { useMessages } from "./hooks/useMessages";
import MessagesHeaderBanner from "./components/MessagesHeaderBanner";
import MessagesSidebarList from "./components/MessagesSidebarList";
import MessageDetailCard from "./components/MessageDetailCard";
import MessageReplyCard from "./components/MessageReplyCard";

export default function MessagesPage() {
  const {
    filteredMessages,
    selectedMessage,
    selectedId,
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
  } = useMessages();

  const replyCardRef = useRef<HTMLDivElement>(null);

  const handleReplyClick = () => {
    if (replyCardRef.current) {
      replyCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      const textarea = replyCardRef.current.querySelector("textarea");
      if (textarea) {
        textarea.focus();
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* En-tête de la page et bannière notification dynamique */}
      <Reveal direction="down" delay={40} immediate={true}>
        <MessagesHeaderBanner
          unreadCount={unreadCount}
          newlyReceivedCount={newlyReceivedCount}
          isSyncing={isSyncing}
          lastSyncTime={lastSyncTime}
          onSync={syncWithDatabase}
          onSimulateIncoming={() => simulateIncomingMessage("Groupe Alpha")}
        />
      </Reveal>

      {/* Grille principale : Boîte de réception (gauche) & Détail + Réponse (droite) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Colonne Gauche : Liste et filtres de messages */}
        <div className="lg:col-span-4">
          <Reveal direction="right" delay={80} immediate={true}>
            <MessagesSidebarList
              messages={filteredMessages}
              selectedId={selectedId}
              onSelectMessage={setSelectedId}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </Reveal>
        </div>

        {/* Colonne Droite : Fiche détail du message et zone de réponse */}
        <div className="lg:col-span-8 space-y-6">
          <Reveal direction="left" delay={100} immediate={true}>
            <MessageDetailCard
              message={selectedMessage}
              onReplyClick={handleReplyClick}
              onMarkAsRead={markAsRead}
              onArchive={archiveMessage}
              onDelete={deleteMessage}
            />
          </Reveal>

          <Reveal direction="up" delay={140} immediate={true}>
            <MessageReplyCard
              ref={replyCardRef}
              messageId={selectedMessage?.id}
              defaultRecipient={selectedMessage ? selectedMessage.sender : ""}
              defaultEmail={selectedMessage?.email}
              onSendSuccess={syncWithDatabase}
            />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
