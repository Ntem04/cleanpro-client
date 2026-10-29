import { MapPin } from "lucide-react";
import type { SettingsContactData } from "../../../../services/dashboardServicesApi";

interface ContactCardProps {
  readonly contact: SettingsContactData;
  readonly onChange: (updated: Partial<SettingsContactData>) => void;
}

/**
 * Carte Coordonnées — Téléphone, WhatsApp, e-mail et adresse physique
 */
export default function ContactCard({ contact, onChange }: ContactCardProps) {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* En-tête de la carte */}
        <div className="mb-5">
          <h2 className="text-base font-bold text-[#15364a]">Coordonnées</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Informations de contact issues de la page Contact
          </p>
        </div>

        {/* Champs du formulaire */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="settings-contact-phone"
                className="block text-sm font-semibold text-[#15364a] mb-1.5"
              >
                Téléphone
              </label>
              <input
                id="settings-contact-phone"
                type="tel"
                value={contact.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder="+237 6XX XX XX XX"
                className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b]"
              />
            </div>

            <div>
              <label
                htmlFor="settings-contact-whatsapp"
                className="block text-sm font-semibold text-[#15364a] mb-1.5"
              >
                WhatsApp
              </label>
              <input
                id="settings-contact-whatsapp"
                type="tel"
                value={contact.whatsapp}
                onChange={(e) => onChange({ whatsapp: e.target.value })}
                placeholder="+237 6XX XX XX XX"
                className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="settings-contact-email"
              className="block text-sm font-semibold text-[#15364a] mb-1.5"
            >
              E-mail de contact
            </label>
            <input
              id="settings-contact-email"
              type="email"
              value={contact.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="contact@cleanpro.cm"
              className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b]"
            />
          </div>

          <div>
            <label
              htmlFor="settings-contact-address"
              className="block text-sm font-semibold text-[#15364a] mb-1.5"
            >
              Adresse
            </label>
            <input
              id="settings-contact-address"
              type="text"
              value={contact.address}
              onChange={(e) => onChange({ address: e.target.value })}
              placeholder="Avenue ou quartier, Ville, Pays"
              className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b]"
            />
          </div>
        </div>
      </div>

      {/* Note au bas de la carte */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-500">
        <MapPin size={16} className="text-[#135d3b] shrink-0" aria-hidden={true} />
        <span>{contact.officeNote || "Nos bureaux sont ouverts sur rendez-vous."}</span>
      </div>
    </div>
  );
}

