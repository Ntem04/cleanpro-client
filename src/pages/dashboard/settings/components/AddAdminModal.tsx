import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { X, UserPlus, Camera, KeyRound, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import type { CreateAdminPayload } from "../../../../services/dashboardServicesApi";
import {
  validateImageUpload,
  sanitizeAvatarUrl,
  sanitizeText,
  getSafeInitials,
} from "../../../../utils/securityUtils";

interface AddAdminModalProps {
  readonly isOpen: boolean;
  readonly isSubmitting: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (payload: CreateAdminPayload) => Promise<{ success: boolean; error?: string }>;
}

/** Génère un mot de passe aléatoire fort conforme OWASP/ANSSI (16 caractères avec majuscule, minuscule, chiffre et symbole) */
function generateStrongPassword(): string {
  const lowers = "abcdefghjkmnpqrstuvwxyz";
  const uppers = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const numbers = "23456789";
  const symbols = "!@#$%^&*";
  const all = lowers + uppers + numbers + symbols;

  const guaranteed = [
    lowers[Math.floor(Math.random() * lowers.length)],
    uppers[Math.floor(Math.random() * uppers.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  const array = new Uint8Array(12);
  crypto.getRandomValues(array);
  const remaining = Array.from(array, (byte) => all[byte % all.length]);

  return [...guaranteed, ...remaining].sort(() => Math.random() - 0.5).join("");
}

export default function AddAdminModal({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: AddAdminModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Administrateur");
  const [password, setPassword] = useState(() => generateStrongPassword());
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageUpload(file);
    if (!validation.valid) {
      setFormError(validation.error || "Fichier image invalide.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFormError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const safe = sanitizeAvatarUrl(reader.result);
        if (safe) {
          setAvatarUrl(safe);
        } else {
          setFormError("Format d'image non sécurisé.");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanName = sanitizeText(name);
    const cleanEmail = sanitizeText(email).toLowerCase();

    if (!cleanName || cleanName.length < 2) {
      setFormError("Veuillez saisir un nom complet valide (au moins 2 caractères).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setFormError("Veuillez saisir une adresse e-mail professionnelle valide.");
      return;
    }

    if (!password || password.length < 12) {
      setFormError("Le mot de passe doit comporter au moins 12 caractères.");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      setFormError("Le mot de passe doit comporter au moins une majuscule, une minuscule, un chiffre et un caractère spécial.");
      return;
    }

    const res = await onSubmit({
      name: cleanName,
      email: cleanEmail,
      role,
      password,
      avatarUrl: avatarUrl ? sanitizeAvatarUrl(avatarUrl) || "" : "",
    });

    if (res.success) {
      // Réinitialiser les champs et fermer
      setName("");
      setEmail("");
      setAvatarUrl("");
      onClose();
    } else {
      setFormError(res.error || "Erreur lors de la création de l'administrateur.");
    }
  };

  const initials = getSafeInitials(name || "Nouveau Admin");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-admin-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
        {/* En-tête de la modale */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 id="add-admin-modal-title" className="text-lg font-bold text-[#15364a]">
              Ajouter un administrateur
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Créez un nouvel accès administrateur au tableau de bord CleanPro
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la modale"
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={18} aria-hidden={true} />
          </button>
        </div>

        {/* Message d'erreur éventuel */}
        {formError && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <AlertCircle size={16} className="shrink-0" aria-hidden={true} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ligne Photo de profil optionnelle */}
          <div className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-[#15364a] text-white font-bold text-sm">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Aperçu photo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span aria-hidden={true}>{initials}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#15364a]">Photo de profil</p>
              <p className="text-sm text-slate-500">Optionnelle (JPEG, PNG, WebP max 2 Mo)</p>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <Camera size={15} aria-hidden={true} />
                <span>Choisir</span>
              </button>
            </div>
          </div>

          {/* Nom complet */}
          <div>
            <label htmlFor="admin-add-name" className="block text-sm font-semibold text-[#15364a] mb-1.5">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              id="admin-add-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Jean Dupont"
              className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-[#135d3b] focus:ring-1 focus:ring-[#135d3b] focus:outline-none"
            />
          </div>

          {/* E-mail professionnel */}
          <div>
            <label htmlFor="admin-add-email" className="block text-sm font-semibold text-[#15364a] mb-1.5">
              E-mail professionnel <span className="text-red-500">*</span>
            </label>
            <input
              id="admin-add-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jean.dupont@cleanpro.cm"
              className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-[#135d3b] focus:ring-1 focus:ring-[#135d3b] focus:outline-none"
            />
          </div>

          {/* Rôle */}
          <div>
            <label htmlFor="admin-add-role" className="block text-sm font-semibold text-[#15364a] mb-1.5">
              Rôle d'administration <span className="text-red-500">*</span>
            </label>
            <select
              id="admin-add-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-[#135d3b] focus:ring-1 focus:ring-[#135d3b] focus:outline-none"
            >
              <option value="Administrateur">Administrateur</option>
              <option value="Responsable d'agence">Responsable d'agence</option>
              <option value="Super Administrateur">Super Administrateur</option>
            </select>
          </div>

          {/* Mot de passe temporaire */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="admin-add-password" className="text-sm font-semibold text-[#15364a]">
                Mot de passe temporaire <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setPassword(generateStrongPassword())}
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#135d3b] hover:underline"
              >
                <RefreshCw size={13} aria-hidden={true} />
                <span>Régénérer</span>
              </button>
            </div>
            <div className="relative">
              <input
                id="admin-add-password"
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm font-mono text-slate-800 focus:border-[#135d3b] focus:ring-1 focus:ring-[#135d3b] focus:outline-none"
              />
              <KeyRound
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden={true}
              />
            </div>
            <p className="mt-1 text-[13px] text-slate-400">
              Le futur administrateur sera invité à modifier ce mot de passe dès sa première connexion.
            </p>
          </div>

          {/* Actions de la modale */}
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
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-md bg-[#135d3b] px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-[#0f4d30] disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" aria-hidden={true} />
              ) : (
                <UserPlus size={16} aria-hidden={true} />
              )}
              <span>Créer le compte</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

