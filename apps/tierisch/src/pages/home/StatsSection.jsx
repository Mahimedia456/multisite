import React from "react";
import Reveal from "../../components/Reveal";
import SectionShell from "../../components/ui/SectionShell";
import StatCard from "../../components/ui/StatCard";
import { ASSET_BASE } from "../../components/ui/helpers";

export default function StatsSection() {
  return (
    <SectionShell className="py-12">
      <div className="grid gap-6 md:grid-cols-3">
        <Reveal>
          <StatCard
            title="Glückliche Kunden"
            value="+4,673"
            subtitle="glückliche Tierfamilien – Ob Hund, Katze oder Kaninchen – wir bieten individuellen Schutz, der Tierbesitzern echte Sicherheit gibt."
            imageSrc={`${ASSET_BASE}/images/1-1.png`}
          />
        </Reveal>

        <Reveal delay={120}>
          <StatCard
            title="Erfolgreiche Operationen Abgesichert"
            value="+29,821"
            subtitle="Operationen begleitet – Von der Zahn-OP bis zum lebensrettenden Eingriff – wir übernehmen die Kosten, wenn es darauf ankommt."
            imageSrc={`${ASSET_BASE}/images/2-1.png`}
          />
        </Reveal>

        <Reveal delay={240}>
          <StatCard
            title="Genehmigungsquote"
            value="97.80%"
            subtitle="aller Fälle genehmigt – Schnell, fair, transparent – so funktioniert Versicherung bei uns."
            imageSrc={`${ASSET_BASE}/images/Genehmigungsquote-a.png`}
          />
        </Reveal>
      </div>
    </SectionShell>
  );
}
