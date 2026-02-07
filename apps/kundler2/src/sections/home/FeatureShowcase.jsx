import { HOME_IMAGES } from "../../data/homeImages";

const items = [
  {
    title: "Empfehlungen für Sie – schnell finden, was zu Ihnen passt",
    body: "Von Kfz bis Rechtsschutz: entdecken Sie Highlights, Vorteile und passende Optionen – transparent und verständlich.",
    left: HOME_IMAGES.featureLeft,
    right: HOME_IMAGES.featureRight,
  },
];

export default function FeatureShowcase() {
  return (
    <section className="bg-[#f6f7f8] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {items.map((x) => (
          <div key={x.title} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 rounded-3xl overflow-hidden bg-white border border-black/5 shadow-sm">
              <img src={x.left} alt="" className="w-full h-72 object-cover" />
            </div>

            <div className="lg:col-span-7 rounded-3xl bg-white border border-black/5 shadow-sm p-8 flex flex-col justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest font-extrabold text-black/60">Empfehlungen</div>
                <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold leading-tight">{x.title}</h2>
                <p className="mt-3 text-sm text-black/60 max-w-2xl">{x.body}</p>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button className="h-10 px-5 rounded-xl bg-black text-white font-extrabold text-sm hover:opacity-90">
                  Produkte ansehen
                </button>
                <button className="h-10 px-5 rounded-xl bg-[#f5c400] text-black font-extrabold text-sm hover:opacity-90">
                  Beratung & Kontakt
                </button>
              </div>

              <div className="mt-7 rounded-2xl overflow-hidden border border-black/5">
                <img src={x.right} alt="" className="w-full h-40 object-cover" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
