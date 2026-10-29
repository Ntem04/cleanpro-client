import { AlertTriangle, Loader2 } from "lucide-react";
import type { AdminAccountItem } from "../../../../services/dashboardServicesApi";

interface DeleteAdminModalProps {
  readonly admin: AdminAccountItem | null;
  readonly isSubmitting: boolean;
  readonly onClose: () => void;
  readonly onConfirm: (id: string) => Promise<void>;
}

export default function DeleteAdminModal({
  admin,
  isSubmitting,
  onClose,
  onConfirm,
}: DeleteAdminModalProps) {
  if (!admin) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-admin-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-red-600">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle size={20} aria-hidden={true} />
          </div>
          <div>
            <h2 id="delete-admin-modal-title" className="text-base font-bold text-[#15364a]">
              Supprimer le compte administrateur
            </h2>
            <p className="text-sm text-slate-500">Cette action est irréversible</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Êtes-vous sûr de vouloir supprimer définitivement le compte de{" "}
          <strong className="text-[#15364a]">{admin.name}</strong> ({admin.email}) ?
          Tous ses droits d'accès au tableau de bord CleanPro seront révoqués immédiatement.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => void onConfirm(admin.id)}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-red-700 disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" aria-hidden={true} />
            ) : null}
            <span>Supprimer définitivement</span>
          </button>
        </div>
      </div>
    </div>
  );
}

