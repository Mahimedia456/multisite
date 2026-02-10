import React from "react";

function StatCard({ value, label }) {
  return (
    <div className="bg-white/10 p-8 rounded-2xl flex flex-col justify-between h-48 border border-white/10">
      <span className="text-4xl font-bold text-primary">{value}</span>
      <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function HistorySection() {
  return (
    <section className="bg-[#003781] text-white py-24">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Tradition &amp; Innovation</h2>

            <h3 className="text-5xl font-black text-primary mb-8 leading-tight">
              Allianz 2000–2026
            </h3>

            <p className="text-lg text-white/90 mb-10 leading-relaxed">
              Seit über 130 Jahren stehen wir für Stabilität. Doch wir ruhen uns nicht auf dem Erreichten aus. In der Ära
              von 2000 bis heute haben wir uns zum führenden digitalen Versicherer transformiert, ohne unsere Wurzeln zu
              vergessen. Wir bauen Brücken in die Zukunft – für die nächsten 100 Jahre.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary mt-1">history_edu</span>
                <div>
                  <h5 className="font-bold">Gründungserbe</h5>
                  <p className="text-sm text-white/70">Sicherheit als Fundament seit 1890.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary mt-1">rocket_launch</span>
                <div>
                  <h5 className="font-bold">Zukunftsvision 2026</h5>
                  <p className="text-sm text-white/70">Digitalisierung zum Wohle unserer Kunden.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard value="125+" label="Millionen Kunden" />
            <StatCard value="70+" label="Länder" />
            <StatCard value="150k" label="Mitarbeiter" />
            <StatCard value="Top 1" label="Versicherungsmarke" />
          </div>
        </div>
      </div>
    </section>
  );
}





