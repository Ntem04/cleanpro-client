import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import Reveal from "../../../components/ui/Reveal";

export interface ServiceCardData {
  id: string;
  badgeTitle: string;
  badgeIcon: LucideIcon;
  tag: string;
  title: string;
  description: string;
  features: readonly string[];
  highlightText: string;
  highlightIcon: LucideIcon;
  image: string;
  layout: "image-left" | "callout-left" | "content-left";
}

interface ServiceCardProps {
  service: ServiceCardData;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const {
    id,
    badgeTitle,
    badgeIcon: BadgeIcon,
    tag,
    title,
    description,
    features,
    highlightText,
    highlightIcon: HighlightIcon,
    image,
    layout,
  } = service;

  const renderContent = () => (
    <div className="flex h-full flex-col justify-between py-1 font-sans sm:py-2">
      <div>
        {layout === "content-left" ? (
          <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-md border border-[#00964f]/30 bg-[#f2f9f5] px-3.5 py-1.5 shadow-xs">
            <BadgeIcon
              className="h-4 w-4 text-[#00964f] stroke-2"
              aria-hidden="true"
            />
            <span className="text-[12px] font-bold text-[#15364a]">
              {badgeTitle}
            </span>
          </div>
        ) : (
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#00964f]">
            {tag}
          </p>
        )}

        <h2
          // DIRECTIVE : Zéro tiret dans l'ID
          id={`service_${id}_title`}
          className="text-[1.35rem] font-extrabold leading-[1.1] tracking-tight text-[#15364a] sm:text-[1.5rem] lg:text-[1.65rem]"
        >
          {title}
        </h2>

        <p className="mt-2 max-w-[48ch] text-[11px] font-medium leading-relaxed text-slate-600 sm:text-[12px]">
          {description}
        </p>

        <ul
          className="mt-3 space-y-1.5"
          aria-label={`Points clés pour ${title}`}
        >
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-[11px] font-semibold text-[#15364a] sm:text-[12px]"
            >
              <CheckCircle2
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00964f] stroke-2"
                aria-hidden="true"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderImage = () => (
    <div className="relative h-52 w-full overflow-hidden rounded-xl border border-[#e2f0e8] bg-slate-50 shadow-[0_8px_22px_rgba(13,141,94,0.12)] sm:h-60 lg:h-full lg:min-h-52">
      <img
        src={image}
        alt={`Illustration ${title}`}
        loading="lazy"
        draggable={false} // SÉCURITÉ UX
        onContextMenu={(e) => e.preventDefault()} // SÉCURITÉ UX
        className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
      />
      {/* Badge sur l'image : angles stricts (rounded-md) */}
      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-[#00964f]/30 bg-[#f2f9f5]/95 px-2.5 py-1 shadow-sm backdrop-blur-xs">
        <BadgeIcon
          className="h-3.5 w-3.5 text-[#00964f] stroke-2"
          aria-hidden="true"
        />
        <span className="text-[10px] font-bold text-[#15364a]">
          {badgeTitle}
        </span>
      </div>
    </div>
  );

  const renderCallout = () => (
    <div className="flex h-full min-h-40 flex-col items-center justify-center rounded-xl border border-[#e5f0ea] bg-[#f8fbf9] p-4 text-center shadow-[0_8px_22px_rgba(13,141,94,0.1)] sm:min-h-45 lg:min-h-full">
      {/* Icône d'impact : cadre carré adouci (rounded-md) et non plus un cercle */}
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#00964f] shadow-sm border border-[#e5f0ea]">
        <HighlightIcon className="h-6 w-6 stroke-2" aria-hidden="true" />
      </span>
      <p className="max-w-45 text-[11px] font-bold leading-snug text-[#15364a] sm:text-[12px]">
        {highlightText}
      </p>
    </div>
  );

  return (
    <Reveal direction="up" delay={150}>
      <article
        aria-labelledby={`service_${id}_title`}
        className="overflow-hidden rounded-2xl border border-[#e2f0e8] bg-white p-3.5 shadow-[0_10px_28px_rgba(13,141,94,0.12)] transition-shadow duration-300 hover:shadow-[0_14px_34px_rgba(13,141,94,0.17)] sm:p-4 lg:p-4.5"
      >
        {layout === "image-left" && (
          <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[1.05fr_1.35fr_0.8fr] lg:gap-5">
            <div className="h-full">{renderImage()}</div>
            <div className="h-full">{renderContent()}</div>
            <div className="h-full">{renderCallout()}</div>
          </div>
        )}

        {layout === "callout-left" && (
          <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[0.8fr_1.05fr_1.35fr] lg:gap-5">
            <div className="order-3 h-full lg:order-1">{renderCallout()}</div>
            <div className="order-1 h-full lg:order-2">{renderImage()}</div>
            <div className="order-2 h-full lg:order-3">{renderContent()}</div>
          </div>
        )}

        {layout === "content-left" && (
          <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[1.35fr_1.05fr_0.8fr] lg:gap-5">
            <div className="h-full">{renderContent()}</div>
            <div className="h-full">{renderImage()}</div>
            <div className="h-full">{renderCallout()}</div>
          </div>
        )}
      </article>
    </Reveal>
  );
}
