import { Check, Loader2 } from "lucide-react";

interface SettingsHeaderProps {
  readonly isSaving: boolean;
  readonly onSave: () => void;
  readonly onCancel: () => void;
}

/**
 * En-tête de la page Paramètres avec titre, sous-titre et actions principales
 */
export default function SettingsHeader({
  isSaving,
  onSave,
  onCancel,
}: SettingsHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#15364a]">
          Paramètres
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Profil, identité de l'entreprise et coordonnées CleanPro
        </p>
      </div>

      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#135d3b] disabled:opacity-50"
        >
          Annuler
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#135d3b] px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-[#0f4d30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#135d3b] disabled:opacity-60"
        >
          {isSaving ? (
            <Loader2 size={16} className="animate-spin" aria-hidden={true} />
          ) : (
            <Check size={16} aria-hidden={true} />
          )}
          <span>Enregistrer</span>
        </button>
      </div>
    </div>
  );
}

