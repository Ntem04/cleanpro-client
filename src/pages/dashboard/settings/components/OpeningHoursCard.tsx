import type { SettingsOpeningHoursData } from "../../../../services/dashboardServicesApi";

interface OpeningHoursCardProps {
  readonly hours: SettingsOpeningHoursData;
  readonly onChange: (updated: Partial<SettingsOpeningHoursData>) => void;
}

/**
 * Carte Horaires d'ouverture — Disponibilités d'accueil et interventions
 */
export default function OpeningHoursCard({
  hours,
  onChange,
}: OpeningHoursCardProps) {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* En-tête de la carte */}
        <div className="mb-5">
          <h2 className="text-base font-bold text-[#15364a]">
            Horaires d'ouverture
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Disponibilités de contact
          </p>
        </div>

        {/* Lignes d'horaires */}
        <div className="space-y-4">
          {/* Lundi–Vendredi */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
            <span className="text-sm font-medium text-slate-700 sm:w-1/2">
              Lundi–Vendredi
            </span>
            <div className="flex items-center gap-2 sm:w-1/2">
              <label
                htmlFor="settings-hours-weekdays"
                className="text-sm text-slate-400 shrink-0 sr-only sm:not-sr-only sm:w-14"
              >
                Horaire
              </label>
              <input
                id="settings-hours-weekdays"
                type="text"
                value={hours.weekdays}
                onChange={(e) => onChange({ weekdays: e.target.value })}
                placeholder="8h00–17h00"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b]"
              />
            </div>
          </div>

          {/* Samedi */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
            <span className="text-sm font-medium text-slate-700 sm:w-1/2">
              Samedi
            </span>
            <div className="flex items-center gap-2 sm:w-1/2">
              <label
                htmlFor="settings-hours-saturday"
                className="text-sm text-slate-400 shrink-0 sr-only sm:not-sr-only sm:w-14"
              >
                Horaire
              </label>
              <input
                id="settings-hours-saturday"
                type="text"
                value={hours.saturday}
                onChange={(e) => onChange({ saturday: e.target.value })}
                placeholder="8h00–12h00"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b]"
              />
            </div>
          </div>

          {/* Dimanche */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
            <span className="text-sm font-medium text-slate-700 sm:w-1/2">
              Dimanche
            </span>
            <div className="flex items-center gap-2 sm:w-1/2">
              <label
                htmlFor="settings-hours-sunday"
                className="text-sm text-slate-400 shrink-0 sr-only sm:not-sr-only sm:w-14"
              >
                Horaire
              </label>
              <input
                id="settings-hours-sunday"
                type="text"
                value={hours.sunday}
                onChange={(e) => onChange({ sunday: e.target.value })}
                placeholder="Fermé"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b]"
              />
            </div>
          </div>

          {/* Accueil des visiteurs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
            <span className="text-sm font-medium text-slate-700 sm:w-1/2">
              Accueil des visiteurs
            </span>
            <div className="sm:w-1/2">
              <label htmlFor="settings-hours-visitors" className="sr-only">
                Accueil des visiteurs
              </label>
              <input
                id="settings-hours-visitors"
                type="text"
                value={hours.visitors}
                onChange={(e) => onChange({ visitors: e.target.value })}
                placeholder="Sur rendez-vous"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

