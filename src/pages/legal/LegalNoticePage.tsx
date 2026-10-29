import Reveal from "../../components/ui/Reveal";

export default function LegalNoticePage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16 font-sans text-slate-800">
      <Reveal direction="up" delay={50}>
        <h1 className="text-3xl font-extrabold text-[#15364a] mb-6">Mentions Légales</h1>
        <div className="space-y-6 text-[15px] leading-relaxed text-slate-600">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#135d3b] mb-3">1. Éditeur du site</h2>
            <p><strong>Société :</strong> CleanPro Services S.A.R.L.</p>
            <p><strong>Siège social :</strong> Avenue de la Paix, Yaoundé, Cameroun</p>
            <p><strong>Téléphone :</strong> +237 678 12 34 56</p>
            <p><strong>E-mail :</strong> contact@cleanpro.cm</p>
            <p><strong>Registre de Commerce :</strong> RC/YAO/2026/B/1428</p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#135d3b] mb-3">2. Hébergement et Sécurité</h2>
            <p>Ce site et son interface d'administration sont hébergés sur des infrastructures sécurisées conformes aux normes de chiffrement TLS 1.3 et aux recommandations de l'ANSSI.</p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#135d3b] mb-3">3. Propriété intellectuelle</h2>
            <p>L'ensemble des contenus, visuels, textes, logos et marques figurant sur ce site sont la propriété exclusive de CleanPro Services. Toute reproduction, même partielle, est interdite sans autorisation préalable.</p>
          </section>
        </div>
      </Reveal>
    </div>
  );
}

