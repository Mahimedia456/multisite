import { Play } from "lucide-react";

export default function VideoStorySection({
  eyebrow = "Unsere Geschichte",
  headline = "Entdecken Sie die Geschichte hinter unserem Schutzversprechen",
  image = "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600",
  marquee = [
    "Lebensversicherung",
    "Schnelle Schäden",
    "Transparente Policen",
    "24/7 Support",
    "Verlässlicher Schutz",
    "Krankenversicherung",
  ],
}) {
  return (
    <section className="relative overflow-hidden bg-primary-dark py-28 text-white">
      <div className="absolute inset-0 opacity-30">
        <img src={image} className="h-full w-full object-cover" alt="" />
      </div>

      <div className="absolute inset-0 bg-primary-dark/80" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-accent">
          {eyebrow}
        </p>

        <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
          {headline}
        </h2>

        <button className="mx-auto mt-10 grid h-20 w-20 place-items-center rounded-full bg-accent text-primary-dark shadow-2xl">
          <Play fill="currentColor" />
        </button>
      </div>

      <div className="relative mt-20 overflow-hidden border-y border-white/10 bg-white/5 py-5">
        <div className="flex animate-[marquee_28s_linear_infinite] gap-10 whitespace-nowrap text-sm font-black text-white/80">
          {[...marquee, ...marquee].map((x, i) => (
            <span key={`${x}-${i}`}>✦ {x}</span>
          ))}
        </div>
      </div>
    </section>
  );
}