import React from "react";
import Reveal from "../../components/Reveal";
import SectionShell from "../../components/ui/SectionShell";
import Card from "../../components/ui/Card";
import { ASSET_BASE } from "../../components/ui/helpers";

const DEFAULT_ITEMS = [
  {
    img: `${ASSET_BASE}/images/12.webp`,
    title: "Erfahrene Tierversicherungs-Experten",
    desc: "Unser Team vereint tiefes Versicherungs-Know-how mit tiermedizinischem Fachwissen.",
  },
  {
    img: `${ASSET_BASE}/images/13.webp`,
    title: "Schnelle Erstattung & 24/7 Betreuung",
    desc: "Wir sorgen für eine zügige Abwicklung deiner Anliegen.",
  },
  {
    img: `${ASSET_BASE}/images/13-1.webp`,
    title: "Sofortschutz für Jungtiere",
    desc: "Für Welpen, Kitten und Fohlen gilt keine Wartezeit.",
  },
];

export default function FeatureBoxesSection({ items = DEFAULT_ITEMS }) {
  const boxes = Array.isArray(items) && items.length ? items : DEFAULT_ITEMS;

  return (
    <SectionShell className="pb-14">
      <div className="grid gap-6 md:grid-cols-3">
        {boxes.map((b, i) => (
          <Reveal key={b.title} delay={i * 120}>
            <Card className="p-6 text-center">
              <img
                src={b.img || b.image}
                alt=""
                className="mx-auto h-24 w-24 object-contain"
                loading="lazy"
              />
              <h3 className="mt-4 text-base font-black text-slate-900">
                {b.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {b.desc}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}