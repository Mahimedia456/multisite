export default function Zusatzbausteine({
  id = "zusatzbausteine",
  title = "Individuelle Zusatzbausteine",
  subtitle = "Erweitern Sie Ihren Schutz ganz nach Bedarf.",
  items = [
    { icon: "settings_suggest", title: "BonusDrive", body: "Bis zu 30% sparen durch umsichtiges Fahren." },
    { icon: "lock_reset", title: "RabattSchutz", body: "Ein Schaden pro Jahr ohne Rückstufung." },
    { icon: "medical_services", title: "FahrerSchutz", body: "Finanzielle Absicherung bei Eigenunfällen." },
    { icon: "sos", title: "Schutzbrief", body: "Pannenhilfe und Abschleppen rund um die Uhr." },
    { icon: "gavel", title: "Rechtsschutz", body: "Unterstützung bei Rechtsstreitigkeiten im Verkehr." },
    { icon: "minor_crash", title: "WerkstattBonus", body: "20% Beitragsnachlass bei Kaskoversicherung." },
    { icon: "ev_station", title: "Elektro-Schutz", body: "Spezialschutz für Akku und Ladezubehör." },
    { icon: "flight_takeoff", title: "AuslandsSchutz", body: "Hilfe nach deutschen Standards bei Unfällen im Ausland." }
  ]
}) {
  return (
    <section className="py-24 bg-[#f5f8f8]" id={id}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-slate-600">{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((m, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-all text-center"
            >
              <span className="material-symbols-outlined text-primary text-3xl mb-4">
                {m.icon}
              </span>
              <h4 className="font-bold mb-2">{m.title}</h4>
              <p className="text-xs text-slate-500">{m.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
