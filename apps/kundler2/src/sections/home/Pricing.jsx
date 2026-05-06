import Reveal from "../../components/Reveal";
import Stagger from "../../components/Stagger";

const defaultPlans = [
  { name: "Basis", price: "ab 1,60 %", desc: "Kurzfristig und sicher parken." },
  { name: "Empfehlung", price: "Premium", desc: "Sofortleistung ohne Wartezeit.", highlight: true },
  { name: "Individuell", price: "Beratung", desc: "Passende Lösungen für Ihre Situation." },
];

export default function Pricing({
  eyebrow = "Angebote im Überblick",
  headline = "Empfehlungen & Highlights",
  subheading = "Transparent, verständlich und passend zu Ihrem Bedarf.",
  plans = defaultPlans,
}) {
  return (
    <section className="py-16 bg-background-dark text-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Reveal>
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-white/60">
              {eyebrow}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">
              {headline}
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-3 text-sm text-white/70 max-w-2xl mx-auto">
              {subheading}
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6" from={120} step={90}>
          {(plans || []).map((p) => (
            <div
              key={p.name}
              className={[
                "rounded-[2.2rem] border p-7 shadow-sm",
                p.highlight
                  ? "bg-primary text-text-dark border-primary"
                  : "bg-white/5 text-white border-white/10",
              ].join(" ")}
            >
              <div className="text-sm font-extrabold">{p.name}</div>
              <div className="mt-3 text-3xl font-extrabold">{p.price}</div>
              <div className="mt-2 text-sm opacity-80">{p.desc}</div>

              <button
                className={[
                  "mt-7 h-11 w-full rounded-xl font-extrabold text-sm",
                  p.highlight ? "bg-background-dark text-white" : "bg-primary text-text-dark",
                ].join(" ")}
              >
                Mehr erfahren
              </button>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}