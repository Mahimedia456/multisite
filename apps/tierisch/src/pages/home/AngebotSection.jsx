import React from "react";
import Reveal from "../../components/Reveal";
import SectionShell from "../../components/ui/SectionShell";
import PillDivider from "../../components/ui/PillDivider";
import Card from "../../components/ui/Card";

export default function AngebotSection() {
  return (
    <SectionShell id="Angebot" className="py-14">
      <Reveal>
        <h2 className="text-center text-2xl font-black text-slate-900">Holen Sie sich ein Angebot</h2>
      </Reveal>

      <PillDivider />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Reveal>
          <Card className="p-6">
            <form className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-1">
                <label className="text-xs font-bold text-slate-700">Vorname</label>
                <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#00938F]" />
              </div>

              <div className="md:col-span-1">
                <label className="text-xs font-bold text-slate-700">Nachname</label>
                <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#00938F]" />
              </div>

              <div className="md:col-span-1">
                <label className="text-xs font-bold text-slate-700">E-Mail</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#00938F]"
                />
              </div>

              <div className="md:col-span-1">
                <label className="text-xs font-bold text-slate-700">Telefon</label>
                <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#00938F]" />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700">Tierart</label>
                <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#00938F]">
                  <option>Hund</option>
                  <option>Katze</option>
                  <option>Pferd</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700">Nachricht</label>
                <textarea
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#00938F]"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="button"
                  className="w-full rounded-xl bg-[#00938F] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(0,147,143,0.25)] transition hover:-translate-y-0.5"
                >
                  Angebot anfordern
                </button>
              </div>
            </form>
          </Card>
        </Reveal>

        <Reveal delay={120}>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
            <iframe
              title="map"
              src="https://maps.google.com/maps?q=Vollbrecht%20und%20Greulich%3F%20Offheimer%20Weg%2036%2065549%20Limburg&t=m&z=10&output=embed&iwloc=near"
              className="h-[420px] w-full"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
