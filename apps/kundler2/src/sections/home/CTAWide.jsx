import { HOME_IMAGES } from "../../data/homeImages";

export default function CTAWide() {
  return (
    <section className="relative py-16 bg-black">
      <div className="absolute inset-0">
        <img src={HOME_IMAGES.ctaBg} alt="" className="w-full h-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-10 sm:p-12 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-white/60">
              Let’s build together
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-extrabold">
              Partner with us to design and build the future you envision
            </div>
            <div className="mt-2 text-sm text-white/70 max-w-2xl">
              Clear scope, strong delivery, and craftsmanship you can measure.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="h-11 px-6 rounded-xl bg-[#f5c400] text-black font-extrabold text-sm hover:opacity-90">
              Book a Call
            </button>
            <button className="h-11 px-6 rounded-xl bg-white/10 border border-white/15 text-white font-extrabold text-sm hover:bg-white/15">
              View Portfolio
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
