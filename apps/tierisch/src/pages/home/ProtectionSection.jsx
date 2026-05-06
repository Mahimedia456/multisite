import React, { useMemo } from "react";
import Reveal from "../../components/Reveal";
import SectionShell from "../../components/ui/SectionShell";
import PillDivider from "../../components/ui/PillDivider";
import { ASSET_BASE } from "../../components/ui/helpers";

export default function ProtectionSection({
  title = "Finden Sie den passenden Schutz für Ihr Tier",
  subtitle = "Unsere Tarife sind auf die Bedürfnisse von Hunden, Katzen und Pferden abgestimmt – klar, verständlich und flexibel.",
  cards,
}) {
  const defaultCards = useMemo(
    () => [
      {
        title: "Der OP-Schutz: Die Grundlage für die Gesundheit Ihres Vierbeiners",
        image: `${ASSET_BASE}/images/2-1-1-768x512.png`,
        content: [
          "Sichern Sie die Gesundheit Ihres Lieblings mit dem OP-Schutz.",
          "Von den Vorbereitungen über die OP selbst bis hin zur Nachbehandlung.",
        ],
      },
      {
        title: "Der Rundumschutz für die Gesundheit Ihres Tieres: Die Heilbehandlung",
        image: `${ASSET_BASE}/images/3-1-1.png`,
        content: [
          "Mit unserem Vollkrankenschutz sichern wir die gesamte medizinische Versorgung Ihres Tieres ab.",
          "Auch physiotherapeutische Maßnahmen sind abgesichert.",
        ],
      },
      {
        title: "Die Vorsorge-Pauschale: Für die Gesundheit, die Sie in der Hand haben",
        image: `${ASSET_BASE}/images/1-1-1.png`,
        content: [
          "Mit unserem Vorsorge-Schutz setzen wir auf Prävention.",
          "Wurmkur, Impfungen und Flohschutz können unterstützt werden.",
        ],
      },
    ],
    []
  );

  const list = Array.isArray(cards) && cards.length ? cards : defaultCards;

  return (
    <SectionShell className="py-14">
      <Reveal>
        <h2 className="text-center text-2xl font-black text-slate-900">
          {title}
        </h2>
      </Reveal>

      <PillDivider />

      <Reveal delay={120}>
        <p className="mx-auto max-w-2xl text-center text-sm text-slate-600">
          {subtitle}
        </p>
      </Reveal>

      <div className="mt-10 space-y-8">
        {list.map((c, i) => (
          <Reveal key={c.title} delay={i * 120}>
            <div className="grid items-start gap-6 rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(2,6,23,0.08)] lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-black text-slate-900">{c.title}</h3>

                <div className="mt-4 text-sm leading-relaxed text-slate-600">
                  {(c.content || []).map((p, idx) => (
                    <p key={idx} className={idx ? "mt-3" : ""}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <img
                  src={c.image}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}