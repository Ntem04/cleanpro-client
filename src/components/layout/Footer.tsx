import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

import LogoBlancImg from "../../assets/icon.webp"; // Chemin corrigé vers le logo blanc
import {
  dashboardServicesApi,
  INITIAL_SETTINGS_DATA,
  type SettingsApiResponse,
} from "../../services/dashboardServicesApi";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<SettingsApiResponse>(
    INITIAL_SETTINGS_DATA,
  );

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        const data = await dashboardServicesApi.getSettings();
        if (!cancelled && data) {
          setSettings(data);
        }
      } catch {
        // Fallback
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
      window.removeEventListener(
        "cleanpro_settings_updated",
        handleSettingsUpdated,
      );
    };
  }, []);

  return (
    <footer className="bg-[#0d3f2d] text-white pt-16 pb-8 border-t-4 border-[#1d6f4c] font-sans">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Grille principale */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 mb-16">
          {/* 1. Colonne Logo & Slogan */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link
              to="/"
              className="flex items-center gap-3 mb-6 outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c] rounded-md"
            >
              <img
                src={LogoBlancImg}
                alt="Logo CleanPro Services"
                className="h-10 w-auto object-contain"
                loading="lazy"
              />
              <div className="flex flex-col leading-none justify-center">
                <span className="text-xl font-bold text-white tracking-tight">
                  CleanPro
                </span>
                <span className="text-[13px] font-medium text-slate-300 tracking-wide mt-0.5">
                  Services
                </span>
              </div>
            </Link>
            <p className="text-[14px] text-slate-300 font-medium tracking-wide">
              Propreté <span className="mx-2 text-[#1d6f4c]">•</span> Confiance{" "}
              <span className="mx-2 text-[#1d6f4c]">•</span> Performance
            </p>
          </div>

          {/* 2. Colonne Liens utiles */}
          <nav aria-label="Liens utiles du site">
            <h3 className="text-[15px] font-bold text-white mb-6 uppercase tracking-wider">
              Liens utiles
            </h3>
            <ul className="space-y-3.5">
              <li>
                <Link
                  to="/"
                  className="text-[14px] text-slate-300 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c] rounded-sm"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-[14px] text-slate-300 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c] rounded-sm"
                >
                  Nos services
                </Link>
              </li>
              <li>
                <Link
                  to="/a-propos"
                  className="text-[14px] text-slate-300 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c] rounded-sm"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-[14px] text-slate-300 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c] rounded-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* 3. Colonne Nos services */}
          <nav aria-label="Navigation des offres de services">
            <h3 className="text-[15px] font-bold text-white mb-6 uppercase tracking-wider">
              Nos services
            </h3>
            <ul className="space-y-3.5">
              <li>
                <Link
                  to="/#essentiel"
                  className="text-[14px] text-slate-300 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c] rounded-sm"
                >
                  Essentiel
                </Link>
              </li>
              <li>
                <Link
                  to="/#standard"
                  className="text-[14px] text-slate-300 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c] rounded-sm"
                >
                  Standard
                </Link>
              </li>
              <li>
                <Link
                  to="/#premium"
                  className="text-[14px] text-slate-300 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c] rounded-sm"
                >
                  Premium
                </Link>
              </li>
              <li>
                {/* SÉCURITÉ DESIGN : Suppression du tiret textuel et de l'ancre */}
                <Link
                  to="/#sur-mesure"
                  className="text-[14px] text-slate-300 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c] rounded-sm"
                >
                  Sur mesure
                </Link>
              </li>
            </ul>
          </nav>

          {/* 4. Colonne Contact */}
          <div>
            <h3 className="text-[15px] font-bold text-white mb-6 uppercase tracking-wider">
              Contact
            </h3>
            <address className="not-italic space-y-4">
              <a
                href={`tel:${(settings.contact.phone || "+237678123456").replace(/\s+/g, "")}`}
                className="flex items-center gap-3 text-[14px] text-slate-300 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c] rounded-sm w-fit"
              >
                <Phone
                  className="w-4 h-4 text-[#1d6f4c] stroke-2"
                  aria-hidden="true"
                />
                {settings.contact.phone || "+237 678 12 34 56"}
              </a>
              <a
                href={`mailto:${settings.contact.email || "contact@cleanpro.cm"}`}
                className="flex items-center gap-3 text-[14px] text-slate-300 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c] rounded-sm w-fit"
              >
                <Mail
                  className="w-4 h-4 text-[#1d6f4c] stroke-2"
                  aria-hidden="true"
                />
                {settings.contact.email || "contact@cleanpro.cm"}
              </a>
              <div className="flex items-start gap-3 text-[14px] text-slate-300">
                <MapPin
                  className="w-4 h-4 text-[#1d6f4c] stroke-2 mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <span>
                  {settings.contact.address ||
                    "Avenue de la Paix, Yaoundé Cameroun"}
                </span>
              </div>
            </address>
          </div>

          {/* 5. Colonne Suivez-nous */}
          <div>
            <h3 className="text-[15px] font-bold text-white mb-6 uppercase tracking-wider">
              Suivez nous
            </h3>
            <div className="flex items-center gap-3">
              {/* CORRECTION : rounded-full devient rounded-md pour le style B2B */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visitez notre page LinkedIn"
                className="bg-[#1d6f4c] hover:bg-[#155439] p-2.5 rounded-md text-slate-200 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d3f2d]"
              >
                <FaLinkedinIn className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visitez notre page Facebook"
                className="bg-[#1d6f4c] hover:bg-[#155439] p-2.5 rounded-md text-slate-200 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d3f2d]"
              >
                <FaFacebookF className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visitez notre page Instagram"
                className="bg-[#1d6f4c] hover:bg-[#155439] p-2.5 rounded-md text-slate-200 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d3f2d]"
              >
                <FaInstagram className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visitez notre chaîne YouTube"
                className="bg-[#1d6f4c] hover:bg-[#155439] p-2.5 rounded-md text-slate-200 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1d6f4c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d3f2d]"
              >
                <FaYoutube className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Barre inférieure (Copyright & Mentions Légales) */}
        <div className="pt-8 border-t border-[#1d6f4c]/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-slate-400 font-medium">
            © {currentYear} CleanPro Services. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-[13px] font-medium">
            <Link
              to="/mentionslegales"
              className="text-slate-400 hover:text-white transition-colors outline-none focus-visible:underline"
            >
              Mentions légales
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              to="/confidentialite"
              className="text-slate-400 hover:text-white transition-colors outline-none focus-visible:underline"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
