import { useRef, useState, type ChangeEvent } from "react";
import { Camera, AlertCircle } from "lucide-react";
import type { SettingsCompanyData } from "../../../../services/dashboardServicesApi";
import {
  validateImageUpload,
  sanitizeAvatarUrl,
} from "../../../../utils/securityUtils";
import defaultLogo from "../../../../assets/icon.webp";

interface CompanyCardProps {
  readonly company: SettingsCompanyData;
  readonly onChange: (updated: Partial<SettingsCompanyData>) => void;
}

/**
 * Carte Entreprise — Identité CleanPro, logo et signature officielle
 * Sécurisée selon les directives OWASP ASVS V5 et ANSSI (Anti-XSS, Quotas, Whitelisting)
 */
export default function CompanyCard({ company, onChange }: CompanyCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleLogoClick = () => {
    setUploadError(null);
    fileInputRef.current?.click();
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
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
          onChange({ logoUrl: sanitized });
        } else {
          setUploadError("Le format du logo est corrompu ou non autorisé.");
        }
      }
    };
    reader.onerror = () => {
      setUploadError("Erreur lors de la lecture du fichier logo.");
    };
    reader.readAsDataURL(file);
  };

  const safeLogoUrl = sanitizeAvatarUrl(company.logoUrl);
  const logoSource = safeLogoUrl || defaultLogo;

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* En-tête de la carte */}
        <div className="mb-5">
          <h2 className="text-base font-bold text-[#15364a]">Entreprise</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Identité CleanPro de la référence
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

        {/* Ligne Logo & bouton "Modifier le logo" */}
        <div className="flex items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-1.5">
              <img
                src={logoSource}
                alt={`Logo officiel de ${company.name || "CleanPro"}`}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <p className="font-bold text-[#15364a] text-sm truncate">
                {company.name || "CleanPro"}
              </p>
              <p className="text-sm text-slate-500 truncate">
                {company.signature || "Services de Nettoyage"}
              </p>
            </div>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleLogoUpload}
              aria-label="Sélectionner un nouveau logo officiel"
            />
            <button
              type="button"
              onClick={handleLogoClick}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#135d3b]"
            >
              <Camera size={15} aria-hidden={true} />
              <span>Modifier le logo</span>
            </button>
          </div>
        </div>

        {/* Champs du formulaire */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="settings-company-name"
              className="block text-sm font-semibold text-[#15364a] mb-1.5"
            >
              Nom de l'entreprise
            </label>
            <input
              id="settings-company-name"
              type="text"
              value={company.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Nom de l'entreprise"
              className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b]"
            />
          </div>

          <div>
            <label
              htmlFor="settings-company-signature"
              className="block text-sm font-semibold text-[#15364a] mb-1.5"
            >
              Signature
            </label>
            <input
              id="settings-company-signature"
              type="text"
              value={company.signature}
              onChange={(e) => onChange({ signature: e.target.value })}
              placeholder="Slogan ou signature d'entreprise"
              className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
