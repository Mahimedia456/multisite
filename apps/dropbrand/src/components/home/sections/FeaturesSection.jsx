const features = [
  "Transparent and easy to understand",
  "Fast and smooth claims process",
  "Secure and reliable service",
];

export default function FeaturesSection() {
  return (
    <section className="bg-primary-dark py-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8">
          <h3 className="text-2xl font-black">Expert Advisor Support</h3>
          <p className="mt-4 text-white/70">
            Our experienced insurance advisors are available to help compare plans and manage coverage.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Policy Management", "Claims Support", "Corporate Insurance", "Flexible Coverage"].map((x) => (
              <div key={x} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold">
                {x}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-widest text-accent">Core features</p>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Key features that set our service apart
          </h2>

          <div className="mt-8 space-y-4">
            {features.map((x, i) => (
              <div key={x} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-black">{i + 1}. {x}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Built for simple decisions, smooth support, and long-term confidence.
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-5">
            <div>
              <div className="text-5xl font-black text-accent">98%</div>
              <p className="mt-2 text-sm text-white/60">Support satisfaction</p>
            </div>
            <div>
              <div className="text-5xl font-black text-accent">500+</div>
              <p className="mt-2 text-sm text-white/60">Claim resolutions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}