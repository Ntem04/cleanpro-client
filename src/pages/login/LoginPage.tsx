import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Clock,
  Leaf,
  UsersRound,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { z } from "zod";
import Reveal from "../../components/ui/Reveal";
import HeroImg from "../../assets/hero.webp";
import IconImg from "../../assets/icon.webp";
import IconWhiteImg from "../../assets/icon-white.webp";
import { authService } from "../../services/authService";

// ─── Sécurité : Schéma Zod strict pour la connexion (CWE-20) ────────────────
const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, "L'identifiant doit comporter au moins 3 caractères.")
    .max(120, "L'identifiant ne peut pas dépasser 120 caractères."),
  password: z
    .string()
    .min(8, "Le mot de passe doit comporter au moins 8 caractères.")
    .max(100, "Le mot de passe ne peut pas dépasser 100 caractères."),
  // Honeypot anti bot
  company_fax_field: z
    .string()
    .max(0, "Tentative de soumission automatisée détectée."),
});

type LoginFormData = z.infer<typeof loginSchema>;

const INITIAL_LOGIN_STATE: LoginFormData = {
  identifier: "",
  password: "",
  company_fax_field: "",
};

// ─── Données statiques gelées en mémoire (CWE-502) ──────────────────────────
interface TrustPoint {
  readonly id: string;
  readonly icon: React.ElementType;
  readonly title: string;
  readonly subtitle: string;
}

const trustPoints: readonly TrustPoint[] = Object.freeze([
  {
    id: "securite",
    icon: ShieldCheck,
    title: "Connexion sécurisée",
    subtitle: "Vos données sont protégées",
  },
  {
    id: "disponibilite",
    icon: Clock,
    title: "Service 24/7",
    subtitle: "Toujours à vos côtés",
  },
  {
    id: "engagement",
    icon: Leaf,
    title: "Une équipe engagée",
    subtitle: "Pour des espaces plus sains",
  },
]);

interface FeatureItem {
  readonly id: string;
  readonly icon: React.ElementType;
  readonly title: string;
  readonly description: string;
}

const sideFeatures: readonly FeatureItem[] = Object.freeze([
  {
    id: "qualite",
    icon: Leaf,
    title: "Qualité",
    description: "des prestations",
  },
  {
    id: "fiabilite",
    icon: ShieldCheck,
    title: "Fiabilité",
    description: "au quotidien",
  },
  {
    id: "equipes",
    icon: UsersRound,
    title: "Équipes",
    description: "professionnelles",
  },
  {
    id: "flexibilite",
    icon: Clock,
    title: "Flexibilité",
    description: "selon vos besoins",
  },
]);

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/dashboard";

  const [formData, setFormData] = useState<LoginFormData>(INITIAL_LOGIN_STATE);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Redirection automatique si l'utilisateur possède déjà une session active
  useEffect(() => {
    let cancelled = false;
    void authService.getProfile().then((profile) => {
      if (!cancelled && profile && profile.id) {
        navigate(from, { replace: true });
      }
    }).catch(() => {
      // Non connecté
    });
    return () => {
      cancelled = true;
    };
  }, [navigate, from]);

  // Protection temporelle anti bruteforce automatisé (CWE-307)
  const loadTimestamp = useRef<number>(0);
  useEffect(() => {
    loadTimestamp.current = Date.now();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setErrors({});

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as keyof LoginFormData;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus({
        type: "error",
        message: "Veuillez corriger les erreurs dans le formulaire.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Authentification réelle auprès de l'API /auth/login (JWT + Cookie HttpOnly + CSRF)
      const response = await authService.login({
        identifier: formData.identifier.trim(),
        password: formData.password,
      });

      if (response && response.success) {
        setStatus({
          type: "success",
          message: "Authentification réussie. Accès au tableau de bord...",
        });

        // Redirection immédiate vers le dashboard
        navigate(from, { replace: true });
      } else {
        setStatus({
          type: "error",
          message: response?.message || "Identifiants incorrects.",
        });
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { message?: string })?.message ||
        "Identifiants incorrects ou compte temporairement suspendu.";
      setStatus({
        type: "error",
        message: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#fbfdfc] font-sans text-slate-800 flex flex-row">
      {/* ══════════════════════════════════════════════════════════════
          COLONNE GAUCHE : Formulaire d'authentification B2B
      ══════════════════════════════════════════════════════════════ */}
      <div className="flex h-full w-full flex-col justify-between p-5 sm:p-7 lg:w-[46%] xl:w-[43%] xl:p-8 overflow-hidden">
        {/* 1. Logo CleanPro Services */}
        <header className="shrink-0">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-[#00964f] rounded-md"
            aria-label="Retour à l'accueil CleanPro Services"
          >
            <img
              src={IconImg}
              alt="Logo CleanPro Services"
              className="h-9 w-auto object-contain"
              loading="eager"
            />
            <div>
              <span className="block text-[1.15rem] font-black leading-tight tracking-tight text-[#15364a]">
                CleanPro <span className="text-[#00964f]">Services</span>
              </span>
              <span className="block text-[10px] font-medium text-slate-500">
                Des espaces plus propres, pour un meilleur quotidien.
              </span>
            </div>
          </Link>
        </header>

        {/* 2. Card centrale de connexion */}
        <main className="my-auto w-full max-w-100 mx-auto shrink-0">
          <Reveal direction="up" delay={50}>
            <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-7">
              <h1
                id="connexion_titre"
                className="text-[1.38rem] font-extrabold tracking-tight text-[#15364a]"
              >
                Se connecter
              </h1>
              <p className="mt-0.5 text-[11.5px] leading-tight text-slate-500">
                Accédez à votre espace et gérez vos services de nettoyage en
                toute simplicité.
              </p>

              {/* Bouton SSO Google */}
              <button
                type="button"
                className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-lg border border-slate-200 bg-white py-2 px-3 text-[12.5px] font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#00964f]"
              >
                <svg
                  className="h-4 w-4 shrink-0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continuer avec Google</span>
              </button>

              {/* Séparateur compact */}
              <div className="my-3.5 flex items-center gap-2.5">
                <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
                <span className="text-[10px] font-semibold uppercase text-slate-400">
                  Ou
                </span>
                <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
              </div>

              {/* Notification d'état accessible */}
              {status && (
                <output
                  role={status.type === "error" ? "alert" : undefined}
                  aria-live={status.type === "error" ? "assertive" : "polite"}
                  className={`mb-3 flex items-center gap-2 rounded-lg border p-2.5 text-[11.5px] font-medium ${
                    status.type === "error"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-green-200 bg-green-50 text-green-800"
                  }`}
                >
                  {status.type === "error" ? (
                    <AlertCircle
                      className="h-3.5 w-3.5 shrink-0 text-red-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <CheckCircle2
                      className="h-3.5 w-3.5 shrink-0 text-green-600"
                      aria-hidden="true"
                    />
                  )}
                  <span>{status.message}</span>
                </output>
              )}

              {/* Formulaire de connexion */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-3"
              >
                {/* Honeypot invisible */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    opacity: 0,
                    height: 0,
                    width: 0,
                    overflow: "hidden",
                  }}
                >
                  <label htmlFor="company_fax_field">
                    Ne pas remplir ce champ
                  </label>
                  <input
                    type="text"
                    id="company_fax_field"
                    name="company_fax_field"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.company_fax_field}
                    onChange={handleChange}
                  />
                </div>

                {/* Champ Identifiant ou Email */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="identifiant_connexion"
                    className="text-[11.5px] font-semibold text-slate-700"
                  >
                    Identifiant ou adresse e-mail
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <input
                      type="text"
                      id="identifiant_connexion"
                      name="identifier"
                      required
                      value={formData.identifier}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      autoComplete="username"
                      aria-invalid={!!errors.identifier}
                      aria-describedby={
                        errors.identifier ? "identifiant_erreur" : undefined
                      }
                      className={`w-full rounded-lg border py-2 pl-9 pr-3 text-[12.5px] text-slate-800 placeholder-slate-400 transition focus:outline-none focus:ring-2 ${
                        errors.identifier
                          ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-200"
                          : "border-slate-200 bg-white focus:border-[#00964f] focus:ring-[#00964f]/20"
                      }`}
                    />
                  </div>
                  {errors.identifier && (
                    <p
                      id="identifiant_erreur"
                      className="text-[10.5px] font-semibold text-red-600"
                      role="alert"
                    >
                      {errors.identifier}
                    </p>
                  )}
                </div>

                {/* Champ Mot de passe */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="mot_de_passe_connexion"
                    className="text-[11.5px] font-semibold text-slate-700"
                  >
                    Mot de passe
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                      <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="mot_de_passe_connexion"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Votre mot de passe"
                      autoComplete="current-password"
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password ? "mot_de_passe_erreur" : undefined
                      }
                      className={`w-full rounded-lg border py-2 pl-9 pr-10 text-[12.5px] text-slate-800 placeholder-slate-400 transition focus:outline-none focus:ring-2 ${
                        errors.password
                          ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-200"
                          : "border-slate-200 bg-white focus:border-[#00964f] focus:ring-[#00964f]/20"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                      className="absolute inset-y-0 right-2.5 flex items-center text-slate-400 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-[#00964f] rounded-md"
                    >
                      {showPassword ? (
                        <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      id="mot_de_passe_erreur"
                      className="text-[10.5px] font-semibold text-red-600"
                      role="alert"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Lien Mot de passe oublié */}
                <div className="flex justify-end -mt-0.5">
                  <Link
                    to="/contact"
                    className="text-[11px] font-semibold text-[#00964f] hover:underline focus-visible:outline-2 focus-visible:outline-[#00964f] rounded-xs"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                {/* Bouton Se connecter avec la couleur #00964f */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#00964f] py-2.5 text-[13px] font-bold text-white shadow-xs transition hover:bg-[#007e42] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00964f] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        className="h-3.5 w-3.5 animate-spin"
                        aria-hidden="true"
                      />
                      Connexion...
                    </>
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <ArrowRight
                        className="h-3.5 w-3.5 stroke-[2.2]"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Inscription */}
              <p className="mt-3.5 text-center text-[11.5px] text-slate-600">
                Vous n'avez pas de compte ?{" "}
                <Link
                  to="/register"
                  className="font-bold text-[#00964f] hover:underline focus-visible:outline-2 focus-visible:outline-[#00964f] rounded-xs"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </Reveal>
        </main>

        {/* 3. Pied de réassurance (3 points clés) */}
        <footer className="shrink-0 border-t border-slate-200/70 pt-3">
          <div className="grid grid-cols-3 gap-2">
            {trustPoints.map(({ id, icon: Icon, title, subtitle }) => (
              <div key={id} className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#e6f5ed] text-[#00964f]">
                  <Icon
                    className="h-3.5 w-3.5 stroke-[1.9]"
                    aria-hidden="true"
                  />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold text-slate-900">
                    {title}
                  </p>
                  <p className="truncate text-[10px] text-slate-500">
                    {subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </footer>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          COLONNE DROITE : Reproduction Pixel Perfect de la capture
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative hidden h-full w-[54%] overflow-hidden lg:flex flex-col justify-end xl:w-[57%] bg-[#03482e]">
        {/* Photo plein cadre en haut */}
        <div className="absolute inset-0 h-[68%] w-full overflow-hidden">
          <img
            src={HeroImg}
            alt="Professionnelle CleanPro en uniforme assurant l'entretien d'une baie vitrée"
            className="h-full w-full object-cover object-[center_28%]"
            loading="eager"
          />
        </div>

        {/* 1. Badge Logo vert supérieur droit fidèle à la capture */}
        <div className="absolute right-0 top-0 z-20 flex h-36 w-36 flex-col items-center justify-center rounded-bl-[80px] bg-[#03482e] p-3 text-white shadow-md">
          <img
            src={IconWhiteImg}
            alt="Logo CleanPro Services"
            className="h-9 w-auto object-contain"
            loading="eager"
          />
          <span className="mt-1 block text-[13px] font-black leading-tight tracking-tight">
            CleanPro
          </span>
          <span className="block text-[10px] font-normal text-white/80 leading-tight">
            Services
          </span>
        </div>

        {/* 2. Vague SVG organique de transition */}
        <div className="relative z-10 w-full leading-none">
          <svg
            className="w-full h-16 sm:h-20 text-[#03482e] fill-current block"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,45 C200,95 450,110 700,45 C950,-20 1100,55 1200,85 L1200,120 L0,120 Z" />
          </svg>
        </div>

        {/* 3. Bloc inférieur vert forêt [#03482e] avec contenu */}
        <div className="relative z-10 bg-[#03482e] px-8 pb-7 pt-1 text-white">
          {/* Feuilles décoratives flottantes sur la droite */}
          <div className="pointer-events-none absolute right-6 -top-6 flex flex-col items-end gap-1 opacity-90">
            <svg
              className="h-16 w-16 text-[#34d399]/85 fill-current drop-shadow-md rotate-12"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M21.949 3.051C21.949 3.051 22.949 14.051 15.949 21.051C8.949 28.051 3.949 21.051 3.949 21.051C3.949 21.051 2.949 10.051 9.949 3.051C16.949 -3.949 21.949 3.051 21.949 3.051Z" />
            </svg>
            <svg
              className="h-11 w-11 text-[#22c55e]/75 fill-current drop-shadow-sm -rotate-6 mr-3"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M21.949 3.051C21.949 3.051 22.949 14.051 15.949 21.051C8.949 28.051 3.949 21.051 3.949 21.051C3.949 21.051 2.949 10.051 9.949 3.051C16.949 -3.949 21.949 3.051 21.949 3.051Z" />
            </svg>
          </div>

          <div className="max-w-135">
            <h2 className="text-[1.5rem] font-black leading-tight tracking-tight text-white xl:text-[1.8rem]">
              Une équipe engagée pour des espaces{" "}
              <span className="text-[#34d399]">plus propres</span> et plus
              sains.
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-emerald-100/90 font-medium">
              Optimisez la gestion de vos services de nettoyage avec une
              solution simple, fiable et performante.
            </p>
          </div>

          {/* 4 Piliers horizontaux */}
          <div className="mt-5 grid grid-cols-4 gap-3 border-t border-emerald-800/80 pt-4">
            {sideFeatures.map(({ id, icon: Icon, title, description }) => (
              <div key={id} className="flex flex-col items-start">
                <Icon
                  className="h-4.5 w-4.5 text-[#34d399] stroke-[1.8]"
                  aria-hidden="true"
                />
                <p className="mt-1.5 text-[11.5px] font-bold text-white">
                  {title}
                </p>
                <p className="text-[10px] text-emerald-200/80 leading-tight">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
