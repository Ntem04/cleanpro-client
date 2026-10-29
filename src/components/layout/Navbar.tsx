import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, LayoutDashboard } from "lucide-react";
import Icon from "../../assets/icon.webp";
import { authService, type UserProfile } from "../../services/authService";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem("cleanpro_user");
      if (stored) return JSON.parse(stored) as UserProfile;
    } catch {
      // Ignore
    }
    return null;
  });

  // Détection de l'environnement : Visible en dev pour faciliter le travail, masqué aux visiteurs en production
  const isDev = Boolean(
    import.meta.env.DEV || import.meta.env.VITE_SHOW_ADMIN_LOGIN === "true"
  );

  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      try {
        const profile = await authService.getProfile();
        if (!cancelled && profile && profile.id) {
          setCurrentUser(profile);
        }
      } catch {
        if (!cancelled) {
          // Si le token est absent ou expiré
          try {
            const cached = localStorage.getItem("cleanpro_user");
            if (cached) {
              setCurrentUser(JSON.parse(cached) as UserProfile);
              return;
            }
          } catch {
            // Ignore
          }
          setCurrentUser(null);
        }
      }
    };

    void checkSession();

    const handleSync = () => {
      try {
        const stored = localStorage.getItem("cleanpro_user");
        setCurrentUser(stored ? (JSON.parse(stored) as UserProfile) : null);
      } catch {
        setCurrentUser(null);
      }
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("cleanpro:profile-updated", handleSync);

    return () => {
      cancelled = true;
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("cleanpro:profile-updated", handleSync);
    };
  }, []);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-[15px] font-semibold py-1 border-b-2 transition-all duration-200 ${
      isActive
        ? "text-[#1d6f4c] border-[#1d6f4c]"
        : "text-slate-600 border-transparent hover:text-[#1d6f4c] hover:border-[#1d6f4c]"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full font-sans">
      <div className="relative z-20 border-b border-slate-100 bg-white shadow-sm">
        <div className="mx-auto flex h-20 w-full max-w-[1720px] items-center justify-between px-6 lg:px-10 xl:px-12">
          <div className="flex shrink-0 items-center gap-3 lg:gap-0">
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#1d6f4c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c]"
                aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 stroke-2" />
                ) : (
                  <Menu className="h-6 w-6 stroke-2" />
                )}
              </button>
            </div>

            <Link
              to="/"
              className="flex items-center gap-3 rounded-md shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c]"
            >
              <img
                src={Icon}
                alt="Logo CleanPro Services"
                width={40}
                height={40}
                className="h-9 w-auto object-contain sm:h-10"
                loading="eager"
              />
              <div className="flex flex-col justify-center leading-none">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  CleanPro
                </span>
                <span className="mt-0.5 text-[13px] font-medium tracking-wide text-slate-500">
                  Services
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-7 lg:flex">
            <NavLink to="/" className={getNavLinkClass}>Accueil</NavLink>
            <NavLink to="/services" className={getNavLinkClass}>Nos services</NavLink>
            <NavLink to="/a-propos" className={getNavLinkClass}>À propos</NavLink>
            <NavLink to="/temoignages" className={getNavLinkClass}>Témoignages</NavLink>
            <NavLink to="/contact" className={getNavLinkClass}>Contact</NavLink>
          </nav>

          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            {currentUser ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-lg bg-[#135d3b] px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-[#0f4d30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#135d3b]"
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                <span>Retour au tableau de bord</span>
              </Link>
            ) : isDev ? (
              <Link
                to="/login"
                title="Accès Administrateur (Actif en mode développement)"
                className="border border-[#1d6f4c] px-4 py-2 text-sm font-semibold text-[#1d6f4c] transition-colors hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c]"
              >
                Se connecter
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden absolute top-20 left-0 z-10 w-full bg-white border-b border-slate-100 shadow-md transition-all duration-300 ease-out origin-top ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-4 px-6 py-4">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[15px] font-bold text-slate-800"
          >
            Accueil
          </Link>
          <Link
            to="/services"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[15px] font-bold text-slate-800"
          >
            Nos services
          </Link>
          <Link
            to="/a-propos"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[15px] font-bold text-slate-800"
          >
            À propos
          </Link>
          <Link
            to="/temoignages"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[15px] font-bold text-slate-800"
          >
            Témoignages
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[15px] font-bold text-slate-800"
          >
            Contact
          </Link>
          {(currentUser || isDev) && (
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row">
              {currentUser ? (
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#135d3b] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-xs transition hover:bg-[#0f4d30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#135d3b]"
                >
                  <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                  <span>Retour au tableau de bord</span>
                </Link>
              ) : isDev ? (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  title="Accès Administrateur (Actif en mode développement)"
                  className="border border-[#1d6f4c] px-4 py-2.5 text-center text-sm font-semibold text-[#1d6f4c] transition-colors hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c]"
                >
                  Se connecter
                </Link>
              ) : null}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
