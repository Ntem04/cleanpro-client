import { lazy, Suspense, useEffect, type ReactNode, type ComponentType } from "react";
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Reveal from "./components/ui/Reveal";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { telemetryApi } from "./services/telemetryApi";

/**
 * Import asynchrone résilient avec auto-récupération sur nouveau build de production.
 * Résout le problème des ChunkLoadError (404 sur vieux hash de bundle après rebuild).
 */
function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (error: any) {
      const isChunkError =
        error?.message?.includes("dynamically imported module") ||
        error?.message?.includes("Failed to fetch") ||
        error?.name === "ChunkLoadError";

      const pageRefreshed = sessionStorage.getItem("cleanpro_chunk_retry");
      if (isChunkError && !pageRefreshed) {
        sessionStorage.setItem("cleanpro_chunk_retry", "true");
        window.location.reload();
        return new Promise<{ default: T }>(() => {});
      }
      sessionStorage.removeItem("cleanpro_chunk_retry");
      throw error;
    }
  });
}

const HomePage = lazyWithRetry(() => import("./pages/home/HomePage"));
const AboutPage = lazyWithRetry(() => import("./pages/about/AboutPage"));
const ContactPage = lazyWithRetry(() => import("./pages/contact/ContactPage"));
const LoginPage = lazyWithRetry(() => import("./pages/login/LoginPage"));
const NotFoundPage = lazyWithRetry(() => import("./pages/not-found/NotFoundPage"));
const RegisterPage = lazyWithRetry(() => import("./pages/register/RegisterPage"));
const ServicesPage = lazyWithRetry(() => import("./pages/services/ServicesPage"));
const TestimonialsPage = lazyWithRetry(() => import("./pages/testimonials/TestimonialsPage"));
const LegalNoticePage = lazyWithRetry(() => import("./pages/legal/LegalNoticePage"));
const PrivacyPolicyPage = lazyWithRetry(() => import("./pages/legal/PrivacyPolicyPage"));

const OverviewPage = lazyWithRetry(() => import("./pages/dashboard/overview/OverviewPage"));
const ServicesDashboardPage = lazyWithRetry(() => import("./pages/dashboard/services/ServicesDashboardPage"));
const TeamsPage = lazyWithRetry(() => import("./pages/dashboard/teams/TeamsPage"));
const PlanningPage = lazyWithRetry(() => import("./pages/dashboard/planning/PlanningPage"));
const LogsPage = lazyWithRetry(() => import("./pages/dashboard/logs/LogsPage"));
const MessagesPage = lazyWithRetry(() => import("./pages/dashboard/messages/MessagesPage"));
const SettingsPage = lazyWithRetry(() => import("./pages/dashboard/settings/SettingsPage"));

function RouteFallback() {
  return <div className="min-h-32 animate-pulse rounded-xl bg-slate-100" aria-hidden="true" />;
}

function LazyRoute({ children }: { readonly children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

const RootLayout = () => {
  const location = useLocation();

  useEffect(() => {
    // Enregistre silencieusement la visite de chaque page publique dans PostgreSQL
    void telemetryApi.trackPage(location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-base-100 font-sans text-base-content">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Reveal direction="up" delay={200}>
        <Footer />
      </Reveal>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LazyRoute><LoginPage /></LazyRoute>,
    errorElement: <LazyRoute><NotFoundPage /></LazyRoute>,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <LazyRoute><NotFoundPage /></LazyRoute>,
    children: [
      { index: true, element: <LazyRoute><OverviewPage /></LazyRoute> },
      { path: "services", element: <LazyRoute><ServicesDashboardPage /></LazyRoute> },
      { path: "teams", element: <LazyRoute><TeamsPage /></LazyRoute> },
      { path: "planning", element: <LazyRoute><PlanningPage /></LazyRoute> },
      { path: "logs", element: <LazyRoute><LogsPage /></LazyRoute> },
      { path: "reports", element: <LazyRoute><LogsPage /></LazyRoute> },
      { path: "messages", element: <LazyRoute><MessagesPage /></LazyRoute> },
      { path: "settings", element: <LazyRoute><SettingsPage /></LazyRoute> },
    ],
  },
  {
    path: "/",
    element: <RootLayout />,
    // Câblage du composant d'erreur sécurisé
    errorElement: <LazyRoute><NotFoundPage /></LazyRoute>,
    children: [
      {
        index: true,
        element: <LazyRoute><HomePage /></LazyRoute>,
      },
      { path: "services", element: <LazyRoute><ServicesPage /></LazyRoute> },
      { path: "a-propos", element: <LazyRoute><AboutPage /></LazyRoute> },
      { path: "temoignages", element: <LazyRoute><TestimonialsPage /></LazyRoute> },
      { path: "contact", element: <LazyRoute><ContactPage /></LazyRoute> },
      { path: "mentionslegales", element: <LazyRoute><LegalNoticePage /></LazyRoute> },
      { path: "confidentialite", element: <LazyRoute><PrivacyPolicyPage /></LazyRoute> },
      { path: "register", element: <LazyRoute><RegisterPage /></LazyRoute> },
      { path: "*", element: <LazyRoute><NotFoundPage /></LazyRoute> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
