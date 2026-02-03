import { HOME_IMAGES } from "../../data/homeImages";

const items = [
  {
    title: "A showcase of architecture that inspires and endures",
    a: HOME_IMAGES.project1,
    b: HOME_IMAGES.project2,
    c: HOME_IMAGES.project3,
  },
];

export default function Showcase() {
  const x = items[0];

  return (
    <section className="py-16 bg-white" id="projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-black/60">
              Projects
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">{x.title}</h2>
          </div>
          <button className="hidden sm:inline-flex h-10 px-5 rounded-xl bg-[#f5c400] text-black font-extrabold text-sm hover:opacity-90">
            View All
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[x.a, x.b, x.c].map((src, i) => (
            <div key={`${src}-${i}`} className="rounded-[2.2rem] overflow-hidden border border-black/5 shadow-sm">
              <img src={src} alt="" className="w-full h-64 object-cover" />
              <div className="p-6">
                <div className="text-sm font-extrabold">Project {i + 1}</div>
                <div className="mt-1 text-sm text-black/60">
                  Modern build with clean finish and bold geometry.
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
