const defaultItems = [
  {
    q: "Wie wähle ich den richtigen Tarif?",
    a: "Unsere Berater vergleichen Optionen und erklären die Leistungen verständlich.",
  },
  {
    q: "Welche Versicherungen bieten Sie an?",
    a: "Wir bieten unter anderem Lebens-, Kranken-, Fahrzeug- und Sachversicherungen.",
  },
  {
    q: "Kann ich meine Police später ändern?",
    a: "Ja, viele Tarife können flexibel angepasst werden.",
  },
];

export default function FAQSection({
  eyebrow = "FAQ",
  headline = "Häufige Fragen zu Schutz und Leistungen",
  subheading = "Hier finden Sie schnelle Antworten auf die wichtigsten Fragen.",
  items = defaultItems,
}) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-primary">
            {eyebrow}
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            {headline}
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">{subheading}</p>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <details
              key={`${item.q}-${i}`}
              className="group rounded-2xl border border-slate-200 bg-background-light p-5"
            >
              <summary className="cursor-pointer list-none font-black">
                Q{i + 1}. {item.q}
              </summary>

              <p className="mt-3 text-sm leading-6 text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}