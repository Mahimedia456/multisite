export default function BottomCTA() {
  return (
    <section className="py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-primary rounded-[2.5rem] px-8 py-12 sm:px-12 sm:py-14 shadow-soft relative overflow-hidden">
          <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-black/10 blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="text-white">
              <div className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Ready to protect your pet?
              </div>
              <div className="mt-2 text-sm sm:text-base text-white/85">
                Get a customized quote in less than 2 minutes. No commitment required.
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <button className="h-10 px-6 rounded-full bg-white text-primary hover:bg-gray-50 font-extrabold text-sm shadow-lg transition-colors">
                See Your Price
              </button>
              <div className="text-[11px] text-white/80 font-semibold">Starting at $25/mo</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
