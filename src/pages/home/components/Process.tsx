import React from "react";
import {
  CalendarDays,
  CheckCircle,
  User,
  Smile,
  ArrowRight,
} from "lucide-react";
import Reveal from "../../../components/ui/Reveal";
import ProcessImg from "../../../image/process.webp";

// SÉCURITÉ : Typage strict
interface ProcessStep {
  id: string;
  number: number;
  icon: React.ElementType;
  title: string;
  description: string;
}

// SÉCURITÉ (CWE-502) : Immutabilité des données statiques
const processSteps: readonly ProcessStep[] = Object.freeze([
  {
    id: "step1", // Suppression du tiret
    number: 1,
    icon: CalendarDays,
    title: "Demande de devis",
    description:
      "Indiquez vos besoins et recevez une proposition personnalisée.",
  },
  {
    id: "step2", // Suppression du tiret
    number: 2,
    icon: CheckCircle,
    title: "Validation",
    description: "Confirmez votre choix et planifiez l'intervention.",
  },
  {
    id: "step3", // Suppression du tiret
    number: 3,
    icon: User,
    title: "Nettoyage",
    description: "Notre équipe intervient selon le niveau de service choisi.",
  },
  {
    id: "step4", // Suppression du tiret
    number: 4,
    icon: Smile,
    title: "Suivi qualité",
    description:
      "Nous restons à votre écoute pour garantir votre satisfaction.",
  },
]);

export default function Process() {
  return (
    <section
      aria-labelledby="processus_titre" // Suppression du tiret
      className="w-full bg-[#f3f6f3] py-8 lg:py-10"
    >
      <div className="mx-auto grid max-w-[1700px] grid-cols-1 items-center gap-8 px-4 lg:grid-cols-[1.08fr_1.92fr] lg:px-8 xl:px-10">
        {/* Image du processus */}
        <Reveal direction="left" delay={100}>
          <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <img
              src={ProcessImg}
              alt="Agent d'entretien CleanPro utilisant une autolaveuse"
              loading="lazy"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="h-[420px] w-full object-cover object-center sm:h-[470px] lg:h-[440px] xl:h-[500px]"
            />
          </div>
        </Reveal>

        {/* Contenu textuel et étapes */}
        <div className="w-full">
          <Reveal direction="up" delay={200}>
            {/* Correction Linter: tracking-widest remplace tracking-[0.16em] */}
            <span className="mb-3 block text-[11px] font-bold uppercase tracking-widest text-[#1d6f4c]">
              COMMENT CA MARCHE ?
            </span>
            {/* Correction Linter: tracking-tighter remplace tracking-[-0.03em] */}
            <h2
              id="processus_titre" // Suppression du tiret
              className="mb-8 text-[2.1rem] font-extrabold leading-[1.05] tracking-tighter text-slate-900 sm:text-[2.5rem] lg:text-[2.7rem]"
            >
              Un processus simple
              <br />
              et efficace
            </h2>
          </Reveal>

          <div
            role="list"
            aria-label="Étapes du processus"
            className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between lg:gap-3"
          >
            {processSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex-1 sm:max-w-[200px]">
                  <Reveal direction="up" delay={300 + index * 150}>
                    <div
                      role="listitem"
                      className="flex flex-col items-center text-center sm:items-start sm:text-left"
                    >
                      {/* En-tête de l'étape : Numéro et Icône */}
                      <div className="mb-5 flex items-center justify-center gap-3 sm:justify-start">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d6f4c] text-[15px] font-bold text-white shadow-sm">
                          {step.number}
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d6f4c]/10 text-[#1d6f4c]">
                          {/* Correction Linter: stroke-2 */}
                          <step.icon
                            className="h-5 w-5 stroke-2"
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                      <h3 className="mb-2 text-[15px] font-bold leading-tight text-slate-900">
                        {step.title}
                      </h3>
                      <p className="text-[13px] leading-relaxed text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </Reveal>
                </div>

                {/* Flèche de séparation entre les étapes[cite: 5] */}
                {index < processSteps.length - 1 && (
                  <div className="hidden items-center justify-center pt-5 sm:flex">
                    <Reveal direction="none" delay={400 + index * 150}>
                      <ArrowRight
                        className="h-4 w-4 text-[#1d6f4c]/60"
                        aria-hidden="true"
                      />
                    </Reveal>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
