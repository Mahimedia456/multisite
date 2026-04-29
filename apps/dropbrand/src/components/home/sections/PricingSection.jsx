import { ShieldCheck } from "lucide-react";

const defaultPlans = [
  {
    name: "Basis",
    price: "49 €",
    features: ["Schnelle Bearbeitung", "Grundschutz", "E-Mail Support"],
  },
  {
    name: "Standard",
    price: "89 €",
    hot: true,
    features: ["Priorisierte Schäden", "Berater-Support", "Fahrzeug-Zusatz"],
  },
  {
    name: "Premium",
    price: "149 €",
    features: ["Vollschutz", "24/7 Support", "Business-Schutz"],
  },
];

export default function PricingSection({
  eyebrow = "Tarife",
  headline = "Bezahlbarer Schutz, der zu Ihnen passt",
  subheading = "Klare Tarife, verständliche Leistungen und flexible Optionen.",
  plans = defaultPlans,
  buttonLabel = "Starten",
}) {
  return (
    <section className="bg-background-light py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-widest text-primary">
            {eyebrow}
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">{headline}</h2>

          <p className="mt-5 text-slate-600">{subheading}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={[
                "rounded-[2rem] p-7 shadow-sm",
                p.hot ? "bg-primary text-white ring-4 ring-accent/40" : "bg-white",
              ].join(" ")}
            >
              <ShieldCheck className={p.hot ? "text-accent" : "text-primary"} />

              <h3 className="mt-5 text-xl font-black">{p.name}</h3>

              <div className="mt-5 text-4xl font-black">
                {p.price}
                <span
                  className={[
                    "text-sm font-bold",
                    p.hot ? "text-white/70" : "text-slate-500",
                  ].join(" ")}
                >
                  {" "}
                  / Monat
                </span>
              </div>

              <div className="mt-7 space-y-3">
                {(p.features || []).map((f) => (
                  <p
                    key={f}
                    className={["text-sm", p.hot ? "text-white/80" : "text-slate-600"].join(" ")}
                  >
                    ✓ {f}
                  </p>
                ))}
              </div>

              <button className="mt-8 rounded-full bg-accent px-5 py-3 text-sm font-black text-primary-dark">
                {buttonLabel}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}