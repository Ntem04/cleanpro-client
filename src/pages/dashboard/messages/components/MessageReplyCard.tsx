import { useState, useEffect, forwardRef } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2, Mail } from "lucide-react";
import { dashboardMessagesApi } from "../../../../services/dashboardMessagesApi";

interface MessageReplyCardProps {
  readonly messageId?: string;
  readonly defaultRecipient?: string;
  readonly defaultEmail?: string;
  readonly onSendSuccess?: () => void;
}

const MessageReplyCard = forwardRef<HTMLDivElement, MessageReplyCardProps>(
  function MessageReplyCard(
    { messageId, defaultRecipient = "", defaultEmail = "", onSendSuccess },
    ref
  ) {
    const [recipient, setRecipient] = useState(defaultRecipient);
    const [email, setEmail] = useState(defaultEmail);
    const [replyText, setReplyText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState<string | null>(null);
    const [sendError, setSendError] = useState<string | null>(null);

    // Synchronisation automatique lorsque l'utilisateur sélectionne un autre message dans la liste
    useEffect(() => {
      setRecipient(defaultRecipient);
      setEmail(defaultEmail);
      setSendSuccess(null);
      setSendError(null);
    }, [defaultRecipient, defaultEmail, messageId]);

    const handleSend = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!replyText.trim() || isSending) return;

      setIsSending(true);
      setSendError(null);
      setSendSuccess(null);

      try {
        const targetId = messageId || `msg-${Date.now()}`;
        const targetEmail = (email || defaultEmail).trim();

        await dashboardMessagesApi.sendReply(targetId, {
          content: replyText.trim(),
          replyContent: replyText.trim(),
          recipient: recipient || defaultRecipient,
          recipientEmail: targetEmail || undefined,
        });

        setSendSuccess(
          `Votre réponse a été envoyée avec succès par e-mail à ${recipient || "votre client"}${
            targetEmail ? ` (${targetEmail})` : ""
          } !`
        );
        setReplyText("");

        if (onSendSuccess) {
          onSendSuccess();
        }

        setTimeout(() => {
          setSendSuccess(null);
        }, 8000);
      } catch (error) {
        setSendError(
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Une erreur est survenue lors de l'envoi de l'e-mail. Vérifiez la configuration SMTP."
        );
      } finally {
        setIsSending(false);
      }
    };

    return (
      <section
        ref={ref}
        id="reply-section"
        className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div>
          <h2 className="text-base font-bold text-[#15364a]">Réponse</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Zone de rédaction · {sendSuccess ? "Message envoyé au visiteur" : "Prêt pour envoi direct dans la boîte mail du visiteur"}
          </p>
        </div>

        {sendSuccess && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3.5 text-sm text-[#135d3b]">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{sendSuccess}</span>
          </div>
        )}

        {sendError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3.5 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{sendError}</span>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="reply-recipient"
                className="block text-xs font-semibold text-slate-600 mb-1"
              >
                Destinataire
              </label>
              <input
                id="reply-recipient"
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Nom du client"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="reply-email"
                className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5"
              >
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                Adresse e-mail de réception
              </label>
              <input
                id="reply-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adresse@client.com"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b] transition-colors font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reply-content"
              className="block text-xs font-semibold text-slate-600 mb-1 flex items-center justify-between"
            >
              <span>Votre réponse</span>
              <span className="text-[11px] font-normal text-slate-400">
                {replyText.length} caractères (requis pour activer l'envoi)
              </span>
            </label>
            <textarea
              id="reply-content"
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Rédigez ici votre message... (dès que vous commencez à taper, le bouton 'Envoyer la réponse' s'active en vert)"
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b] transition-colors resize-y"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <p className="text-xs text-slate-400">
              Le message sera expédié par e-mail via Gmail SMTP et audité dans les logs de sécurité.
            </p>

            <button
              type="submit"
              disabled={!replyText.trim() || isSending}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors shadow-2xs cursor-pointer ${
                replyText.trim() && !isSending
                  ? "bg-[#135d3b] hover:bg-[#0f4a2f] text-white"
                  : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed opacity-70"
              }`}
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
                  <span>Envoi de l'e-mail...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  <span>Envoyer la réponse</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    );
  }
);

export default MessageReplyCard;
