import { Search, Mail, Inbox } from "lucide-react";
import type { MessageItem, MessageFilterTab } from "../types";

interface MessagesSidebarListProps {
  readonly messages: readonly MessageItem[];
  readonly selectedId: string;
  readonly onSelectMessage: (id: string) => void;
  readonly activeTab: MessageFilterTab;
  readonly onTabChange: (tab: MessageFilterTab) => void;
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
}

export default function MessagesSidebarList({
  messages,
  selectedId,
  onSelectMessage,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
}: MessagesSidebarListProps) {
  const tabs: { readonly key: MessageFilterTab; readonly label: string }[] = [
    { key: "unread", label: "Non lus" },
    { key: "read", label: "Lus" },
    { key: "archived", label: "Archivés" },
  ];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs space-y-4">
      {/* Titre de section */}
      <h2 className="text-base font-bold text-[#15364a]">Réception</h2>

      {/* Barre de recherche */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un message..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b] transition-colors"
        />
      </div>

      {/* Boutons d'onglets de filtre */}
      <div className="flex items-center gap-1.5 pt-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#135d3b] text-white shadow-2xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Liste des messages */}
      <div className="space-y-3 pt-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
            <Inbox className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm">Aucun message dans cette section</p>
          </div>
        ) : (
          messages.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <article
                key={item.id}
                onClick={() => onSelectMessage(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectMessage(item.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                className={`relative rounded-lg p-3.5 text-left cursor-pointer transition-all border-l-4 focus-visible:outline-2 focus-visible:outline-[#135d3b] ${
                  isSelected
                    ? "border-[#135d3b] bg-[#eef7f2] shadow-2xs"
                    : "border-transparent bg-white hover:bg-slate-50 border border-slate-200"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 text-[#135d3b]">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-[#15364a] truncate">
                      {item.sender}
                    </h3>
                    <p className="mt-0.5 text-[13px] font-medium text-slate-700">
                      {item.subtitle}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {item.source}
                    </p>
                    <p className="mt-2 text-[13px] italic text-slate-500">
                      {item.snippet}
                    </p>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Bloc d'information documenté dans la capture */}
      <div className="rounded-lg bg-slate-50/70 border border-slate-200/70 p-3.5 mt-6">
        <h4 className="text-[13px] font-bold text-[#15364a]">
          Autres messages non fournis
        </h4>
        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
          Le badge indique 3 messages. Seul le nom Groupe Alpha est visible ; les
          deux autres messages ne sont pas documentés.
        </p>
      </div>
    </div>
  );
}

