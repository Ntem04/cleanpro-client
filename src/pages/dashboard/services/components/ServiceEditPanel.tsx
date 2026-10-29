import { useState, type FormEvent } from "react";
import { Image as ImageIcon, Check, AlertCircle } from "lucide-react";
import type { ServiceCatalogItem } from "../../../../services/dashboardServicesApi";
import { getServiceImage } from "../utils/serviceImages";

interface ServiceEditPanelProps {
  readonly service: ServiceCatalogItem;
  readonly onSave: (updated: Partial<ServiceCatalogItem>) => Promise<boolean>;
  readonly onCancel: () => void;
}

export default function ServiceEditPanel({
  service,
  onSave,
  onCancel,
}: ServiceEditPanelProps) {
  // Le composant est remonté ou clé-synchronisé avec l'id du service pour éviter set-state-in-effect
  return (
    <ServiceEditForm
      key={service.id}
      service={service}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
}

function ServiceEditForm({
  service,
  onSave,
  onCancel,
}: ServiceEditPanelProps) {
  const [title, setTitle] = useState(service.title);
  const [description, setDescription] = useState(service.description);
  const [prestations, setPrestations] = useState<string[]>([...service.prestations]);
  const [status, setStatus] = useState(service.status || "Non renseigné");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "success" | "error">("idle");

  const handlePrestationChange = (index: number, val: string) => {
    const sanitized = val.replace(/[<>]/g, "");
    setPrestations((prev) => {
      const copy = [...prev];
      copy[index] = sanitized;
      return copy;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback("idle");

    const ok = await onSave({
      title: title.trim(),
      description: description.trim(),
      prestations: prestations.filter((p) => p.trim().length > 0),
      status,
    });

    setIsSubmitting(false);
    if (ok) {
      setFeedback("success");
      setTimeout(() => setFeedback("idle"), 3000);
    } else {
      setFeedback("error");
    }
  };

  const currentImage = getServiceImage(service.image || service.id);

  return (
    <div className="space-y-4">
      {/* Formulaire d'édition */}
      <section
        aria-labelledby="edit-service-panel-heading"
        className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs"
      >
        <div className="border-b border-slate-100 pb-3">
          <h2
            id="edit-service-panel-heading"
            className="text-sm font-bold text-[#15364a]"
          >
            Modifier le service
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">{service.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Champ Titre */}
          <div>
            <label
              htmlFor="service-title-input"
              className="block text-sm font-semibold text-slate-700"
            >
              Titre
            </label>
            <input
              id="service-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.replace(/[<>]/g, ""))}
              required
              className="mt-1.5 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
            />
          </div>

          {/* Champ Description */}
          <div>
            <label
              htmlFor="service-desc-input"
              className="block text-sm font-semibold text-slate-700"
            >
              Description
            </label>
            <textarea
              id="service-desc-input"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value.replace(/[<>]/g, ""))}
              required
              className="mt-1.5 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm leading-relaxed text-slate-800 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
            />
          </div>

          {/* Visuel Photo Preview & Bouton Remplacer */}
          <div>
            <span className="block text-sm font-semibold text-slate-700">
              Photo
            </span>
            <div className="mt-1.5 overflow-hidden rounded-lg border border-slate-200">
              <img
                src={currentImage}
                alt={`Aperçu visuel actuel pour ${title}`}
                className="h-36 w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="mt-2">
              <button
                type="button"
                onClick={() => alert("La sélection et téléversement de nouvelles photos sera synchronisée avec le stockage cloud du backend.")}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#135d3b]"
              >
                <ImageIcon size={14} aria-hidden={true} />
                <span>Remplacer la photo</span>
              </button>
            </div>
          </div>

          {/* Prestations (3 champs distincts selon la capture) */}
          <div className="space-y-2">
            <span className="block text-sm font-semibold text-slate-700">
              Prestations
            </span>
            {prestations.map((presta, idx) => (
              <div key={idx}>
                <label
                  htmlFor={`prestation-input-${idx}`}
                  className="sr-only"
                >
                  Prestation {idx + 1}
                </label>
                <input
                  id={`prestation-input-${idx}`}
                  type="text"
                  value={presta}
                  onChange={(e) => handlePrestationChange(idx, e.target.value)}
                  placeholder={`Prestation ${idx + 1}`}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
                />
              </div>
            ))}
          </div>

          {/* Champ Statut */}
          <div>
            <label
              htmlFor="service-status-select"
              className="block text-sm font-semibold text-slate-700"
            >
              Statut
            </label>
            <select
              id="service-status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as "disponible" | "indisponible" | "desactive")}
              className="mt-1.5 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition focus:border-[#135d3b] focus:outline-hidden focus:ring-1 focus:ring-[#135d3b]"
            >
              <option value="disponible">Disponible</option>
              <option value="indisponible">Indisponible</option>
              <option value="desactive">Désactivé (Maintenance du site)</option>
            </select>
          </div>

          {/* Notification feedback */}
          {feedback === "success" && (
            <div className="flex items-center gap-2 rounded-md bg-slate-50 p-2.5 text-sm text-slate-800 border border-slate-200">
              <Check size={14} className="text-[#135d3b]" aria-hidden={true} />
              <span>Modifications enregistrées avec succès.</span>
            </div>
          )}
          {feedback === "error" && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 p-2.5 text-sm text-red-700 border border-red-200">
              <AlertCircle size={14} aria-hidden={true} />
              <span>Une erreur est survenue lors de l'enregistrement.</span>
            </div>
          )}

          {/* Boutons d'action : Enregistrer & Annuler */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md bg-[#135d3b] px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-[#0f4d30] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-[#135d3b]"
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-slate-400"
            >
              Annuler
            </button>
          </div>
        </form>
      </section>

      {/* Bloc Info : Un catalogue fidèle à la référence */}
      <aside
        aria-label="Informations sur le catalogue de référence"
        className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm"
      >
        <h3 className="font-bold text-[#15364a]">
          Un catalogue fidèle à la référence
        </h3>
        <p className="mt-1 leading-relaxed text-slate-600">
          Les photos, descriptions et prestations proviennent de la page Nos Services. Les informations de publication restent à compléter.
        </p>
      </aside>
    </div>
  );
}
