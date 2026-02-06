import React from "react";
import Reveal from "../../components/Reveal";
import SectionShell from "../../components/ui/SectionShell";
import Card from "../../components/ui/Card";
import { ASSET_BASE } from "../../components/ui/helpers";

export default function TestimonialsSection() {
  return (
    <SectionShell className="py-14">
      <div className="grid gap-8 lg:grid-cols-[0.55fr_0.45fr]">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
            <img
              src={`${ASSET_BASE}/images/Stimmen-unserer-Tierfreunde.png`}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <h2 className="text-2xl font-black text-slate-900">Stimmen unserer Tierfreunde</h2>
          </Reveal>

          <div className="mt-6 space-y-4">
            {[
              {
                text:
                  "Ich bin sehr zufrieden, wie schnell und freundlich hier reagiert wird. Keine langen Wartezeiten, jede Frage wird direkt beantwortet und ich habe nie das Gefühl, dass mir etwas aufgedrängt wird. Super Auswahl an bekannten Versicherern – absolut empfehlenswert!",
                name: "Lukas Müller",
              },
              {
                text:
                  "Sehr transparenter und ehrlicher Service. Besonders toll finde ich, dass tiermedizinische Fachleute meine Fragen beantworten können vor dem Verkauf als auch danach – das gibt ein gutes Gefühl wenn man nicht genau weiß wie man es beim Tierarzt angeht.",
                name: "Anna Schneider",
              },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <Card className="p-5">
                  <div className="text-sm leading-relaxed text-slate-700">{t.text}</div>
                  <div className="mt-4 text-sm font-black text-slate-900">
                    ⭐⭐⭐⭐⭐ <span className="font-semibold text-slate-600">— {t.name}</span>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
