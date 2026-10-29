import Reveal from "../../components/ui/Reveal";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16 font-sans text-slate-800">
      <Reveal direction="up" delay={50}>
        <h1 className="text-3xl font-extrabold text-[#15364a] mb-6">Politique de Confidentialité</h1>
        <div className="space-y-6 text-[15px] leading-relaxed text-slate-600">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#135d3b] mb-3">1. Collecte et finalité des données</h2>
            <p>CleanPro Services collecte uniquement les informations nécessaires au traitement de vos demandes de devis et messages via le formulaire de contact (nom, adresse e-mail, numéro de téléphone, message).</p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#135d3b] mb-3">2. Confidentialité & Non-divulgation</h2>
            <p>Vos données personnelles ne sont jamais vendues, cédées ou louées à des tiers. Elles sont conservées de manière chiffrée et sécurisée.</p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#135d3b] mb-3">3. Cookies & Session</h2>
            <p>Ce site utilise des cookies techniques de session et de protection CSRF strictement nécessaires à la sécurité et à la navigation fluide des utilisateurs et administrateurs.</p>
          </section>
        </div>
      </Reveal>
    </div>
  );
}

