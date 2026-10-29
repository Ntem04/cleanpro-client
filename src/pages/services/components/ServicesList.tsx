import { useState, useEffect } from "react";
import {
  Building2,
  Factory,
  Home,
  Landmark,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import ServiceCard, { type ServiceCardData } from "./ServiceCard";
import {
  dashboardServicesApi,
  type ServiceCatalogItem,
} from "../../../services/dashboardServicesApi";
import { getServiceImage } from "../../dashboard/services/utils/serviceImages";

function getServiceIcons(id: string): { badgeIcon: LucideIcon; highlightIcon: LucideIcon } {
  const lower = id.toLowerCase();
  if (lower.includes("bureau")) {
    return { badgeIcon: Building2, highlightIcon: ShieldCheck };
  }
  if (lower.includes("residence")) {
    return { badgeIcon: Home, highlightIcon: Home };
  }
  if (lower.includes("industrie")) {
    return { badgeIcon: Factory, highlightIcon: Sparkles };
  }
  if (lower.includes("public") || lower.includes("evenement")) {
    return { badgeIcon: Landmark, highlightIcon: Users };
  }
  return { badgeIcon: Sparkles, highlightIcon: ShieldCheck };
}

function mapCatalogToCardData(item: ServiceCatalogItem, index: number): ServiceCardData {
  const { badgeIcon, highlightIcon } = getServiceIcons(item.id);
  const layout = index % 2 === 0 ? "image-left" : "callout-left";

  return {
    id: item.id,
    badgeTitle: item.title,
    badgeIcon,
    tag: "NOS SERVICES",
    title: item.title,
    description: item.description,
    features: item.prestations && item.prestations.length > 0 ? item.prestations : [
      "Intervention soignée et certifiée",
      "Matériel et produits écologiques",
      "Équipes formées et expérimentées",
    ],
    highlightText:
      item.status === "indisponible"
        ? "Service temporairement indisponible."
        : "Un environnement propre pour un quotidien plus serein.",
    highlightIcon,
    image: getServiceImage(item.image),
    layout,
  };
}

export default function ServicesList() {
  const [catalogItems, setCatalogItems] = useState<readonly ServiceCatalogItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await dashboardServicesApi.getCatalog();
        if (!cancelled && res.data) {
          // Filtrer les services désactivés pour le public
          setCatalogItems(res.data.filter((s) => s.status !== "desactive"));
        }
      } catch {
        // En cas d'erreur réseau, conservation des données
      }
    };

    void load();

    // Écoute de l'événement de mise à jour pour refléter en direct les modifs du Dashboard
    const handleServicesUpdated = () => {
      void load();
    };

    window.addEventListener("cleanpro_services_updated", handleServicesUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("cleanpro_services_updated", handleServicesUpdated);
    };
  }, []);

  return (
    <section
      aria-labelledby="services_list_title"
      className="bg-[#f7fbf9] px-4 py-7 sm:px-6 lg:px-8 lg:py-9"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex items-center gap-2 sm:mb-8">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0d8d5e]/10 text-[#0d8d5e]">
            <span
              className="h-2.5 w-2.5 rounded-full bg-[#0d8d5e]"
              aria-hidden="true"
            />
          </span>
          <p
            id="services_list_title"
            className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#0d8d5e]"
          >
            NOS SERVICES
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {catalogItems.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={mapCatalogToCardData(service, index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
