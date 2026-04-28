import { ShieldCheck } from "lucide-react";

const plans = [
  { name: "Basic Plan", price: "$49.00", features: ["Fast-track claims", "Life coverage", "Email support"] },
  { name: "Standard Plan", price: "$89.00", features: ["Priority claims", "Advisor support", "Vehicle add-on"], hot: true },
  { name: "Premium Plan", price: "$149.00", features: ["Full protection", "24/7 support", "Business coverage"] },
];

export default function PricingSection() {
  return (
    <section className="bg-background-light py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-widest text-primary">Pricing plans</p>
          <h2 className="mt-4 text-4xl font-black md:text-5xl">Affordable coverage that fits</h2>
          <p className="mt-5 text-slate-600">
            Easy-to-understand plans tailored to your needs and budget.
          </p>
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
                <span className={["text-sm font-bold", p.hot ? "text-white/70" : "text-slate-500"].join(" ")}>
                  {" "}/ Monthly
                </span>
              </div>

              <div className="mt-7 space-y-3">
                {p.features.map((f) => (
                  <p key={f} className={["text-sm", p.hot ? "text-white/80" : "text-slate-600"].join(" ")}>
                    ✓ {f}
                  </p>
                ))}
              </div>

              <button className="mt-8 rounded-full bg-accent px-5 py-3 text-sm font-black text-primary-dark">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}