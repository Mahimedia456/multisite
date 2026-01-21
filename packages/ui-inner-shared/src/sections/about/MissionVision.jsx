// apps/aamir/src/sections/about/MissionValues.jsx
export default function MissionValues({
  missionTitle = "Our Mission",
  missionBody,
  stats = [],
  valuesTitle = "Our Values",
  values = [],
}) {
  return (
    <section className="py-24 md:py-32 bg-white dark:bg-surface-dark rounded-3xl">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start px-6">
        <div>
          <h2 className="text-4xl font-bold text-text-main dark:text-white mb-8">{missionTitle}</h2>
          <p className="text-xl text-text-muted mb-12 leading-relaxed">{missionBody}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((s, i) => (
              <div
                key={i}
                className={[
                  "p-8 rounded-3xl border shadow-soft",
                  s.variant === "secondary"
                    ? "bg-secondary/5 border-secondary/10"
                    : "bg-primary/5 border-primary/10",
                ].join(" ")}
              >
                <p className={["text-4xl font-extrabold mb-2", s.variant === "secondary" ? "text-secondary" : "text-primary"].join(" ")}>
                  {s.value}
                </p>
                <p className="text-base text-text-muted font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:pl-8">
          <h2 className="text-4xl font-bold text-text-main dark:text-white mb-8">{valuesTitle}</h2>

          <div className="space-y-10">
            {values.map((v, i) => (
              <div key={i} className="flex gap-6">
                <div
                  className={[
                    "flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center",
                    v.variant === "secondary"
                      ? "bg-secondary/10 text-secondary"
                      : "bg-primary/10 text-primary",
                  ].join(" ")}
                >
                  <span className="material-symbols-outlined text-2xl">{v.icon}</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">{v.title}</h3>
                  <p className="text-text-muted leading-relaxed">{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
