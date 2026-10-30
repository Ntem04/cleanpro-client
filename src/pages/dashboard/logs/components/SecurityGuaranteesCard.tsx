import { Shield, EyeOff, Bell, History } from "lucide-react";

export default function SecurityGuaranteesCard() {
  const guarantees = [
    {
      icon: EyeOff,
      title: "Ce qui n'est JAMAIS enregistré",
      description:
        "Mots de passe (même erronés), jetons de session/JWT et contenu complet des messages visiteurs.",
      badge: "Confidentialité absolue",
      badgeColor: "bg-slate-100 text-slate-700",
    },
    {
      icon: History,
      title: "Conservation 90 jours & Purge auto",
      description:
        "Suppression automatisée des événements après 90 jours pour limiter l'empreinte de stockage.",
      badge: "Rétention maîtrisée",
      badgeColor: "bg-emerald-50 text-[#135d3b]",
    },
    {
      icon: Bell,
      title: "Alertes automatiques Super Admin",
      description:
        "Notification e-mail d'urgence déclenchée dès 5 échecs consécutifs d'authentification sur une même IP.",
      badge: "Protection proactive",
      badgeColor: "bg-amber-50 text-amber-800",
    },
    {
      icon: Shield,
      title: "Accès strictement réservé",
      description:
        "Journaux consultables en lecture seule exclusive pour les comptes administrateurs certifiés.",
      badge: "Contrôle d'accès RBAC",
      badgeColor: "bg-sky-50 text-sky-800",
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#135d3b]" />
          <h3 className="text-sm font-bold text-[#15364a]">
            Charte de Sécurité &amp; Bonnes Pratiques des Journaux
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-500">
          Standards OWASP &amp; RGPD
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {guarantees.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-lg bg-slate-50/70 border border-slate-200/70 p-3.5 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white border border-slate-200 text-slate-700">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#15364a] pt-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

