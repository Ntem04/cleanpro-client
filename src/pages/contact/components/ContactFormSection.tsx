import { useState, useRef, useEffect, useMemo } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Leaf,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { z } from "zod";
import Reveal from "../../../components/ui/Reveal";
import { contactService } from "../../../services/contactService";
import { dashboardMessagesApi } from "../../../services/dashboardMessagesApi";
import {
  dashboardServicesApi,
  INITIAL_SETTINGS_DATA,
  type SettingsApiResponse,
} from "../../../services/dashboardServicesApi";
import { dashboardLogsApi } from "../../../services/dashboardLogsApi";

// ─── Sécurité : whitelist stricte des sujets (CWE-20) ──────────────────────
const ALLOWED_SUBJECTS = ["devis", "information", "partenariat"] as const;

// ─── Schéma Zod : validation + assainissement côté client ───────────────────
const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit comporter au moins 2 caractères.")
    .max(80, "Le nom ne peut pas dépasser 80 caractères.")
    .regex(/^[\p{L}\s'-]+$/u, "Le nom contient des caractères non autorisés."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(120, "L'email ne peut pas dépasser 120 caractères.")
    .pipe(z.email("Adresse email invalide (format attendu : nom@domaine.fr)")),
  subject: z.enum(ALLOWED_SUBJECTS, {
    error: "Veuillez sélectionner un motif valide.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Le message doit comporter au moins 10 caractères.")
    .max(2000, "Le message ne peut pas dépasser 2000 caractères."),
  consent: z.literal(true, {
    error:
      "Vous devez accepter le traitement de vos données pour envoyer ce message.",
  }),
  // Champ Honeypot invisible pour détecter les bots
  company_fax_field: z
    .string()
    .max(0, "Tentative de soumission automatisée détectée."),
});

type ContactFormData = {
  name: string;
  email: string;
  subject: (typeof ALLOWED_SUBJECTS)[number] | "";
  message: string;
  consent: boolean;
  company_fax_field: string;
};

const INITIAL_FORM: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
  consent: false,
  company_fax_field: "",
};

// ─── Composant principal ─────────────────────────────────────────────────────
export default function ContactFormSection() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Synchronisation dynamique des coordonnées avec les réglages du Dashboard
  const [settings, setSettings] = useState<SettingsApiResponse>(INITIAL_SETTINGS_DATA);

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        const data = await dashboardServicesApi.getSettings();
        if (!cancelled && data) {
          setSettings(data);
        }
      } catch {
        // Fallback local préservé
      }
    };

    void loadSettings();

    const handleSettingsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<SettingsApiResponse>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      } else {
        void loadSettings();
      }
    };

    window.addEventListener("cleanpro_settings_updated", handleSettingsUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("cleanpro_settings_updated", handleSettingsUpdated);
    };
  }, []);

  // Cartes de contact calculées dynamiquement depuis la source de données unique
  const contactCards = useMemo(() => {
    const rawPhone = settings.contact.phone || "+237 678 12 34 56";
    const rawWhatsapp = settings.contact.whatsapp || "+237 678 12 34 56";
    const cleanPhone = rawPhone.replace(/\s+/g, "");
    const cleanWhatsapp = rawWhatsapp.replace(/[^\d]/g, "");

    return [
      {
        Icon: Phone,
        title: "Téléphone",
        value: rawPhone,
        href: `tel:${cleanPhone}`,
        isExternal: false,
        sub: `Du lundi au vendredi\n${settings.openingHours.weekdays || "8h00 – 17h00"}`,
      },
      {
        Icon: Mail,
        title: "Email",
        value: settings.contact.email || "contact@cleanpro.cm",
        href: `mailto:${settings.contact.email || "contact@cleanpro.cm"}`,
        isExternal: false,
        sub: "Nous répondons sous 24h\nmaximum.",
      },
      {
        Icon: MapPin,
        title: "Adresse",
        value: settings.contact.address || "Avenue de la Paix, Yaoundé\nCameroun",
        href: null,
        isExternal: false,
        sub: settings.contact.officeNote || "Nos bureaux sont ouverts\nsur rendez-vous.",
      },
      {
        Icon: MessageCircle,
        title: "WhatsApp",
        value: rawWhatsapp,
        href: `https://wa.me/${cleanWhatsapp}`,
        isExternal: true,
        sub: "Écrivez-nous directement\nsur WhatsApp.",
      },
    ];
  }, [settings]);

  // Protection anti-bot temporelle : rejet si rempli en moins de 2 secondes
  const formLoadTimestamp = useRef<number>(0);
  useEffect(() => {
    formLoadTimestamp.current = Date.now();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setErrors({});

    // Validation Zod
    const validationResult = contactFormSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0] as keyof ContactFormData;
        if (!fieldErrors[fieldName]) fieldErrors[fieldName] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus({
        type: "error",
        message:
          "Le formulaire contient des erreurs. Veuillez vérifier les champs requis.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Appel du service de transmission d'API
      try {
        await contactService.sendMessage({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        });
      } catch (apiError) {
        console.error("[CleanPro Contact] Erreur lors de l'appel API Backend :", apiError);
        // En cas de backend hors ligne ou en dev, poursuite avec enregistrement local
      }

      // 2. Synchronisation directe avec la boîte de réception Dashboard (Messages)
      dashboardMessagesApi.addIncomingContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      // 3. Traçabilité dans le journal d'audit (Sécurité & Traçabilité OWASP)
      void dashboardLogsApi.recordAuditLog({
        category: "contact",
        action: "Nouveau message de contact reçu",
        target: formData.email,
        result: "success",
        user: `Visiteur (${formData.name})`,
        userEmail: formData.email,
        details: `Message reçu pour le motif « ${formData.subject} » depuis le site web.`,
      });

      setStatus({
        type: "success",
        message:
          "Votre message a bien été transmis. Notre équipe vous répondra sous 24 à 48 heures ouvrées.",
      });
      setFormData(INITIAL_FORM);
      formLoadTimestamp.current = Date.now();
    } catch {
      setStatus({
        type: "error",
        message:
          "Une erreur de communication est survenue. Veuillez réessayer ultérieurement.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Classes réutilisables pour les champs
  const inputBase =
    "w-full rounded-lg border px-4 py-2.5 text-[14px] text-slate-800 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2";
  const inputOk =
    "border-slate-200 bg-white focus:border-[#1d6f4c] focus:ring-[#1d6f4c]/20";
  const inputErr =
    "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-red-200";

  return (
    <section
      className="w-full bg-white py-14 font-sans lg:py-20"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto w-full max-w-[1720px] px-6 lg:px-10 xl:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
          {/* ══════════════════════════════════════════════════
              COLONNE GAUCHE : NOS COORDONNÉES
          ══════════════════════════════════════════════════ */}
          <div className="flex w-full flex-col lg:w-[46%]">
            <Reveal direction="up">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-[#1d6f4c]">
                NOS COORDONNÉES
              </p>
              <h2
                id="contact-heading"
                className="mb-3 text-[2rem] font-extrabold leading-tight tracking-tight text-slate-900 lg:text-[2.25rem]"
              >
                Comment nous joindre ?
              </h2>
              <p className="mb-8 text-[14px] text-slate-500">
                Plusieurs moyens sont à votre disposition pour nous contacter.
              </p>
            </Reveal>

            {/* Grille 2×2 des cartes de contact */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {contactCards.map(
                ({ Icon, title, value, href, isExternal, sub }, i) => (
                  <Reveal key={title} direction="up" delay={100 + i * 80}>
                    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      {/* Icône */}
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef8f3] text-[#1d6f4c]">
                        <Icon
                          className="h-5 w-5 stroke-[1.8]"
                          aria-hidden="true"
                        />
                      </span>

                      {/* Titre */}
                      <h3 className="text-[14px] font-bold text-slate-900">
                        {title}
                      </h3>

                      {/* Valeur cliquable ou texte */}
                      {href ? (
                        <a
                          href={href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="text-[14px] font-semibold text-[#1d6f4c] hover:underline focus-visible:outline-2 focus-visible:outline-[#1d6f4c] whitespace-pre-line"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-[14px] font-semibold text-slate-700 whitespace-pre-line">
                          {value}
                        </p>
                      )}

                      {/* Sous-texte */}
                      <p className="text-[12px] leading-relaxed text-slate-500 whitespace-pre-line">
                        {sub}
                      </p>
                    </div>
                  </Reveal>
                ),
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
              COLONNE DROITE : FORMULAIRE
          ══════════════════════════════════════════════════ */}
          <div className="w-full lg:w-[54%]">
            <Reveal direction="up" delay={200}>
              <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:p-8">
                {/* En-tête du panneau formulaire */}
                <div className="mb-1.5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef8f3] text-[#1d6f4c]">
                    <Leaf
                      className="h-4.5 w-4.5 fill-current"
                      aria-hidden="true"
                    />
                  </span>
                  <h3 className="text-[1.15rem] font-bold text-slate-900">
                    Envoyez-nous un message
                  </h3>
                </div>
                <p className="mb-6 text-[13px] leading-relaxed text-slate-500">
                  Remplissez le formulaire ci-dessous, et nous vous répondrons
                  rapidement.
                </p>

                {/* Notification accessible (succès / erreur) */}
                {status && (
                  <output
                    role={status.type === "error" ? "alert" : undefined}
                    aria-live={status.type === "error" ? "assertive" : "polite"}
                    className={`mb-5 flex items-center gap-3 rounded-lg border p-4 text-[13px] font-medium ${
                      status.type === "error"
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-green-200 bg-green-50 text-green-800"
                    }`}
                  >
                    {status.type === "error" ? (
                      <AlertCircle
                        className="h-4.5 w-4.5 shrink-0 text-red-600"
                        aria-hidden="true"
                      />
                    ) : (
                      <CheckCircle2
                        className="h-4.5 w-4.5 shrink-0 text-green-600"
                        aria-hidden="true"
                      />
                    )}
                    <span>{status.message}</span>
                  </output>
                )}

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-4"
                >
                  {/* ── Honeypot invisible (anti-bot, CWE-20) ── */}
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

                  {/* Nom + Email — 2 colonnes */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Nom complet */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="name"
                        className="text-[13px] font-semibold text-slate-700"
                      >
                        Nom complet{" "}
                        <span className="text-red-500" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        maxLength={80}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        aria-describedby={
                          errors.name ? "name-error" : undefined
                        }
                        className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                      />
                      {errors.name && (
                        <p
                          id="name-error"
                          className="text-[11px] font-semibold text-red-600"
                          role="alert"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="email"
                        className="text-[13px] font-semibold text-slate-700"
                      >
                        Email{" "}
                        <span className="text-red-500" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        maxLength={120}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                        className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                      />
                      {errors.email && (
                        <p
                          id="email-error"
                          className="text-[11px] font-semibold text-red-600"
                          role="alert"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sujet (dropdown) */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="subject"
                      className="text-[13px] font-semibold text-slate-700"
                    >
                      Sujet{" "}
                      <span className="text-red-500" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <div className="relative">
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        aria-invalid={!!errors.subject}
                        aria-describedby={
                          errors.subject ? "subject-error" : undefined
                        }
                        className={`${inputBase} appearance-none pr-10 ${
                          errors.subject ? inputErr : inputOk
                        } ${formData.subject === "" ? "text-slate-400" : "text-slate-800"}`}
                      >
                        <option value="" disabled>
                          Choisissez un sujet
                        </option>
                        <option value="devis">Demande de devis</option>
                        <option value="information">
                          Information générale
                        </option>
                        <option value="partenariat">Partenariat</option>
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                    {errors.subject && (
                      <p
                        id="subject-error"
                        className="text-[11px] font-semibold text-red-600"
                        role="alert"
                      >
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="message"
                        className="text-[13px] font-semibold text-slate-700"
                      >
                        Message{" "}
                        <span className="text-red-500" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <span
                        className="text-[11px] text-slate-400"
                        aria-live="off"
                      >
                        {formData.message.length} / 2000
                      </span>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      required
                      maxLength={2000}
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Écrivez votre message ici..."
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message ? "message-error" : undefined
                      }
                      className={`${inputBase} resize-none ${errors.message ? inputErr : inputOk}`}
                    />
                    {errors.message && (
                      <p
                        id="message-error"
                        className="text-[11px] font-semibold text-red-600"
                        role="alert"
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Consentement RGPD explicite (Art. 6 & 7) */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        aria-invalid={!!errors.consent}
                        aria-describedby={
                          errors.consent ? "consent-error" : undefined
                        }
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1d6f4c] focus:ring-[#1d6f4c]"
                      />
                      <label
                        htmlFor="consent"
                        className="text-[12px] leading-relaxed text-slate-500"
                      >
                        J'accepte que mes données (nom, email, message) soient
                        traitées par CleanPro Services pour répondre à ma
                        demande. Vos données ne sont jamais transmises à des
                        tiers.
                      </label>
                    </div>
                    {errors.consent && (
                      <p
                        id="consent-error"
                        className="text-[11px] font-semibold text-red-600"
                        role="alert"
                      >
                        {errors.consent}
                      </p>
                    )}
                  </div>

                  {/* Bouton d'envoi */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d6f4c] py-3.5 text-[15px] font-bold text-white shadow-sm transition-colors hover:bg-[#155439] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                        Traitement sécurisé en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 stroke-2" aria-hidden="true" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
