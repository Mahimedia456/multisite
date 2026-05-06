import React from "react";
import Reveal from "../../components/Reveal";
import SectionShell from "../../components/ui/SectionShell";
import PillDivider from "../../components/ui/PillDivider";
import Card from "../../components/ui/Card";

export default function AngebotSection({
  title = "Holen Sie sich ein Angebot",
  mapUrl = "https://maps.google.com/maps?q=Vollbrecht%20und%20Greulich%3F%20Offheimer%20Weg%2036%2065549%20Limburg&t=m&z=10&output=embed&iwloc=near",
  animalOptions = ["Hund", "Katze", "Pferd"],
  submitLabel = "Angebot anfordern",
}) {
  const inputClass =
    "mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <SectionShell id="Angebot" className="py-14">
      <Reveal>
        <h2 className="text-center text-2xl font-black text-slate-900">
          {title}
        </h2>
      </Reveal>

      <PillDivider />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Reveal>
          <Card className="p-6">
            <form className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-slate-700">
                  Vorname
                </label>
                <input className={inputClass} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">
                  Nachname
                </label>
                <input className={inputClass} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">
                  E-Mail
                </label>
                <input type="email" className={inputClass} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">
                  Telefon
                </label>
                <input className={inputClass} />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Tierart
                </label>
                <select className={inputClass}>
                  {(animalOptions || []).map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Nachricht
                </label>
                <textarea rows={4} className={inputClass} />
              </div>

              <div className="md:col-span-2">
                <button
                  type="button"
                  className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(var(--primary),0.25)] transition hover:-translate-y-0.5"
                >
                  {submitLabel}
                </button>
              </div>
            </form>
          </Card>
        </Reveal>

        <Reveal delay={120}>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
            <iframe
              title="map"
              src={mapUrl}
              className="h-[420px] w-full"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}