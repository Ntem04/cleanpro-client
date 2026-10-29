import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  FileSpreadsheet,
  CalendarDays,
  ScrollText,
  Mail,
  Settings,
  Leaf,
} from "lucide-react";
import Reveal from "../../../components/ui/Reveal";
import CleanProLogo from "../../../assets/icon.webp";
import OfficeImg from "../../../image/services-bureaux0.webp";
import { useAdminProfile } from "../context/useAdminProfile";
import AdminAvatar from "./AdminAvatar";

interface NavItem {
  readonly to: string;
  readonly label: string;
  readonly icon: React.ComponentType<{ className?: string; size?: number; "aria-hidden"?: boolean }>;
  readonly badge?: number;
  readonly end?: boolean;
}

const NAV_ITEMS: readonly NavItem[] = Object.freeze([
  {
    to: "/dashboard",
    label: "Tableau de bord",
    icon: Home,
    end: true,
  },
  {
    to: "/dashboard/services",
    label: "Nos Services",
    icon: FileSpreadsheet,
  },
  {
    to: "/dashboard/planning",
    label: "Planning",
    icon: CalendarDays,
  },
  {
    to: "/dashboard/logs",
    label: "Logs",
    icon: ScrollText,
  },
  {
    to: "/dashboard/messages",
    label: "Messages",
    icon: Mail,
    // Prêt pour accueillir le nombre dynamique de messages non lus dès l'implémentation future (badge: unreadCount)
  },
  {
    to: "/dashboard/settings",
    label: "Paramètres",
    icon: Settings,
  },
]);

interface DashboardSidebarProps {
  readonly isOpenMobile?: boolean;
  readonly onCloseMobile?: () => void;
}

export default function DashboardSidebar({
  isOpenMobile = false,
  onCloseMobile,
}: DashboardSidebarProps) {
  const { profile } = useAdminProfile();
  // Initialisation à 0 du nombre de messages non lus (chargé dynamiquement depuis la base)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem("cleanpro_dashboard_messages_v2");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter((m: { status?: string }) => m.status === "unread").length;
        }
      }
    } catch {
      // Ignore parse error
    }
    return 0;
  });

  useEffect(() => {
    const handleCountChange = (e: Event) => {
      const custom = e as CustomEvent<{ unreadCount: number } | number>;
      const count =
        typeof custom.detail === "number"
          ? custom.detail
          : typeof custom.detail?.unreadCount === "number"
          ? custom.detail.unreadCount
          : 0;
      setUnreadMessagesCount(count);
    };
    window.addEventListener("cleanpro_messages_count", handleCountChange);
    return () => {
      window.removeEventListener("cleanpro_messages_count", handleCountChange);
    };
  }, []);

  return (
    <>
      {/* Overlay accessible mobile (WCAG 2.2 AA) */}
      {isOpenMobile && (
        <div
          aria-hidden="true"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      <aside
        id="dashboard-sidebar-nav"
        aria-label="Navigation principale du tableau de bord"
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col justify-between overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-r border-slate-200/80 bg-white transition-transform duration-200 ease-in-out ${
          isOpenMobile ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0 lg:shadow-none"
        }`}
      >
        <div>
          {/* Logo officiel CleanPro conforme au visuel */}
          <Reveal direction="left" delay={30} immediate={true}>
            <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
              <div className="flex items-center gap-2.5">
                <img
                  src={CleanProLogo}
                  alt="CleanPro Services de Nettoyage"
                  className="h-9 w-auto object-contain"
                />
                <div className="leading-tight">
                  <span className="block text-base font-extrabold tracking-tight text-[#15364a]">
                    CleanPro
                  </span>
                  <span className="block text-sm font-medium text-slate-500">
                    Services de Nettoyage
                  </span>
                </div>
              </div>

              {/* Bouton fermeture sur mobile */}
              {isOpenMobile && (
                <button
                  type="button"
                  onClick={onCloseMobile}
                  aria-label="Fermer la barre latérale"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#135d3b] lg:hidden"
                >
                  &times;
                </button>
              )}
            </div>
          </Reveal>

          {/* Menu de navigation */}
          <Reveal direction="left" delay={70} immediate={true}>
            <nav className="px-3.5 py-4">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `group flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#135d3b] ${
                          isActive
                            ? "bg-[#135d3b] text-white shadow-xs"
                            : "text-[#27495e] hover:bg-slate-50 hover:text-[#135d3b]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <Icon
                              size={17}
                              aria-hidden={true}
                              className={`shrink-0 transition-colors ${
                                isActive ? "text-white" : "text-[#27495e] group-hover:text-[#135d3b]"
                              }`}
                            />
                            <span>{item.label}</span>
                          </div>

                          {/* Badge de notification dynamique pour les Messages ou éléments avec badge */}
                          {(() => {
                            const badgeValue =
                              item.to === "/dashboard/messages"
                                ? unreadMessagesCount
                                : item.badge;
                            if (badgeValue === undefined || badgeValue <= 0) return null;
                            return (
                              <span
                                aria-label={`${badgeValue} notifications non lues`}
                                className={`inline-flex h-5 min-w-5 items-center justify-center rounded px-1.5 text-[13px] font-bold tabular-nums ${
                                  isActive
                                    ? "bg-white text-[#135d3b]"
                                    : "bg-[#135d3b] text-white"
                                }`}
                              >
                                {badgeValue}
                              </span>
                            );
                          })()}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
          </Reveal>
        </div>

        {/* Bloc Bas de Sidebar : Profil BDD & Accroche d'entreprise */}
        <Reveal direction="up" delay={120} immediate={true}>
          <div className="p-4 border-t border-slate-100 space-y-3">
            {/* Capsule Profil Administrateur avec photo issue de la BDD */}
            <NavLink
              to="/dashboard/settings"
              onClick={onCloseMobile}
              title="Gérer le profil administrateur"
              className="flex items-center gap-3 rounded-lg border border-slate-200/80 bg-slate-50/80 p-2.5 transition hover:bg-slate-100/80 focus-visible:outline-2 focus-visible:outline-[#135d3b]"
            >
              <AdminAvatar size="sm" showOnlineIndicator={true} />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-sm font-bold text-[#15364a]">
                  {profile.name || "Amina Diallo"}
                </p>
                <p className="truncate text-[13px] font-medium text-slate-500">
                  {profile.role === "admin" || profile.role?.toLowerCase().includes("admin")
                    ? "Responsable d'agence"
                    : "Collaborateur"}
                </p>
              </div>
            </NavLink>

            <div className="flex items-center gap-2 text-emerald-700">
              <Leaf size={16} aria-hidden={true} />
              <p className="text-[13px] font-medium leading-snug text-slate-700">
                Des espaces plus propres, une meilleure qualité de vie.
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200">
              <img
                src={OfficeImg}
                alt="Locaux d'entreprise entretenus"
                className="h-24 w-full object-cover"
                loading="lazy"
              />
            </div>

            <p className="text-sm text-slate-400 text-center font-medium">
              CleanPro · Services de Nettoyage
            </p>
          </div>
        </Reveal>
      </aside>
    </>
  );
}
