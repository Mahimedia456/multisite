import { CheckCircle2 } from "lucide-react";

const defaultItems = [
  "Transparente Preise ohne versteckte Gebühren",
  "Erfahrene Berater vom ersten Gespräch an",
  "Schnelle und einfache Schadenabwicklung",
  "Flexible Tarife passend zu Ihrem Bedarf",
];

export default function WhyChooseSection({
  eyebrow = "Warum wir",
  headline = "Erfahrene Versicherungslösung mit persönlicher Beratung",
  body = "Wir verbinden Fachwissen, transparente Policen und engagierten Support.",
  image = "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1100",
  quote = "Das Team hat jede Option verständlich erklärt und den Prozess einfach gemacht.",
  author = "Ronald Richards",
  items = defaultItems,
}) {
  return (
    <section className="bg-[#f8f4ed] py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-[#0f4a2c]">
            {eyebrow}
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">{headline}</h2>

          <p className="mt-5 text-lg leading-8 text-zinc-600">{body}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {items.map((x) => (
              <div key={x} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <CheckCircle2 className="shrink-0 text-[#ffb347]" />
                <span className="text-sm font-bold text-zinc-700">{x}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <img
            src={image}
            alt=""
            className="h-[520px] w-full rounded-[2rem] object-cover shadow-xl"
          />

          <div className="absolute bottom-6 left-6 max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
            <p className="font-bold text-zinc-800">“{quote}”</p>
            <p className="mt-3 text-sm font-black text-[#0f4a2c]">{author}</p>
          </div>
        </div>
      </div>
    </section>
  );
}