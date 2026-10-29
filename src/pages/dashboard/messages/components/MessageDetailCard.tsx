import {
  CornerUpLeft,
  Check,
  Archive,
  Trash2,
  HelpCircle,
} from "lucide-react";
import type { MessageItem } from "../types";

interface MessageDetailCardProps {
  readonly message: MessageItem | null;
  readonly onReplyClick: () => void;
  readonly onMarkAsRead: (id: string) => void;
  readonly onArchive: (id: string) => void;
  readonly onDelete: (id: string) => void;
}

export default function MessageDetailCard({
  message,
  onReplyClick,
  onMarkAsRead,
  onArchive,
  onDelete,
}: MessageDetailCardProps) {
  if (!message) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white p-12 text-center text-slate-400">
        <p className="text-sm">Sélectionnez un message pour afficher les détails</p>
      </div>
    );
  }

  const isRead = message.status === "read";

  return (
    <article className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-6">
      {/* En-tête : Expéditeur & Boutons d'action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#15364a]">
            {message.sender}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {message.subtitle} · Source : notification
          </p>
        </div>

        {/* Groupe de boutons d'action */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Bouton Répondre */}
          <button
            type="button"
            onClick={onReplyClick}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#135d3b] hover:bg-[#0f4a2f] text-white px-3.5 py-1.5 text-sm font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <CornerUpLeft className="h-4 w-4" aria-hidden="true" />
            <span>Répondre</span>
          </button>

          {/* Bouton Marquer comme lu */}
          <button
            type="button"
            onClick={() => onMarkAsRead(message.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              isRead
                ? "bg-emerald-50 border-emerald-300 text-[#135d3b]"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            <span>{isRead ? "Marqué lu" : "Marquer comme lu"}</span>
          </button>

          {/* Bouton Archiver */}
          <button
            type="button"
            onClick={() => onArchive(message.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors cursor-pointer"
          >
            <Archive className="h-4 w-4" aria-hidden="true" />
            <span>Archiver</span>
          </button>

          {/* Bouton Supprimer */}
          <button
            type="button"
            onClick={() => onDelete(message.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>

      {/* Champs métadonnées E-mail et Sujet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="client-email"
            className="block text-xs font-semibold text-slate-600 mb-1"
          >
            E-mail du client
          </label>
          <input
            id="client-email"
            type="text"
            readOnly
            value={message.email || "À compléter"}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-500 cursor-not-allowed select-all"
          />
        </div>

        <div>
          <label
            htmlFor="client-subject"
            className="block text-xs font-semibold text-slate-600 mb-1"
          >
            Sujet
          </label>
          <input
            id="client-subject"
            type="text"
            readOnly
            value={message.subject || "Non renseigné"}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-500 cursor-not-allowed select-all"
          />
        </div>
      </div>

      {/* Zone centrale : Contenu du message non fourni dans la capture */}
      <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-8 sm:p-12 flex flex-col items-center justify-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 shadow-2xs">
          <HelpCircle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="mt-3 text-base font-semibold text-slate-800">
          Contenu du message non fourni dans la capture
        </h3>
        <p className="mt-1 max-w-md text-xs sm:text-sm text-slate-500 leading-relaxed">
          Le nom du client est connu. Aucun e-mail, sujet ni corps de message
          n&apos;est disponible.
        </p>
      </div>
    </article>
  );
}

