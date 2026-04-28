const services = [
  {
    title: "Life Insurance",
    desc: "Secure your family’s future with flexible life insurance plans.",
    img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=900",
  },
  {
    title: "Health Insurance",
    desc: "Get access to quality healthcare and manage medical expenses.",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=900",
  },
  {
    title: "Vehicle Insurance",
    desc: "Drive with confidence knowing your car is protected.",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#0f4a2c]">Our Services</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black md:text-5xl">
              Insurance service that keeps you protected and confident
            </h2>
          </div>
          <button className="rounded-full bg-[#ffb347] px-6 py-3 font-black text-[#07361f]">
            View All Services
          </button>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-3">
          {services.map((s) => (
            <article key={s.title} className="group overflow-hidden rounded-[2rem] bg-[#f8f4ed] shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="h-64 overflow-hidden">
                <img src={s.img} alt={s.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black">{s.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{s.desc}</p>
                <button className="mt-5 text-sm font-black text-[#0f4a2c]">Read More →</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}