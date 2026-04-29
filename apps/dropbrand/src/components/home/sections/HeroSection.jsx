import { ArrowRight, Star } from "lucide-react";

export default function HeroSection({
  badge = "Zuverlässige Versicherungslösungen",
  headline = "Schützen Sie, was wirklich zählt",
  subheading = "Von Gesundheit über Leben bis Fahrzeug und Eigentum – wir machen Versicherung einfach, transparent und passend.",
  ctaLabel = "Kostenloses Angebot",
  ctaHref = "/contact",
  trustText = "Vertraut von mehr als 100 Unternehmen",
  highlights = ["Lebensversicherung", "Schnelle Schäden", "Transparente Policen", "24/7 Support"],
}) {
  return (
    <section className="relative bg-[#07361f] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,179,71,0.22),transparent_35%),linear-gradient(180deg,rgba(7,54,31,0.85),rgba(7,54,31,1))]" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/85">
              {badge}
            </p>

            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              {headline}
            </h1>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-7 backdrop-blur">
            <p className="text-lg leading-8 text-white/75">{subheading}</p>

            <a
              href={ctaHref}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#ffb347] px-6 py-3 font-black text-[#07361f] shadow-lg shadow-black/20"
            >
              {ctaLabel} <ArrowRight size={18} />
            </a>
          </div>
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm font-bold text-white/75">
            <span>{trustText}</span>

            {highlights.map((x) => (
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