import React, { useMemo } from "react";
import Reveal from "../../components/Reveal";
import SectionShell from "../../components/ui/SectionShell";
import PillDivider from "../../components/ui/PillDivider";
import { ASSET_BASE } from "../../components/ui/helpers";

export default function ProtectionSection() {
  const protectionCards = useMemo(
    () => [
      {
        title: "Der OP-Schutz: Die Grundlage für die Gesundheit Ihres Vierbeiners",
        text: (
          <>
            <p>
              Sichern Sie die Gesundheit Ihres Lieblings mit dem <strong>OP-Schutz</strong>. Dieser
              Baustein übernimmt alle Kosten, die bei einem operativen Eingriff anfallen.
            </p>
            <p className="mt-3">
              Von den <strong>Vorbereitungen</strong> – inklusive bildgebender Verfahren (MRT, CT,
              Röntgen) und Blutuntersuchungen – über die <strong>OP selbst</strong> bis hin zur{" "}
              <strong>Nachbehandlung</strong>. Dazu gehören Medikamente, Verbandsmaterial und der
              Aufenthalt in der Tierklinik.
            </p>
          </>
        ),
        image: `${ASSET_BASE}/images/2-1-1-768x512.png`,
      },
      {
        title: "Der Rundumschutz für die Gesundheit Ihres Tieres: Die Heilbehandlung",
        text: (
          <>
            <p>
              Mit unserem <strong>Vollkrankenschutz</strong> gehen wir noch einen Schritt weiter
              und sichern die gesamte medizinische Versorgung Ihres Tieres ab. Dieser Schutz
              ergänzt die Leistungen des OP-Schutzes um den „<strong>normalen</strong>“{" "}
              <strong>Tierarztbesuch</strong>.
            </p>
            <p className="mt-3">
              Ob Magen-Darm-Probleme, Augen- oder Ohrenentzündungen oder eine Verstauchung – wir
              übernehmen die Kosten, wenn es Ihrem Tier nicht gut geht. Das ist vergleichbar mit
              einer Krankenversicherung für uns Menschen.
            </p>
            <p className="mt-3">
              Zusätzlich sind auch <strong>physiotherapeutische Behandlungen</strong> abgedeckt,
              die Sie unabhängig von einer Operation bis zu 500 € pro Jahr nutzen können.
            </p>
          </>
        ),
        image: `${ASSET_BASE}/images/3-1-1.png`,
      },
      {
        title: "Die Vorsorge-Pauschale: Für die Gesundheit, die Sie in der Hand haben",
        text: (
          <>
            <p>
              Mit unserem <strong>Vorsorge-Schutz</strong> setzen wir auf Prävention. Dieser
              Baustein bietet Ihnen, unabhängig von Krankheit oder Operation, eine jährliche
              Pauschale von 50 € oder 100 €.
            </p>
            <p className="mt-3">
              Nutzen Sie diese Pauschale für wichtige Maßnahmen wie die jährliche{" "}
              <strong>Wurmkur</strong>, den Kauf von{" "}
              <strong>Zecken- oder Flohhalsbändern</strong> oder die{" "}
              <strong>notwendigen Impfungen</strong>.
            </p>
            <p className="mt-3">
              So stellen Sie sicher, dass Ihr Tier gesund bleibt und sind bestens auf die kleinen,
              aber wichtigen Kosten im Alltag vorbereitet.
            </p>
            <p className="mt-4 text-xs font-bold text-[#00938F]">Hinweis: Gilt nur für Welpen und Kitten</p>
          </>
        ),
        image: `${ASSET_BASE}/images/1-1-1.png`,
      },
    ],
    []
  );

  return (
    <SectionShell className="py-14">
      <Reveal>
        <h2 className="text-center text-2xl font-black text-slate-900">
          Finden Sie den passenden Schutz für Ihr Tier
        </h2>
      </Reveal>

      <PillDivider />

      <Reveal delay={120}>
        <p className="mx-auto max-w-2xl text-center text-sm text-slate-600">
          Unsere Tarife sind auf die Bedürfnisse von Hunden, Katzen und Pferden abgestimmt – klar,
          verständlich und flexibel.
        </p>
      </Reveal>

      <div className="mt-10 space-y-8">
        {protectionCards.map((c, i) => (
          <Reveal key={c.title} delay={i * 120}>
            <div className="grid items-start gap-6 rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(2,6,23,0.08)] lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-black text-slate-900">{c.title}</h3>
                <div className="mt-4 text-sm leading-relaxed text-slate-600">{c.text}</div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <img src={c.image} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
