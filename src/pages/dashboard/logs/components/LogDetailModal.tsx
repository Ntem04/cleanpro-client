import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  Lock,
} from "lucide-react";
import type { LogItem } from "../types";

interface LogDetailModalProps {
  readonly log: LogItem | null;
  readonly onClose: () => void;
}

export default function LogDetailModal({ log, onClose }: LogDetailModalProps) {
  if (!log) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="log-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-[#135d3b]">
              <Server className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="log-modal-title"
                className="text-base font-bold text-[#15364a]"
              >
                Détail de l&apos;Événement Journalisé
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                ID : {log.id} · {log.type === "audit" ? "Journal d'Audit" : "Journal Technique"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le détail du log"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Corps des informations */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Action principale et badge résultat */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Action exécutée
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  log.result === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {log.result === "success" ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" /> Succès
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" /> Échec
                  </>
                )}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#15364a]">{log.action}</h3>
            <p className="text-xs text-slate-500 font-mono">
              Élément concerné : {log.target}
            </p>
          </div>

          {/* Grille de métadonnées de traçabilité */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3">
              <span className="text-slate-400 block">Horodatage précis</span>
              <span className="font-semibold text-slate-700 font-mono">
                {log.timestamp}
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3">
              <span className="text-slate-400 block">Acteur / Utilisateur</span>
              <span className="font-semibold text-slate-700">{log.user}</span>
              {log.userEmail && (
                <span className="block text-[11px] text-slate-500 font-mono">
                  {log.userEmail}
                </span>
              )}
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3">
              <span className="text-slate-400 block">Adresse IP</span>
              <span className="font-semibold text-slate-700 font-mono">
                {log.ipAddress}
              </span>
            </div>
          </div>

          {/* Détails contextuels */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Description &amp; Contexte Technique
            </h4>
            <div className="rounded-xl bg-slate-50/70 border border-slate-200 p-4 text-xs text-slate-700 leading-relaxed font-mono">
              {log.details}
            </div>
          </div>

          {/* Stack trace / Métadonnées techniques supplémentaires si existantes */}
          {log.metadata && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                <span>Données Techniques Associées</span>
              </h4>
              <div className="rounded-xl bg-slate-900 text-slate-200 p-4 text-xs font-mono space-y-1 overflow-x-auto">
                {log.metadata.httpStatus && (
                  <div>
                    <span className="text-amber-400">HTTP Status :</span> {log.metadata.httpStatus}
                  </div>
                )}
                {log.metadata.attemptsCount && (
                  <div>
                    <span className="text-rose-400">Tentatives d&apos;échec :</span> {log.metadata.attemptsCount}
                  </div>
                )}
                {log.metadata.linesImported !== undefined && (
                  <div>
                    <span className="text-emerald-400">Lignes CSV importées :</span> {log.metadata.linesImported}
                  </div>
                )}
                {log.metadata.oldPrice && log.metadata.newPrice && (
                  <div>
                    <span className="text-sky-400">Tarif modifié :</span> {log.metadata.oldPrice} ➜ {log.metadata.newPrice}
                  </div>
                )}
                {log.metadata.errorStack && (
                  <div className="pt-2 text-rose-300 whitespace-pre-wrap">
                    {log.metadata.errorStack}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Engagement de sécurité et non-divulgation */}
          <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-3.5 flex items-start gap-2.5 text-xs text-[#135d3b]">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <div>
              <span className="font-bold">Garantie de non-divulgation CleanPro :</span>
              <p className="mt-0.5 text-emerald-800">
                Aucun mot de passe (même erroné), aucun jeton de session (JWT/Cookies) et aucun message complet de visiteur n&apos;est enregistré dans ces journaux.
              </p>
            </div>
          </div>
        </div>

        {/* Pied de la modale */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            <span>Fiche protégée en lecture seule</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

