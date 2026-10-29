import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Reveal from "../../../components/ui/Reveal";
import { useSettings } from "./hooks/useSettings";
import { useAdminProfile } from "../context/useAdminProfile";
import SettingsHeader from "./components/SettingsHeader";
import ProfileCard from "./components/ProfileCard";
import CompanyCard from "./components/CompanyCard";
import ContactCard from "./components/ContactCard";
import OpeningHoursCard from "./components/OpeningHoursCard";
import AdminAccountsCard from "./components/AdminAccountsCard";
import SettingsFooter from "./components/SettingsFooter";
import type { SettingsApiResponse } from "../../../services/dashboardServicesApi";

interface SettingsFormProps {
  readonly initialData: SettingsApiResponse;
  readonly isSaving: boolean;
  readonly onSave: (data: SettingsApiResponse) => void;
  readonly onCancel: () => void;
}

/**
 * Formulaire interactif des réglages avec état local autonome
 */
function SettingsForm({
  initialData,
  isSaving,
  onSave,
  onCancel,
}: SettingsFormProps) {
  const [formData, setFormData] = useState<SettingsApiResponse>(initialData);

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      {/* En-tête principal */}
      <Reveal direction="down" delay={40} immediate={true}>
        <SettingsHeader
          isSaving={isSaving}
          onSave={handleSubmit}
          onCancel={onCancel}
        />
      </Reveal>

      {/* Grille des 5 cartes de réglages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carte 1 : Profil */}
        <Reveal direction="up" delay={80} immediate={true}>
          <ProfileCard
            profile={formData.profile}
            onChange={(updated) =>
              setFormData((prev) => ({
                ...prev,
                profile: { ...prev.profile, ...updated },
              }))
            }
          />
        </Reveal>

        {/* Carte 2 : Entreprise */}
        <Reveal direction="up" delay={140} immediate={true}>
          <CompanyCard
            company={formData.company}
            onChange={(updated) =>
              setFormData((prev) => ({
                ...prev,
                company: { ...prev.company, ...updated },
              }))
            }
          />
        </Reveal>

        {/* Carte 3 : Coordonnées */}
        <Reveal direction="up" delay={200} immediate={true}>
          <ContactCard
            contact={formData.contact}
            onChange={(updated) =>
              setFormData((prev) => ({
                ...prev,
                contact: { ...prev.contact, ...updated },
              }))
            }
          />
        </Reveal>

        {/* Carte 4 : Horaires d'ouverture */}
        <Reveal direction="up" delay={260} immediate={true}>
          <OpeningHoursCard
            hours={formData.openingHours}
            onChange={(updated) =>
              setFormData((prev) => ({
                ...prev,
                openingHours: { ...prev.openingHours, ...updated },
              }))
            }
          />
        </Reveal>

        {/* Carte 5 : Comptes administrateurs (Gestion, création et suppression) */}
        <Reveal direction="up" delay={320} immediate={true} className="col-span-1 lg:col-span-2">
          <AdminAccountsCard />
        </Reveal>
      </div>

      {/* Pied de page du formulaire avec mention explicative */}
      <Reveal direction="up" delay={380} immediate={true}>
        <SettingsFooter />
      </Reveal>
    </div>
  );
}

/**
 * SettingsPage — Page complète des Paramètres du Dashboard CleanPro
 * Conforme pixel-perfect à la maquette et aux directives graphiques & BDD
 */
export default function SettingsPage() {
  const {
    settings,
    isLoading,
    isSaving,
    isError,
    saveSettings,
    resetSettings,
  } = useSettings();

  const { updateProfile } = useAdminProfile();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formKey, setFormKey] = useState<number>(0);

  // Enregistrement des données vers le service API / BDD
  const handleSave = async (data: SettingsApiResponse) => {
    const success = await saveSettings(data);
    if (success) {
      // Synchronise immédiatement le profil (nom, email, photo) avec le contexte centralisé et la BDD
      if (data.profile) {
        await updateProfile({
          name: data.profile.name,
          email: data.profile.email,
          avatarUrl: data.profile.avatarUrl,
        });
      }

      setToastMessage("Paramètres enregistrés avec succès.");
      setFormKey((k) => k + 1);
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    } else {
      setToastMessage("Erreur lors de l'enregistrement des paramètres.");
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  };

  // Annulation et réinitialisation des valeurs
  const handleCancel = () => {
    resetSettings();
    setFormKey((k) => k + 1);
    setToastMessage("Modifications réinitialisées.");
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
    return () => clearTimeout(timer);
  };

  return (
    <div className="relative space-y-6">
      {/* Toast de confirmation / notification d'enregistrement */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-lg bg-[#135d3b] px-4 py-3 text-sm font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-3"
        >
          <CheckCircle2 size={18} className="shrink-0" aria-hidden={true} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Message d'erreur éventuel de connexion API */}
      {isError && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={18} className="shrink-0" aria-hidden={true} />
          <span>
            Une erreur est survenue lors de la communication avec le serveur. Les
            données locales sont utilisées.
          </span>
        </div>
      )}

      {/* Skeleton de chargement anti-CLS si données en cours de récupération */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
          <div className="h-64 rounded-xl bg-slate-100" />
          <div className="h-64 rounded-xl bg-slate-100" />
          <div className="h-64 rounded-xl bg-slate-100" />
          <div className="h-64 rounded-xl bg-slate-100" />
          <div className="col-span-1 lg:col-span-2 h-44 rounded-xl bg-slate-100" />
        </div>
      ) : (
        <SettingsForm
          key={formKey}
          initialData={settings}
          isSaving={isSaving}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
