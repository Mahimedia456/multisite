import React, { useMemo } from "react";
import Reveal from "../../components/Reveal";
import SectionShell from "../../components/ui/SectionShell";
import TealCard from "../../components/ui/TealCard";

// lucide icons
import { Brain, FileSearch, Handshake } from "lucide-react";

export default function StepsSection() {
  const steps = useMemo(
    () => [
      {
        title: "Marktanalyse nach den Bedürfnissen deines Hundes",
        desc:
          "Wir durchsuchen den Markt – über 30 Versicherer – und finden genau den Schutz, der zu deinem Vierbeiner passt.",
        Icon: Brain,
      },
      {
        title: "Welche Versicherung kommt für euch in Frage?",
        desc:
          "Du erhältst von uns eine Auswahl von 3 bis 4 passenden Angeboten, die speziell auf deinen Hund abgestimmt sind.",
        Icon: FileSearch,
      },
      {
        title: "Unsere Empfehlung – persönlich und transparent",
        desc:
          "In einem kostenfreien, unverbindlichen Gespräch erklären wir dir, welche Versicherung wir empfehlen und warum – so findest du genau den Schutz, der wirklich sinnvoll ist.",
        Icon: Handshake,
      },
    ],
    []
  );

  return (
    <SectionShell className="py-12">
      <Reveal>
        <h2 className="text-center text-xl font-black text-slate-900 md:text-2xl">
          Sag dem Versicherungsdschungel ade – wir bringen Klarheit und finden die optimale
          Lösung für dich und dein Tier.
        </h2>
      </Reveal>

      {/* AUTO-FIT + EQUAL WIDTH */}
      <div className="mt-10 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 120}>
            <TealCard
              title={s.title}
              desc={s.desc}
              icon={<s.Icon className="h-6 w-6 text-white" />}
            />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
