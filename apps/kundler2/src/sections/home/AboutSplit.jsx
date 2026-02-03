import { HOME_IMAGES } from "../../data/homeImages";

const bullets = [
  { title: "Precision Contracts", body: "Clear scope, clean terms, no hidden costs." },
  { title: "Trusted Partnerships", body: "Dedicated team with consistent project updates." },
  { title: "Worksite Safety", body: "Processes built around safety and compliance." },
];

export default function AboutSplit() {
  return (
    <section className="py-16 bg-[#f6f7f8]" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-black/60">
              About us
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold leading-tight">
              Blending architecture engineering and artistry to create timeless spaces
            </h2>
            <p className="mt-3 text-sm text-black/60 max-w-xl">
              We deliver modern builds with robust systems, quality materials, and a clear process from start to finish.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {bullets.map((b) => (
                <div key={b.title} className="rounded-2xl bg-white border border-black/5 p-6 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-extrabold">
                    ✓
                  </div>
                  <div className="mt-4 font-extrabold">{b.title}</div>
                  <div className="mt-1 text-sm text-black/60">{b.body}</div>
                </div>
              ))}
            </div>

            <button className="mt-8 h-11 px-6 rounded-xl bg-[#f5c400] text-black font-extrabold text-sm hover:opacity-90">
              Learn About Us
            </button>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-[2.2rem] overflow-hidden border border-black/5 shadow-sm bg-white">
              <img src={HOME_IMAGES.aboutRight} alt="" className="w-full h-[420px] object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
