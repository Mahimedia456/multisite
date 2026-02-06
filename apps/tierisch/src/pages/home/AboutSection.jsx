import React from "react";
import Reveal from "../../components/Reveal";
import SectionShell from "../../components/ui/SectionShell";
import { ASSET_BASE } from "../../components/ui/helpers";

export default function AboutSection() {
  return (
    <SectionShell id="Über" className="py-14">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <Reveal>
            <h2 className="text-2xl font-black text-slate-900">Über Tierisch Gut Versichert</h2>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-600">
              <p>
                Wir bei Tierisch Gut Versichert sind überzeugt: Jedes Tier verdient beste medizinische Versorgung – ohne
                finanzielle Sorgen für seine Halter. Deshalb bieten wir maßgeschneiderte Versicherungen für Hunde, Katzen
                und Pferde, basierend auf der bewährten Qualität der stärksten Versicherer.
              </p>
              <p>
                Unsere Tarife wurden von Experten entwickelt, die Tiergesundheit wirklich verstehen. Unser Team vereint
                erfahrene Versicherungsspezialisten mit ehemaligen Tierarzthelfer:innen – für optimalen Schutz bei
                Operationen, Diagnostik und chronischen Erkrankungen.
              </p>
              <p>
                Klare Kommunikation, schnelle Leistungsabwicklung und eine langfristige Kundenbeziehung sind für uns
                selbstverständlich. Ob Jungtier oder Senior, groß oder klein – wir versichern dein Tier zuverlässig genau
                dann, wenn es am wichtigsten ist.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={180}>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
            <img src={`${ASSET_BASE}/images/about.webp`} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
