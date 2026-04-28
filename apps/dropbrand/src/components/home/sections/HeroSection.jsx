import { ArrowRight, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-[#07361f] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,179,71,0.22),transparent_35%),linear-gradient(180deg,rgba(7,54,31,0.85),rgba(7,54,31,1))]" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/85">
              Reliable Insurance Solutions
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              Protect what matters most with trusted coverage
            </h1>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-7 backdrop-blur">
            <p className="text-lg leading-8 text-white/75">
              From health and life to vehicle and property insurance, we make it easy to find the right coverage that fits your needs and your budget.
            </p>
            <button className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#ffb347] px-6 py-3 font-black text-[#07361f] shadow-lg shadow-black/20">
              Get Free Quote <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm font-bold text-white/75">
            <span>Trusted by more than 100+ companies</span>
            {["Life Insurance", "Fast Claims", "Transparent Policies", "24/7 Support"].map((x) => (
              <span key={x} className="inline-flex items-center gap-2">
                <Star size={15} className="text-[#ffb347]" /> {x}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}