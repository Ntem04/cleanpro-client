import { useState } from "react";
import { UserPlus, Trash2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAdminAccounts } from "../hooks/useAdminAccounts";
import type {
  AdminAccountItem,
  CreateAdminPayload,
} from "../../../../services/dashboardServicesApi";
import { getSafeInitials } from "../../../../utils/securityUtils";
import AddAdminModal from "./AddAdminModal";
import DeleteAdminModal from "./DeleteAdminModal";

/**
 * Carte Comptes Administrateurs — Gestion des accès, création et révocation des comptes administrateurs
 * Remplace l'ancien bloc des préférences de notification selon la demande utilisateur
 */
export default function AdminAccountsCard() {
  const { admins, isLoading, isSubmitting, addAdmin, removeAdmin } =
    useAdminAccounts();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<AdminAccountItem | null>(
    null,
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
  };

  const handleCreateAdmin = async (payload: CreateAdminPayload) => {
    const res = await addAdmin(payload);
    if (res.success) {
      showFeedback(
        `Le compte administrateur pour ${payload.name} a été créé avec succès.`,
      );
    }
    return res;
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!adminToDelete) return;
    const res = await removeAdmin(id);
    if (res.success) {
      showFeedback(`Le compte de ${adminToDelete.name} a été supprimé.`);
      setAdminToDelete(null);
    } else {
      showFeedback(res.error || "Erreur lors de la suppression.");
    }
  };

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
      {/* Toast / Bannière de feedback locale */}
      {feedbackMessage && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2.5 rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm font-semibold text-slate-800 animate-in fade-in"
        >
          <CheckCircle2
            size={16}
            className="text-[#135d3b] shrink-0"
            aria-hidden={true}
          />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* En-tête de la carte avec bouton d'ajout */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#15364a]">
              Comptes administrateurs
            </h2>
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[13px] font-semibold text-slate-700 border border-slate-200">
              {admins.length} actif{admins.length > 1 ? "s" : ""}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-slate-500">
            Consultez, créez et gérez les accès des futurs administrateurs de
            l'agence CleanPro
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#135d3b] px-3.5 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-[#0f4d30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#135d3b] self-start sm:self-auto"
        >
          <UserPlus size={16} aria-hidden={true} />
          <span>Ajouter un administrateur</span>
        </button>
      </div>

      {/* Tableau / Liste des administrateurs */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-16 rounded-lg bg-slate-100" />
          <div className="h-16 rounded-lg bg-slate-100" />
        </div>
      ) : (
        <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">
                <th scope="col" className="pb-3 pr-4">
                  Administrateur
                </th>
                <th scope="col" className="pb-3 px-4">
                  Rôle
                </th>
                <th scope="col" className="pb-3 px-4">
                  Date d'accès
                </th>
                <th scope="col" className="pb-3 pl-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {admins.map((admin) => {
                const initials = getSafeInitials(admin.name);

                return (
                  <tr
                    key={admin.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Colonne Administrateur */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-[#15364a] text-white font-bold text-sm">
                          {admin.avatarUrl ? (
                            <img
                              src={admin.avatarUrl}
                              alt={`Photo de ${admin.name}`}
                              crossOrigin="anonymous"
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span aria-hidden={true}>{initials}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#15364a] truncate">
                            {admin.name}
                          </p>
                          <p className="text-slate-400 text-sm truncate">
                            {admin.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Colonne Rôle */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-[13px] font-semibold text-slate-700 border border-slate-200">
                        <ShieldCheck
                          size={14}
                          className="text-slate-500"
                          aria-hidden={true}
                        />
                        <span>{admin.role}</span>
                      </span>
                    </td>

                    {/* Colonne Date de création */}
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {admin.createdAt || "Récemment"}
                    </td>

                    {/* Colonne Statut / Actions */}
                    <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                      {admin.isCurrentUser ? (
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[13px] font-medium text-slate-600">
                          Compte connecté
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setAdminToDelete(admin)}
                          title={`Supprimer le compte de ${admin.name}`}
                          className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-2.5 py-1 text-[13px] font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition"
                        >
                          <Trash2 size={13} aria-hidden={true} />
                          <span>Supprimer</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Note d'information de sécurité */}
      <div className="pt-2 text-[13px] text-slate-400">
        Seuls les utilisateurs authentifiés avec les privilèges d'administrateur
        peuvent gérer les accès et créer de nouveaux comptes.
      </div>

      {/* Modale d'ajout d'administrateur */}
      <AddAdminModal
        isOpen={isAddModalOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateAdmin}
      />

      {/* Modale de confirmation de suppression */}
      <DeleteAdminModal
        admin={adminToDelete}
        isSubmitting={isSubmitting}
        onClose={() => setAdminToDelete(null)}
        onConfirm={handleDeleteAdmin}
      />
    </div>
  );
}
