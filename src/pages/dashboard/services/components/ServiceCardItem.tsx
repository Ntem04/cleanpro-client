import { CheckCircle2, Edit3 } from "lucide-react";
import type { ServiceCatalogItem } from "../../../../services/dashboardServicesApi";
import { getServiceImage } from "../utils/serviceImages";

interface ServiceCardItemProps {
  readonly service: ServiceCatalogItem;
  readonly isSelected: boolean;
  readonly onSelect: (service: ServiceCatalogItem) => void;
}

export default function ServiceCardItem({
  service,
  isSelected,
  onSelect,
}: ServiceCardItemProps) {
  const imgSrc = getServiceImage(service.image || service.id);

  return (
    <article
      aria-labelledby={`service-title-${service.id}`}
      className={`group relative flex flex-col gap-4 rounded-xl border bg-white p-4 transition-all duration-200 sm:flex-row sm:items-start ${
        isSelected
          ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
          : "border-slate-200/80 hover:border-slate-300 hover:shadow-xs shadow-none"
      }`}
    >
      {/* Bouton icône discrète en haut à droite (crayon) pour modifier */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(service);
        }}
        aria-label={`Éditer ${service.title}`}
        className={`absolute right-3.5 top-3.5 transition focus-visible:outline-2 focus-visible:outline-[#135d3b] ${
          isSelected ? "text-[#135d3b]" : "text-slate-400 hover:text-[#135d3b]"
        }`}
      >
        <Edit3 size={15} aria-hidden={true} />
      </button>

      {/* Vignette photo du service */}
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg sm:h-36 sm:w-44 border border-slate-100">
        <img
          src={imgSrc}
          alt={`Illustration du service ${service.title}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
          loading="lazy"
        />
      </div>

      {/* Détails du service */}
      <div className="flex flex-1 flex-col justify-between pr-4 sm:pr-6">
        <div>
          <h2
            id={`service-title-${service.id}`}
            className="text-sm font-bold text-[#15364a]"
          >
            {service.title}
          </h2>

          <p className="mt-1 text-sm leading-relaxed text-slate-500 line-clamp-3">
            {service.description}
          </p>

          {/* Liste de prestations / checklist */}
          <ul
            aria-label={`Prestations incluses pour ${service.title}`}
            className="mt-3 space-y-1.5"
          >
            {service.prestations.map((prestation) => (
              <li
                key={`${service.id}-${prestation}`}
                className="flex items-start gap-2 text-sm text-slate-600"
              >
                <CheckCircle2
                  size={14}
                  aria-hidden={true}
                  className="mt-0.5 shrink-0 text-[#135d3b]"
                />
                <span className="leading-snug">{prestation}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pied de carte : Badge et bouton d'action */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            {isSelected && (
              <span className="inline-flex items-center rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-[13px] font-semibold text-slate-800">
                Sélectionné
              </span>
            )}
            
            {/* Badge de statut du service */}
            {service.status === "disponible" && (
              <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-700">
                ● Disponible
              </span>
            )}
            {service.status === "indisponible" && (
              <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-sm font-medium text-amber-800">
                ● Indisponible
              </span>
            )}
            {service.status === "desactive" && (
              <span className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-sm font-medium text-red-700">
                ● Maintenance
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(service);
            }}
            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-[#135d3b] ${
              isSelected
                ? "border-emerald-600 bg-[#135d3b] text-white shadow-2xs hover:bg-[#0f4d30]"
                : "border-slate-200/90 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-[#135d3b]"
            }`}
          >
            <Edit3 size={13} aria-hidden={true} />
            <span>Modifier</span>
          </button>
        </div>
      </div>
    </article>
  );
}
