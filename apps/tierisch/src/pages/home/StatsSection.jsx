import React from "react";
import Reveal from "../../components/Reveal";
import SectionShell from "../../components/ui/SectionShell";
import StatCard from "../../components/ui/StatCard";
import { ASSET_BASE } from "../../components/ui/helpers";

const DEFAULT_ITEMS = [
  {
    title: "Glückliche Kunden",
    value: "+4,673",
    subtitle: "glückliche Tierfamilien – Ob Hund, Katze oder Kaninchen – wir bieten individuellen Schutz.",
    image: `${ASSET_BASE}/images/1-1.png`,
  },
  {
    title: "Erfolgreiche Operationen Abgesichert",
    value: "+29,821",
    subtitle: "Operationen begleitet – wir übernehmen die Kosten, wenn es darauf ankommt.",
    image: `${ASSET_BASE}/images/2-1.png`,
  },
  {
    title: "Genehmigungsquote",
    value: "97.80%",
    subtitle: "aller Fälle genehmigt – Schnell, fair, transparent.",
    image: `${ASSET_BASE}/images/Genehmigungsquote-a.png`,
  },
];

export default function StatsSection({ items = DEFAULT_ITEMS }) {
  const list = Array.isArray(items) && items.length ? items : DEFAULT_ITEMS;

  return (
    <SectionShell className="py-12">
      <div className="grid gap-6 md:grid-cols-3">
        {list.map((item, i) => (
          <Reveal key={item.title} delay={i * 120}>
            <StatCard
              title={item.title}
              value={item.value}
              subtitle={item.subtitle}
              imageSrc={item.image || item.imageSrc}
            />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}