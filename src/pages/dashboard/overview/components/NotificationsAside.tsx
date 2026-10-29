import { useNavigate } from "react-router-dom";
import { CheckCircle2, Mail, FileText, ChevronRight } from "lucide-react";
import Reveal from "../../../../components/ui/Reveal";

interface NotificationItem {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly icon: React.ComponentType<{ className?: string; size?: number; "aria-hidden"?: boolean }>;
  readonly to: string;
  readonly category: string;
}

const NOTIFICATIONS: readonly NotificationItem[] = Object.freeze([
  {
    id: "1",
    title: "Intervention terminée",
    subtitle: "Nettoyage · Siège social",
    icon: CheckCircle2,
    to: "/dashboard/planning",
    category: "Interventions",
  },
  {
    id: "2",
    title: "Nouveau message client",
    subtitle: "Client : Groupe Alpha",
    icon: Mail,
    to: "/dashboard/messages",
    category: "Messagerie",
  },
  {
    id: "3",
    title: "Rapport généré",
    subtitle: "Rapport hebdomadaire – Septembre",
    icon: FileText,
    to: "/dashboard/reports",
    category: "Rapports",
  },
]);

export default function NotificationsAside() {
  const navigate = useNavigate();

  return (
    <Reveal direction="up" delay={80}>
      <section
        aria-labelledby="recent-notifications-title"
        className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs"
      >
        <h2 id="recent-notifications-title" className="text-sm font-bold text-[#15364a]">
          Notifications récentes
        </h2>

        <ul className="mt-4 space-y-2">
          {NOTIFICATIONS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => navigate(item.to)}
                  aria-label={`Accéder à la notification : ${item.title} (${item.subtitle})`}
                  className="group flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#135d3b]"
                >
                  <div className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-700 transition-colors group-hover:bg-slate-100 group-hover:text-[#15364a]">
                      <Icon size={17} aria-hidden={true} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-[#15364a] transition-colors group-hover:text-[#135d3b]">
                        {item.title}
                      </p>
                      <p className="text-[13px] text-slate-400">{item.subtitle}</p>
                    </div>
                  </div>

                  <ChevronRight
                    size={15}
                    className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#135d3b]"
                    aria-hidden={true}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </Reveal>
  );
}
