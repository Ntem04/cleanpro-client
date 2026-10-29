import { useState, useEffect, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  readonly children: ReactNode;
}

/**
 * Middleware d'Autorisation Frontend (OWASP A01:2021 Broken Access Control)
 * Vérifie activement la session auprès de l'API /auth/me (Cookie HttpOnly / Token)
 * Bloque tout accès non authentifié par URL directe et redirige immédiatement vers /login.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    let isCancelled = false;

    const verifySession = async () => {
      try {
        // Interrogation de l'endpoint d'authentification sécurisé
        const profile = await authService.getProfile();
        if (!isCancelled) {
          if (profile && profile.id) {
            setIsAuthenticated(true);
            try {
              localStorage.setItem("cleanpro_user", JSON.stringify(profile));
            } catch {
              // Ignore
            }
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch {
        if (!isCancelled) {
          try {
            localStorage.removeItem("cleanpro_user");
          } catch {
            // Ignore
          }
          setIsAuthenticated(false);
        }
      }
    };

    void verifySession();

    return () => {
      isCancelled = true;
    };
  }, [location.pathname]);

  // État d'attente (Vérification cryptographique en cours)
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-[#f8fafc] font-sans">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[#135d3b]" aria-hidden="true" />
          <div className="text-center">
            <h2 className="text-sm font-bold text-[#15364a]">Vérification de sécurité</h2>
            <p className="mt-1 text-xs text-slate-500">
              Contrôle d'accès au tableau de bord CleanPro...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Échec d'authentification (OWASP A01) : Redirection immédiate et sécurisée vers /login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
}
