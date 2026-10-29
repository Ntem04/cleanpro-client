import { useEffect } from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { Home, SearchX, RotateCcw } from "lucide-react";
import Reveal from "../../components/ui/Reveal";

export default function NotFoundPage() {
  const error = useRouteError();

  // SÉCURITÉ (CWE-209 & CWE-532) : Journalisation interne uniquement en DEV.
  if (import.meta.env.DEV) {
    console.error("Erreur interceptée par le routeur :", error);
  }

  // Détection d'un chunk obsolète post-build (Vite dynamic import 404) avec auto-récupération
  useEffect(() => {
    const isChunkError =
      error instanceof Error &&
      (error.message.includes("dynamically imported module") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("Loading chunk") ||
        error.name === "ChunkLoadError");

    if (isChunkError) {
      const refreshed = sessionStorage.getItem("cleanpro_chunk_auto_reload");
      if (!refreshed) {
        sessionStorage.setItem("cleanpro_chunk_auto_reload", "true");
        window.location.reload();
      }
    } else {
      sessionStorage.removeItem("cleanpro_chunk_auto_reload");
    }
  }, [error]);

  const isReal404 = isRouteErrorResponse(error) ? error.status === 404 : !error;

  const title = isReal404 ? "Erreur 404" : "Une erreur est survenue";
  const subtitle = isReal404 ? "Page introuvable" : "Module temporairement indisponible";
  const errorMessage = isReal404
    ? "La page que vous recherchez est introuvable ou a été déplacée."
    : "Une nouvelle version de l'application a été déployée ou une interruption temporaire est survenue. Veuillez actualiser la page.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f9f6] px-4 text-center font-sans">
      <Reveal direction="up" delay={200}>
        <div className="max-w-md w-full flex flex-col items-center">
          <div className="relative mb-8 w-40 h-40 flex items-center justify-center bg-white rounded-full shadow-sm border border-slate-200">
            <SearchX
              className="w-20 h-20 text-[#1d6f4c] animate-pulse"
              aria-hidden="true"
            />
          </div>

          <h1 className="mb-3 text-[3.2rem] sm:text-[4rem] font-extrabold text-slate-900 leading-none">
            {title}
          </h1>
          <h2 className="mb-4 text-[1.4rem] sm:text-[1.5rem] font-bold text-slate-800 tracking-tight">
            {subtitle}
          </h2>
          <p className="mb-10 text-[15px] text-slate-600 font-medium leading-relaxed">
            {errorMessage}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {!isReal404 && (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 bg-[#1d6f4c] hover:bg-[#155439] text-white font-bold text-[14px] py-3.5 px-6 rounded-full transition-colors outline-none focus-visible:ring-4 focus-visible:ring-[#1d6f4c]/40"
              >
                <RotateCcw className="w-4 h-4 stroke-2" aria-hidden="true" />
                Actualiser la page
              </button>
            )}

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[14px] py-3.5 px-6 rounded-full transition-colors outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
            >
              <Home className="w-4 h-4 stroke-2" aria-hidden="true" />
              Retour Accueil
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
