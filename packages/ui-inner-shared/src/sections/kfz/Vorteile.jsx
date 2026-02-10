export default function Vorteile({
  id = "vorteile",
  title = "Warum die Allianz?",
  subtitle = "Verlassen Sie sich auf ausgezeichneten Service und schnelle Hilfe.",
  cards = [
    {
      icon: "shield",
      title: "Werterhalt (Value Retention)",
      body: "Optimaler Schutz für den Wiederverkaufswert Ihres Fahrzeugs durch Reparatur in zertifizierten Fachwerkstätten."
    },
    {
      icon: "speed",
      title: "5-Tage Schadensregulierung",
      body: "Schnell und unbürokratisch. Wir garantieren die Bearbeitung Ihres Kaskoschadens innerhalb von nur 5 Arbeitstagen."
    },
    {
      icon: "car_rental",
      title: "Carsharing Schutz",
      body: "Zusätzliche Sicherheit auch wenn Sie fremde Fahrzeuge nutzen oder Ihr eigenes Auto teilen."
    }
  ]
}) {
  return (
    <section className="py-24 bg-white" id={id}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-slate-600">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((c, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-[#f5f8f8] border border-slate-100 hover:border-primary/50 transition-all group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined">{c.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{c.title}</h3>
              <p className="text-slate-600">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
