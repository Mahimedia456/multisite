import Reveal from "../../components/Reveal";
import Stagger from "../../components/Stagger";

const defaultStats = [
  { value: "24/7", label: "Schaden melden", percent: "78%" },
  { value: "8–20", label: "Mo–Fr Beratung", percent: "78%" },
  { value: "Top", label: "Kundenzufriedenheit", percent: "78%" },
];

export default function StatsBand({
  eyebrow = "Meine Allianz & Services",
  headline = "Schnell erledigt – online oder mit persönlicher Unterstützung",
  subheading = "Adressänderung, Kontaktdaten, Services und Hilfe – damit alles reibungslos läuft.",
  buttonLabel = "Online-Services öffnen",
  buttonHref = "/services",
  stats = defaultStats,
}) {
  return (
    <section className="bg-surface-light py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] bg-background-light border border-text-dark/5 p-8 sm:p-10">
          <div className="text-center">
            <Reveal>
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-text-dark/60">
                {eyebrow}
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-text-dark">
                {headline}
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-3 text-sm text-text-dark/60 max-w-2xl mx-auto">
                {subheading}
              </p>
            </Reveal>
          </div>

          <Stagger className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6" from={140} step={90}>
            {(stats || []).map((s) => (
              <div key={`${s.value}-${s.label}`} className="rounded-3xl bg-surface-light border border-text-dark/5 p-7 shadow-sm">
                <div className="text-3xl font-extrabold text-text-dark">{s.value}</div>
                <div className="mt-1 text-[11px] font-semibold text-text-dark/60">{s.label}</div>

                <div className="mt-4 h-1.5 rounded-full bg-text-dark/5 overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: s.percent || "70%" }} />
                </div>
              </div>
            ))}
          </Stagger>

          <Reveal delay={520}>
            <div className="mt-10 flex justify-center">
              <a
                href={buttonHref}
                className="h-11 px-6 rounded-xl bg-primary text-text-dark font-extrabold text-sm hover:opacity-90 inline-flex items-center justify-center"
              >
                {buttonLabel}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}