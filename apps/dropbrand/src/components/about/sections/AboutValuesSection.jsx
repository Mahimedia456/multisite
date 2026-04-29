export default function AboutValuesSection({
  eyebrow = "Unsere Werte",
  headline = "Wofür wir jeden Tag arbeiten",
  items = [
    {
      title: "Transparenz",
      desc: "Wir erklären Policen verständlich und ohne unnötige Komplexität.",
    },
    {
      title: "Verlässlichkeit",
      desc: "Wir begleiten Kunden langfristig – besonders dann, wenn es wichtig wird.",
    },
    {
      title: "Persönliche Beratung",
      desc: "Jede Empfehlung orientiert sich an realen Bedürfnissen und Zielen.",
    },
  ],
}) {
  return (
    <section className="bg-background-light px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-primary">
            {eyebrow}
          </div>

          <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-6xl">
            {headline}
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-[2rem] bg-white p-8 shadow-soft transition hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <div className="mb-8 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-xl font-black text-white">
                {idx + 1}
              </div>

              <h3 className="text-2xl font-black text-slate-950">
                {item.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}