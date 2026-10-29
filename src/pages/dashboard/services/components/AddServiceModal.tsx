import { useState, type FormEvent } from "react";
import { X, Plus, Trash2, CheckCircle, Image as ImageIcon } from "lucide-react";
import type {
  CreateServicePayload,
  ServiceAvailabilityStatus,
} from "../../../../services/dashboardServicesApi";

interface AddServiceModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (payload: CreateServicePayload) => Promise<boolean>;
}

export default function AddServiceModal({
  isOpen,
  onClose,
  onSubmit,
}: AddServiceModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prestations, setPrestations] = useState<string[]>([
    "Prestation principale",
    "Prestation complémentaire",
  ]);
  const [newPrestation, setNewPrestation] = useState("");
  const [status, setStatus] = useState<ServiceAvailabilityStatus>("disponible");
  const [image, setImage] = useState("services-bureaux0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddPrestation = () => {
    const trimmed = newPrestation.trim().replace(/[<>]/g, "");
    if (trimmed.length > 0 && !prestations.includes(trimmed)) {
      setPrestations([...prestations, trimmed]);
      setNewPrestation("");
    }
  };

  const handleRemovePrestation = (index: number) => {
    setPrestations(prestations.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg("Veuillez renseigner le titre et la description du service.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const success = await onSubmit({
      title: title.trim(),
      description: description.trim(),
      prestations,
      status,
      image,
    });

    setIsSubmitting(false);

    if (success) {
      // Réinitialiser le formulaire et fermer la modal
      setTitle("");
      setDescription("");
      setPrestations(["Prestation principale", "Prestation complémentaire"]);
      setStatus("disponible");
      onClose();
    } else {
      setErrorMsg("Une erreur est survenue lors de l'enregistrement dans la base de données.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-service-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Overlay accessible */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2
              id="add-service-title"
              className="text-base font-bold text-[#15364a]"
            >
              Ajouter un nouveau service
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Prépare l'insertion dans le catalogue et la base de données CleanPro.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la boîte de dialogue"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-[#135d3b]"
          >
            <X size={18} aria-hidden={true} />
          </button>
        </div>

        {/* Message d'erreur */}
        {errorMsg && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-2.5 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Titre */}
          <div>
            <label
              htmlFor="new-service-title"
              className="block text-sm font-semibold text-slate-700"
            >
              Titre du service *
            </label>
            <input
              id="new-service-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.replace(/[<>]/g, ""))}
              placeholder="ex: Nettoyage Médical & Cliniques"
              required
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="new-service-desc"
              className="block text-sm font-semibold text-slate-700"
            >
              Description *
            </label>
            <textarea
              id="new-service-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value.replace(/[<>]/g, ""))}
              placeholder="Décrivez les prestations et le champ d'intervention..."
              required
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
            />
          </div>

          {/* Sélection de l'image de référence */}
          <div>
            <label
              htmlFor="new-service-image"
              className="block text-sm font-semibold text-slate-700"
            >
              Image d'illustration
            </label>
            <div className="mt-1 flex items-center gap-3">
              <select
                id="new-service-image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
              >
                <option value="services-bureaux0">Bureaux & Espaces professionnels</option>
                <option value="services-residences">Résidences & Appartements</option>
                <option value="industriesImage">Industries & Entrepôts</option>
                <option value="services-publics">Espaces publics & Événements</option>
              </select>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 shrink-0">
                <ImageIcon size={16} aria-hidden={true} />
                <span>Format WebP</span>
              </div>
            </div>
          </div>

          {/* Prestations */}
          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Prestations incluses ({prestations.length})
            </label>
            <div className="mt-1.5 space-y-2">
              {prestations.map((presta, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-3 py-1.5 text-sm"
                >
                  <span className="text-slate-700">{presta}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePrestation(idx)}
                    aria-label={`Supprimer ${presta}`}
                    className="text-slate-400 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-red-500"
                  >
                    <Trash2 size={13} aria-hidden={true} />
                  </button>
                </div>
              ))}
            </div>

            {/* Ajout d'une prestation */}
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                value={newPrestation}
                onChange={(e) => setNewPrestation(e.target.value.replace(/[<>]/g, ""))}
                placeholder="Ajouter une prestation..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddPrestation();
                  }
                }}
                className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
              />
              <button
                type="button"
                onClick={handleAddPrestation}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#135d3b]"
              >
                <Plus size={13} aria-hidden={true} />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          {/* Statut de disponibilité */}
          <div>
            <label
              htmlFor="new-service-status"
              className="block text-sm font-semibold text-slate-700"
            >
              Statut de disponibilité
            </label>
            <select
              id="new-service-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ServiceAvailabilityStatus)}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
            >
              <option value="disponible">Disponible (Accessible aux réservations)</option>
              <option value="indisponible">Indisponible (Temporairement suspendu)</option>
              <option value="desactive">Désactivé (Maintenance du site / refonte)</option>
            </select>
          </div>

          {/* Pied de modal avec boutons */}
          <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-slate-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#135d3b] px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#0f4d30] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-[#135d3b]"
            >
              <CheckCircle size={14} aria-hidden={true} />
              <span>{isSubmitting ? "Enregistrement en BDD..." : "Créer le service"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

