import { useRef, useState, type ChangeEvent } from "react";
import { Camera, AlertCircle } from "lucide-react";
import type { SettingsProfileData } from "../../../../services/dashboardServicesApi";
import { validateImageUpload, sanitizeAvatarUrl } from "../../../../utils/securityUtils";
import AdminAvatar from "../../components/AdminAvatar";

interface ProfileCardProps {
  readonly profile: SettingsProfileData;
  readonly onChange: (updated: Partial<SettingsProfileData>) => void;
}

/**
 * Carte Profil — Informations et photo de la responsable d'agence
 * Sécurisée selon les directives OWASP ASVS V5 et ANSSI (Validation MIME, Anti-XSS CWE-79, Quota CWE-400)
 */
export default function ProfileCard({ profile, onChange }: ProfileCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handlePhotoClick = () => {
    setUploadError(null);
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validation de sécurité stricte du fichier (CWE-434, CWE-400)
    const validation = validateImageUpload(file);
    if (!validation.valid) {
      setUploadError(validation.error || "Fichier invalide");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploadError(null);

    // 2. Lecture sécurisée et conversion en mémoire
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // 3. Assainissement anti-XSS et conformité DataURI (CWE-79)
        const sanitized = sanitizeAvatarUrl(reader.result);
        if (sanitized) {
          onChange({ avatarUrl: sanitized });
        } else {
          setUploadError("Le format de l'image est corrompu ou non autorisé.");
        }
      }
    };
    reader.onerror = () => {
      setUploadError("Erreur lors de la lecture du fichier image.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* En-tête de la carte */}
        <div className="mb-5">
          <h2 className="text-base font-bold text-[#15364a]">Profil</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Informations de la responsable d'agence
          </p>
        </div>

        {/* Message d'erreur de sécurité éventuel */}
        {uploadError && (
          <div
            role="alert"
            className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <AlertCircle size={16} className="shrink-0" aria-hidden={true} />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Ligne Avatar & bouton "Modifier la photo" */}
        <div className="flex items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {/* Avatar sécurisé connecté à la BDD */}
            <AdminAvatar
              size="lg"
              customUrl={profile.avatarUrl}
              customName={profile.name}
            />

            <div className="min-w-0">
              <p className="font-bold text-[#15364a] text-sm truncate">
                {profile.name || "Amina Diallo"}
              </p>
              <p className="text-sm text-slate-500 truncate">
                {profile.role || "Responsable d'agence"}
              </p>
            </div>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoUpload}
              aria-label="Sélectionner une photo de profil (formats acceptés : JPEG, PNG, WebP)"
            />
            <button
              type="button"
              onClick={handlePhotoClick}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#135d3b]"
            >
              <Camera size={15} aria-hidden={true} />
              <span>Modifier la photo</span>
            </button>
          </div>
        </div>

        {/* Champs du formulaire */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="settings-profile-name"
              className="block text-sm font-semibold text-[#15364a] mb-1.5"
            >
              Nom
            </label>
            <input
              id="settings-profile-name"
              type="text"
              value={profile.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Nom complet"
              className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b]"
            />
          </div>

          <div>
            <label
              htmlFor="settings-profile-role"
              className="block text-sm font-semibold text-[#15364a] mb-1.5"
            >
              Fonction
            </label>
            <input
              id="settings-profile-role"
              type="text"
              value={profile.role}
              onChange={(e) => onChange({ role: e.target.value })}
              placeholder="Fonction ou poste"
              className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b]"
            />
          </div>

          <div>
            <label
              htmlFor="settings-profile-email"
              className="block text-sm font-semibold text-[#15364a] mb-1.5"
            >
              E-mail professionnel
            </label>
            <input
              id="settings-profile-email"
              type="text"
              value={profile.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="À compléter"
              className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
