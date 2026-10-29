import CleaningImage from "../../../image/ensemble.webp";
import Reveal from "../../../components/ui/Reveal";

const teamStats = [
  { value: "+50", label: "Collaborateurs" },
  { value: "5", label: "Années d'expérience" },
  { value: "100%", label: "Engagés pour votre satisfaction" },
];

export default function TeamSection() {
  return (
    <section
      aria-labelledby="team-title"
      className="mx-auto grid w-full max-w-[1720px] items-center gap-8 px-6 pb-8 sm:px-8 md:grid-cols-[1fr_1.1fr] lg:gap-12 lg:px-10 lg:pb-10 xl:px-12"
    >
      <div className="h-75 overflow-hidden rounded-xl bg-[#edf5f0] sm:h-95 lg:h-105">
        <Reveal direction="right" delay={100}>
          <img
            src={CleaningImage}
            alt="Un professionnel CleanPro prend soin d'un espace de travail"
            loading="lazy"
            className="h-full w-full object-cover object-[center_45%]"
          />
        </Reveal>
      </div>
      <div>
        <Reveal direction="left" delay={200}>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#00964f]">
            NOTRE ÉQUIPE
          </p>
          <h2
            id="team-title"
            className="max-w-115 text-[2rem] font-extrabold leading-tight tracking-tight text-[#15364a] lg:text-[2.25rem]"
          >
            Des professionnels engagés à vos côtés
          </h2>
          <p className="mt-4 max-w-125 text-[15px] font-medium leading-relaxed text-slate-600">
            Notre équipe est composée de personnes qualifiées, formées aux
            meilleures pratiques de nettoyage et à la sécurité. Chaque membre
            partage la même mission : vous offrir un service irréprochable,
            adapté à vos besoins.
          </p>
          <dl className="mt-6 grid grid-cols-3 divide-x divide-slate-200">
            {teamStats.map(({ value, label }) => (
              <div key={label} className="px-4 first:pl-0">
                <dt className="text-[1.75rem] font-extrabold leading-none text-[#00964f]">
                  {value}
                </dt>
                <dd className="mt-2 text-[13px] leading-tight text-slate-500">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
