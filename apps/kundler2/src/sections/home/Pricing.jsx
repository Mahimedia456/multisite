const plans = [
  { name: "Starter", price: "$1,999.00", desc: "Best for small upgrades & quick renovations.", highlight: false },
  { name: "Pro", price: "$2,999.00", desc: "Ideal for commercial builds & structured delivery.", highlight: true },
  { name: "Enterprise", price: "$4,999.00", desc: "Full-scale design + build with dedicated PM.", highlight: false },
];

export default function Pricing() {
  return (
    <section className="py-16 bg-[#070A0D] text-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-widest font-extrabold text-white/60">
            Pricing
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">
            Tailored solutions for every budget
          </h2>
          <p className="mt-3 text-sm text-white/70 max-w-2xl mx-auto">
            Transparent packages that match your scope. Customization available.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={[
                "rounded-[2.2rem] border p-7 shadow-sm",
                p.highlight
                  ? "bg-[#f5c400] text-black border-[#f5c400]"
                  : "bg-white/5 text-white border-white/10",
              ].join(" ")}
            >
              <div className="text-sm font-extrabold">{p.name}</div>
              <div className="mt-3 text-3xl font-extrabold">{p.price}</div>
              <div className={["mt-2 text-sm", p.highlight ? "text-black/70" : "text-white/70"].join(" ")}>
                {p.desc}
              </div>

              <ul className={["mt-6 space-y-3 text-sm", p.highlight ? "text-black/80" : "text-white/80"].join(" ")}>
                <li>• Timeline planning</li>
                <li>• Materials estimate</li>
                <li>• Dedicated support</li>
                <li>• Site supervision</li>
              </ul>

              <button
                className={[
                  "mt-7 h-11 w-full rounded-xl font-extrabold text-sm hover:opacity-90",
                  p.highlight ? "bg-black text-white" : "bg-[#f5c400] text-black",
                ].join(" ")}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
