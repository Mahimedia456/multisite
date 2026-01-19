const IMAGES = {
  hero: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=1200&q=80",
  avatar1: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
  avatar2: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  avatar3: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
};

export default function Hero() {
  return (
    <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-yellow/25 text-yellow-700 text-[10px] font-extrabold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-accent-yellow" />
              #1 Rated Pet Insurance
            </div>

            <h1 className="mt-5 text-[38px] leading-[1.05] sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
              Protection for your{" "}
              <span className="text-primary">furry</span> family members.
            </h1>

            <p className="mt-5 text-sm sm:text-base text-gray-500 max-w-xl mx-auto lg:mx-0">
              Simple, comprehensive coverage for dogs and cats. We treat your pets like family because they are family.
              Get up to 90% back on vet bills.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start">
              <button className="h-10 px-5 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-lg shadow-primary/20 transition-colors inline-flex items-center gap-2">
                Start My Quote <span className="text-sm">→</span>
              </button>

              <button className="h-10 px-5 rounded-full bg-white border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
                <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px]">
                  ▶
                </span>
                Watch Video
              </button>
            </div>

            <div className="mt-7 flex items-center justify-center lg:justify-start gap-6">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src={IMAGES.avatar1} alt="" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src={IMAGES.avatar2} alt="" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src={IMAGES.avatar3} alt="" />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[10px] font-extrabold">
                  +2k
                </div>
              </div>

              <div className="text-[11px] text-gray-500">
                Trusted by <br />
                <span className="font-extrabold text-gray-900">2,000+ Pet Parents</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-soft">
              <img src={IMAGES.hero} alt="" className="w-full h-[420px] lg:h-[460px] object-cover" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm">
                  ✓
                </div>
                <div className="flex-1">
                  <div className="text-[9px] uppercase tracking-wide text-gray-400 font-bold">Claim Status</div>
                  <div className="text-xs font-extrabold text-gray-900">Reimbursed in 2 days</div>
                </div>
                <div className="text-xs font-extrabold text-green-600">+$342.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
