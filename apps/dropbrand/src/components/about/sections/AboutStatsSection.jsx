export default function AboutStatsSection({
  eyebrow = "Unsere Wirkung",
  headline = "Zahlen, die Vertrauen zeigen",
  stats = [
    { value: "10k+", label: "Beratene Kunden" },
    { value: "98%", label: "Zufriedenheit" },
    { value: "500+", label: "Gelöste Schadenfälle" },
    { value: "15+", label: "Jahre Erfahrung" },
  ],
}) {
  return (
    <section className="bg-primary px-6 py-24 text-white lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-accent">
            {eyebrow}
          </div>

          <h2 className="text-4xl font-black leading-tight md:text-6xl">
            {headline}
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-[2rem] border border-white/15 bg-white/10 p-8 backdrop-blur"
            >
              <div className="text-5xl font-black">{stat.value}</div>
              <div className="mt-3 text-sm font-bold text-white/75">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}