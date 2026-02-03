import { HOME_IMAGES } from "../../data/homeImages";

const services = [
  {
    n: "01",
    title: "Design & Build",
    desc: "Integrated planning, architecture, and execution for fast delivery.",
    img: HOME_IMAGES.service1,
  },
  {
    n: "02",
    title: "Architecture",
    desc: "Modern, functional design tailored to the needs of each project.",
    img: HOME_IMAGES.service2,
  },
  {
    n: "03",
    title: "Renovation",
    desc: "Upgrade and transform spaces with high-quality finishes.",
    img: HOME_IMAGES.service3,
  },
  {
    n: "04",
    title: "Project Management",
    desc: "Reliable timelines, clear updates, and quality control throughout.",
    img: HOME_IMAGES.service4,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400">
              Services
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">
              Logistics services designed for global business success
            </h2>
            <p className="mt-2 text-sm text-gray-500 max-w-2xl">
              We deliver reliable construction services with modern processes and premium execution.
            </p>
          </div>

          <a
            href="/quote"
            className="hidden sm:inline-flex h-10 px-5 rounded-xl bg-[#f4c300] text-black font-extrabold text-xs items-center justify-center hover:opacity-90 transition"
          >
            Explore Services
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border bg-white shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <div className="h-36 bg-gray-100">
                <img src={s.img} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-black text-white text-[10px] font-extrabold flex items-center justify-center">
                    {s.n}
                  </div>
                  <h3 className="font-extrabold text-gray-900">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm text-gray-500">{s.desc}</p>

                <a
                  href="/about"
                  className="mt-4 inline-flex h-9 px-4 rounded-xl bg-[#f4c300] text-black text-[11px] font-extrabold items-center justify-center hover:opacity-90 transition"
                >
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
