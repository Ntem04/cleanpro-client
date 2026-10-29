import { Leaf, ShieldCheck, Star, UsersRound } from "lucide-react";
import Reveal from "../../../components/ui/Reveal";

// SÉCURITÉ : Typage strict
interface ValueItem {
  Icon: React.ElementType;
  title: string;
  description: string;
}

// SÉCURITÉ (CWE-502) : Immutabilité des données statiques
const values: readonly ValueItem[] = Object.freeze([
  {
    Icon: ShieldCheck,
    title: "Fiabilité",
    description: "Nous respectons nos engagements, toujours.",
  },
  {
    Icon: Leaf,
    title: "Écologie",
    description: "Des produits et méthodes respectueux de l'environnement.",
  },
  {
    Icon: UsersRound,
    title: "Professionnalisme",
    description: "Une équipe formée et passionnée.",
  },
  {
    Icon: Star,
    title: "Satisfaction client",
    description: "Votre confiance est notre plus belle récompense.",
  },
]);

export default function CompanyValues() {
  return (
    <section
      // DIRECTIVE RESPECTÉE : Zéro tiret dans l'ID
      aria-labelledby="company_values_title"
      // Rigueur B2B : Remplacement du rounded-2xl par rounded-md (Angles pro)
      className="mx-auto mb-8 w-full max-w-[1720px] rounded-md bg-[#f2f8f5] px-6 py-12 sm:px-8 lg:px-10 lg:py-14 xl:px-12 font-sans"
    >
      {/* 
        SOLUTION D'ALIGNEMENT : 
        Séparation claire en Flexbox (1/3 Gauche, 2/3 Droite) pour forcer 
        l'alignement horizontal sur Desktop.
      */}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        {/* Colonne Gauche : Titre et Description */}
        <div className="w-full lg:w-1/3 shrink-0">
          <Reveal direction="right" delay={100}>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#00964f]">
              NOS VALEURS
            </p>
            <h2
              id="company_values_title"
              className="text-[1.75rem] font-extrabold tracking-tight text-[#15364a] lg:text-[2rem] leading-tight mb-4"
            >
              Ce qui nous guide <br className="hidden xl:block" />
              chaque jour
            </h2>
            <p className="max-w-sm text-[14px] font-medium leading-relaxed text-slate-600">
              Nos valeurs sont le socle de notre engagement et de la qualité de
              service que nous offrons à chaque client.
            </p>
          </Reveal>
        </div>

        {/* Colonne Droite : Grille des 4 valeurs */}
        <div className="w-full lg:w-2/3">
          {/* 
            CORRECTION ARCHITECTURALE : 
            Le composant Reveal englobe TOUTE la grille. Ainsi, les <article> 
            restent des enfants directs de la classe "grid", ce qui permet 
            au divide-x de fonctionner parfaitement[cite: 8].
          */}
          <Reveal direction="up" delay={200}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 sm:gap-y-12 lg:gap-y-0 lg:divide-x lg:divide-slate-200/80">
              {values.map(({ Icon, title, description }) => (
                <article
                  key={title}
                  className="flex flex-col items-center px-4 text-center first:lg:pl-0 last:lg:pr-0"
                >
                  {/* Badges d'icônes : Les cercles sont standards pour des icônes isolées (non cliquables)[cite: 8] */}
                  <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e0f2e8] text-[#00964f]">
                    {/* LINTER CORRECTION : stroke-[2.2] -> stroke-2 */}
                    <Icon className="h-6 w-6 stroke-2" aria-hidden="true" />
                  </span>
                  <h3 className="mb-2 text-[15px] font-bold text-[#15364a]">
                    {title}
                  </h3>
                  <p className="max-w-[160px] text-[13px] font-medium leading-relaxed text-slate-500">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
