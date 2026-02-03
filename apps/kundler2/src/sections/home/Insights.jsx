import { HOME_IMAGES } from "../../data/homeImages";

const posts = [
  { title: "Construction trends shaping modern cities", img: HOME_IMAGES.insight1 },
  { title: "Concrete, geometry & future-ready facades", img: HOME_IMAGES.insight2 },
  { title: "Sustainable build practices that last", img: HOME_IMAGES.insight3 },
];

export default function Insights() {
  return (
    <section className="py-16 bg-white" id="insights">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-widest font-extrabold text-black/60">
            Insights
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">
            Ideas, innovation & inspiration from the world of architecture
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p) => (
            <article key={p.title} className="rounded-[2.2rem] overflow-hidden border border-black/5 shadow-sm">
              <img src={p.img} alt="" className="w-full h-56 object-cover" />
              <div className="p-6">
                <div className="text-[10px] uppercase tracking-widest font-extrabold text-black/60">
                  Article
                </div>
                <h3 className="mt-2 font-extrabold text-lg leading-snug">{p.title}</h3>
                <button className="mt-5 h-10 px-5 rounded-xl bg-[#f5c400] text-black font-extrabold text-sm hover:opacity-90">
                  Read More
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
