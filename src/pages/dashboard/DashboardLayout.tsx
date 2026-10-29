import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardTopBar from "./components/DashboardTopBar";
import DashboardErrorBoundary from "./components/DashboardErrorBoundary";
import { AdminProfileProvider } from "./context/AdminProfileContext";

export default function DashboardLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AdminProfileProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] text-sm text-slate-800 antialiased font-sans">
      {/* ─── Accessibilité WCAG 2.2 AA : Lien d'évitement au clavier ──────── */}
      <a
        href="#main-dashboard-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-[#00964f] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-md focus:outline-none focus:ring-2 focus:ring-[#15364a]"
      >
        Passer directement au contenu principal
      </a>

      {/* ─── Menu latéral persistant (Bureau) & Tiroir accessible (Mobile) ─── */}
      <DashboardSidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* ─── Zone principale de travail avec défilement autonome ───────────── */}
      <div className="flex flex-1 flex-col h-full overflow-hidden min-w-0 lg:pl-64">
        {/* Barre supérieure d'actions et fil d'Ariane (fixe en haut du contenu) */}
        <DashboardTopBar
          isMobileSidebarOpen={isMobileSidebarOpen}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Contenu de page protégé avec son propre conteneur scrollable indépendant */}
        <main
          id="main-dashboard-content"
          tabIndex={-1}
          onScroll={handleScroll}
          className={`flex-1 overflow-y-auto outline-none cleanpro-autohide-scrollbar ${
            isScrolling ? "is-scrolling" : ""
          }`}
        >
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <DashboardErrorBoundary>
              <Outlet />
            </DashboardErrorBoundary>
          </div>
        </main>
      </div>
    </div>
    </AdminProfileProvider>
  );
}
