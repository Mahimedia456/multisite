export default function FAQ({
  title = "Häufig gestellte Fragen",
  items = [
    "Was ist die eVB-Nummer und woher bekomme ich sie?",
    "Wie kann ich meine Kilometerleistung ändern?",
    "Wann kann ich meine Versicherung wechseln?",
    "Gibt es spezielle Rabatte für Senioren?"
  ]
}) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
        </div>

        <div className="space-y-4">
          {items.map((q, i) => (
            <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
              <button className="w-full px-6 py-4 flex items-center justify-between text-left font-bold hover:bg-slate-50 transition-colors">
                <span>{q}</span>
                <span className="material-symbols-outlined text-primary">add</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
