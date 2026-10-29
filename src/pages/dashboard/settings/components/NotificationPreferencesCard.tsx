import type { SettingsNotificationPreferencesData } from "../../../../services/dashboardServicesApi";

interface NotificationPreferencesCardProps {
  readonly notifications: SettingsNotificationPreferencesData;
  readonly onChange: (
    updated: Partial<SettingsNotificationPreferencesData>
  ) => void;
}

/**
 * Carte Préférences de notification — Canaux et alertes système
 */
export default function NotificationPreferencesCard({
  notifications,
  onChange,
}: NotificationPreferencesCardProps) {
  return (
    <div className="col-span-1 lg:col-span-2 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
      {/* En-tête de la carte */}
      <div className="mb-5">
        <h2 className="text-base font-bold text-[#15364a]">
          Préférences de notification
        </h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Les réglages actifs ne sont pas fournis dans la capture.
        </p>
      </div>

      {/* 3 colonnes de préférences */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne 1 : Interventions */}
        <div className="flex flex-col justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-4">
          <div>
            <h3 className="text-sm font-bold text-[#15364a]">Interventions</h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Fin d'intervention et planning
            </p>
          </div>

          <div className="mt-4">
            <label htmlFor="settings-notif-interventions" className="sr-only">
              Préférence Interventions
            </label>
            <select
              id="settings-notif-interventions"
              value={notifications.interventions}
              onChange={(e) => onChange({ interventions: e.target.value })}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition-colors focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b]"
            >
              <option value="Non renseigné">Non renseigné</option>
              <option value="Activé">Activé</option>
              <option value="Désactivé">Désactivé</option>
              <option value="Par e-mail">Par e-mail</option>
              <option value="Par SMS / WhatsApp">Par SMS / WhatsApp</option>
            </select>
          </div>
        </div>

        {/* Colonne 2 : Messages clients */}
        <div className="flex flex-col justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-4">
          <div>
            <h3 className="text-sm font-bold text-[#15364a]">Messages clients</h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Nouveaux messages reçus
            </p>
          </div>

          <div className="mt-4">
            <label htmlFor="settings-notif-messages" className="sr-only">
              Préférence Messages clients
            </label>
            <select
              id="settings-notif-messages"
              value={notifications.clientMessages}
              onChange={(e) => onChange({ clientMessages: e.target.value })}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition-colors focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b]"
            >
              <option value="Non renseigné">Non renseigné</option>
              <option value="Activé">Activé</option>
              <option value="Désactivé">Désactivé</option>
              <option value="Par e-mail">Par e-mail</option>
              <option value="Par SMS / WhatsApp">Par SMS / WhatsApp</option>
            </select>
          </div>
        </div>

        {/* Colonne 3 : Rapports */}
        <div className="flex flex-col justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-4">
          <div>
            <h3 className="text-sm font-bold text-[#15364a]">Rapports</h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Disponibilité des rapports
            </p>
          </div>

          <div className="mt-4">
            <label htmlFor="settings-notif-reports" className="sr-only">
              Préférence Rapports
            </label>
            <select
              id="settings-notif-reports"
              value={notifications.reports}
              onChange={(e) => onChange({ reports: e.target.value })}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition-colors focus:border-[#135d3b] focus:outline-none focus:ring-1 focus:ring-[#135d3b]"
            >
              <option value="Non renseigné">Non renseigné</option>
              <option value="Activé">Activé</option>
              <option value="Désactivé">Désactivé</option>
              <option value="Hebdomadaire">Hebdomadaire</option>
              <option value="Mensuel">Mensuel</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

