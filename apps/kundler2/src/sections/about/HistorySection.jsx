const DEFAULT_STATS = [
  { value: "125+", label: "Millionen Kunden" },
  { value: "70+", label: "Länder" },
  { value: "150k", label: "Mitarbeiter" },
  { value: "Top 1", label: "Versicherungsmarke" },
];

const DEFAULT_POINTS = [
  {
    icon: "history_edu",
    title: "Gründungserbe",
    body: "Sicherheit als Fundament seit 1890.",
  },
  {
    icon: "rocket_launch",
    title: "Zukunftsvision 2026",
    body: "Digitalisierung zum Wohle unserer Kunden.",
  },
];

function StatCard({ value, label }) {
  return (
    <div className="bg-white/10 p-8 rounded-2xl flex flex-col justify-between h-48 border border-white/10">
      <span className="text-4xl font-bold text-primary">{value}</span>
      <span className="text-sm font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export default function HistorySection({
  eyebrow = "Tradition & Innovation",
  headline = "Allianz 2000–2026",
  body = "Seit über 130 Jahren stehen wir für Stabilität. Doch wir ruhen uns nicht auf dem Erreichten aus. In der Ära von 2000 bis heute haben wir uns zum führenden digitalen Versicherer transformiert, ohne unsere Wurzeln zu vergessen. Wir bauen Brücken in die Zukunft – für die nächsten 100 Jahre.",
  stats = DEFAULT_STATS,
  points = DEFAULT_POINTS,
}) {
  return (
    <section className="bg-[#003781] text-white py-24">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">{eyebrow}</h2>

            <h3 className="text-5xl font-black text-primary mb-8 leading-tight">
              {headline}
            </h3>

            <p className="text-lg text-white/90 mb-10 leading-relaxed">
              {body}
            </p>

            <div className="space-y-6">
              {(points || []).map((point) => (
                <div key={point.title} className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary mt-1">
                    {point.icon}
                  </span>
                  <div>
                    <h5 className="font-bold">{point.title}</h5>
                    <p className="text-sm text-white/70">{point.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(stats || []).map((stat) => (
              <StatCard
                key={`${stat.value}-${stat.label}`}
                value={stat.value}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}