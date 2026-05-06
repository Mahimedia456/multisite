import React, { useMemo } from "react";
import Reveal from "../../components/Reveal";
import SectionShell from "../../components/ui/SectionShell";
import TealCard from "../../components/ui/TealCard";
import { Brain, FileSearch, Handshake } from "lucide-react";

const ICON_MAP = {
  Brain,
  FileSearch,
  Handshake,
};

export default function StepsSection({
  title = "Sag dem Versicherungsdschungel ade – wir bringen Klarheit und finden die optimale Lösung für dich und dein Tier.",
  items,
}) {
  const defaultItems = useMemo(
    () => [
      {
        title: "Marktanalyse nach den Bedürfnissen deines Hundes",
        desc: "Wir durchsuchen den Markt – über 30 Versicherer – und finden genau den Schutz, der zu deinem Vierbeiner passt.",
        icon: "Brain",
      },
      {
        title: "Welche Versicherung kommt für euch in Frage?",
        desc: "Du erhältst von uns eine Auswahl von 3 bis 4 passenden Angeboten, die speziell auf deinen Hund abgestimmt sind.",
        icon: "FileSearch",
      },
      {
        title: "Unsere Empfehlung – persönlich und transparent",
        desc: "In einem kostenfreien, unverbindlichen Gespräch erklären wir dir, welche Versicherung wir empfehlen und warum – so findest du genau den Schutz, der wirklich sinnvoll ist.",
        icon: "Handshake",
      },
    ],
    []
  );

  const steps = Array.isArray(items) && items.length ? items : defaultItems;

  return (
    <SectionShell className="py-12">
      <Reveal>
        <h2 className="text-center text-xl font-black text-slate-900 md:text-2xl">
          {title}
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        {steps.map((s, i) => {
          const Icon = ICON_MAP[s.icon] || Brain;

          return (
            <Reveal key={s.title} delay={i * 120}>
              <TealCard
                title={s.title}
                desc={s.desc}
                icon={<Icon className="h-6 w-6 text-white" />}
              />
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}