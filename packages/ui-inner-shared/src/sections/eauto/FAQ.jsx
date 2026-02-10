function Item({ q, a }) {
  return (
    <details className="group bg-white border border-slate-200 rounded-xl">
      <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
        <span className="font-bold text-slate-900">{q}</span>
        <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
          expand_more
        </span>
      </summary>
      <div className="px-6 pb-6 text-slate-600">{a}</div>
    </details>
  );
}

export default function FAQ({
  title = "Häufige Fragen",
  items = [
    {
      q: "Ist die E-Auto Versicherung teurer?",
      a: 'Nein, oft sind E-Autos sogar günstiger einzustufen. Zusätzlich profitieren Sie bei der Allianz von speziellen E-Auto Rabatten und staatlichen Förderungen.',
    },
    {
      q: "Gibt es steuerliche Vorteile?",
      a: "Ja, reine Elektrofahrzeuge sind bei Erstzulassung bis Ende 2025 für bis zu 10 Jahre von der Kraftfahrzeugsteuer befreit.",
    },
    {
      q: "Wie wird der Akku im Schadensfall ersetzt?",
      a: 'In unseren Tarifen Komfort und Premium bieten wir einen "Neupreis-Ersatz" für den Akku bei Totalschaden innerhalb der ersten 24 bis 36 Monate.',
    },
  ],
}) {
  return (
    <section className="mb-24 max-w-3xl mx-auto">
      <h2 className="text-3xl font-black text-slate-900 text-center mb-12">
        {title}
      </h2>
      <div className="space-y-4">
        {items.map((it, i) => (
          <Item key={i} {...it} />
        ))}
      </div>
    </section>
  );
}
