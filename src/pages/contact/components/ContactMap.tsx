import { Clock, ExternalLink, Leaf, MapPin } from "lucide-react";
import Reveal from "../../../components/ui/Reveal";

const hours = [
  { day: "Lundi – Vendredi", time: "8h00 – 17h00" },
  { day: "Samedi", time: "8h00 – 12h00" },
  { day: "Dimanche", time: "Fermé" },
] as const;

/**
 * Coordonnées GPS du siège CleanPro – Yaoundé, Cameroun.
 * L'URL Google Maps embed est construite avec l'API publique iframe sans clé API.
 * Sécurité : l'URL est statique et ne contient aucune donnée utilisateur (pas de SSRF possible).
 */
const MAPS_EMBED_URL =
  "https://maps.google.com/maps?q=Yaound%C3%A9%2C+Cameroun&t=&z=13&ie=UTF8&iwloc=&output=embed";

const MAPS_EXTERNAL_URL =
  "https://www.google.com/maps/search/CleanPro+Yaound%C3%A9+Cameroun";

export default function ContactMap() {
  return (
    <section
      aria-labelledby="map-section-title"
      className="w-full border-t border-slate-100 bg-white py-8 lg:py-10"
    >
      <div className="mx-auto w-full max-w-[1720px] px-6 lg:px-10 xl:px-12">
        {/* Grille principale : carte | adresse | horaires */}
        <div className="grid grid-cols-1 gap-6 overflow-hidden rounded-2xl border border-slate-200 shadow-sm md:grid-cols-[1.4fr_1fr_1fr]">
          {/* ─── 1. Carte Google Maps ─── */}
          <Reveal direction="left" delay={100}>
            <div className="relative min-h-55 w-full overflow-hidden md:min-h-65">
              <iframe
                title="Localisation CleanPro sur Google Maps"
                src={MAPS_EMBED_URL}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
                sandbox="allow-scripts allow-same-origin"
                aria-label="Carte Google Maps indiquant la localisation de CleanPro à Yaoundé, Cameroun"
              />
            </div>
          </Reveal>

          {/* ─── 2. Adresse & CTA Google Maps ─── */}
          <Reveal direction="up" delay={200}>
            <div className="flex flex-col justify-center gap-4 px-6 py-7 md:border-l md:border-slate-200">
              {/* Badge */}
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#00964f]">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Notre siège
              </p>

              {/* Titre */}
              <h2
                id="map-section-title"
                className="text-[1.6rem] font-extrabold leading-tight tracking-tight text-[#15364a] sm:text-[1.75rem]"
              >
                Yaoundé, Cameroun
              </h2>

              {/* Description */}
              <p className="text-[13px] leading-relaxed text-slate-500">
                Nous sommes situés dans un emplacement stratégique pour mieux
                vous servir.
              </p>

              {/* Bouton Google Maps */}
              <a
                href={MAPS_EXTERNAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-[#15364a] shadow-sm transition hover:border-[#00964f] hover:text-[#00964f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00964f]"
              >
                <ExternalLink
                  className="h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
                Voir sur Google Maps
              </a>
            </div>
          </Reveal>

          {/* ─── 3. Horaires d'ouverture ─── */}
          <Reveal direction="right" delay={300}>
            <div className="flex flex-col justify-center gap-4 bg-[#f8fbf9] px-6 py-7 md:border-l md:border-slate-200">
              {/* Badge horaires */}
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#00964f]">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Horaires d'ouverture
              </p>

              {/* Liste des jours */}
              <dl className="space-y-2">
                {hours.map(({ day, time }) => (
                  <div
                    key={day}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <dt className="text-[12px] font-medium text-slate-600">
                      {day}
                    </dt>
                    <dd
                      className={`text-[12px] font-semibold tabular-nums ${
                        time === "Fermé" ? "text-red-500" : "text-[#15364a]"
                      }`}
                    >
                      {time}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Séparateur */}
              <div className="h-px bg-slate-200" aria-hidden="true" />

              {/* Note urgence */}
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e0f2e8] text-[#00964f]">
                  <Leaf
                    className="h-3.5 w-3.5 fill-current"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="text-[12px] font-bold text-[#15364a]">
                    Besoin d'une intervention urgente ?
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                    Contactez-nous, nous faisons le maximum pour répondre à vos
                    besoins.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
