const services = [
  {
    title: "Privatversicherung",
    subtitle: "Sicher durch den Alltag gehen",
    img: "/images/beratung-moderne-allianz-kundler-agentur.webp",
  },
  {
    title: "Gewerbeversicherung",
    subtitle: "Premium Schutz für Ihr Business",
    img: "/images/david-patrick-kundler-inhaber-beratung.webp",
  },
  {
    title: "Baufinanzierung",
    subtitle: "Der Grundstein für Ihr Zuhause",
    img: "/images/teammeeting-allianz-kundler-filiale-berlin.webp",
  },
];

export default function Services() {
  return (
    <section className="pb-24">
      <div className="flex overflow-x-auto gap-6 px-5 no-scrollbar">
        {services.map((s, i) => (
          <div
            key={i}
            className="min-w-[320px] md:min-w-[520px] bg-neutral-100 rounded-2xl overflow-hidden group"
          >
            <div className="grid md:grid-cols-2 h-full">
              <div className="p-8 flex flex-col justify-center">
                <p className="uppercase text-xs tracking-widest text-neutral-500">
                  {s.title}
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  {s.subtitle}
                </h3>
                <span className="mt-6 text-orange-500 font-medium">
                  Mehr erfahren →
                </span>
              </div>
              <img
                src={s.img}
                className="h-full w-full object-cover group-hover:scale-105 transition"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
