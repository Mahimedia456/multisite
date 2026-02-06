import React, { useMemo } from "react";
import Reveal from "../../components/Reveal";
import SectionShell from "../../components/ui/SectionShell";
import PillDivider from "../../components/ui/PillDivider";
import FAQ from "../../components/ui/FAQ";

export default function FAQSection() {
  const items = useMemo(
    () => [
      {
        q: "Für welche Tiere ist die Versicherung geeignet?",
        a: "Unsere Tarife sind auf die Bedürfnisse von Hunden, Katzen und Pferden abgestimmt – klar, verständlich und flexibel.",
      },
      {
        q: "Gibt es Wartezeiten?",
        a: "Bei Jungtieren (Welpen/Kitten/Fohlen) kann der Schutz sofort starten. Je nach Tarif können für andere Tiere Wartezeiten gelten.",
      },
      {
        q: "Übernimmt die Versicherung auch Diagnostik (MRT/CT/Röntgen)?",
        a: "Ja – im Rahmen der versicherten Leistungen werden auch bildgebende Verfahren und notwendige Untersuchungen berücksichtigt.",
      },
      {
        q: "Wie läuft die Beratung ab?",
        a: "Sie erhalten eine Auswahl passender Angebote und wir erklären transparent, welche Lösung sinnvoll ist – kostenfrei und unverbindlich.",
      },
    ],
    []
  );

  return (
    <SectionShell id="FAQ" className="py-14">
      <Reveal>
        <h2 className="text-center text-2xl font-black text-slate-900">Häufige Fragen (FAQ)</h2>
      </Reveal>
      <PillDivider />
      <Reveal delay={120}>
        <FAQ items={items} />
      </Reveal>
    </SectionShell>
  );
}
