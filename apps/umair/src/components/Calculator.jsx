export default function Calculator() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-20">
      <div className="bg-primary text-white rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
        <div className="flex-1 p-10 md:p-16 border-r border-white/10">
          <h2 className="text-3xl font-bold mb-4">Coverage Calculator</h2>
          <p className="text-white/60 mb-10">
            Get a quick estimate of how much coverage your family might need based on your
            financial profile.
          </p>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold uppercase tracking-wider opacity-80">
                  Annual Income
                </label>
                <span className="text-accent font-bold">$75,000</span>
              </div>
              <input
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                type="range"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold uppercase tracking-wider opacity-80">
                  Number of Dependents
                </label>
                <span className="text-accent font-bold">2</span>
              </div>
              <div className="flex gap-4">
                <button className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  1
                </button>
                <button className="w-12 h-12 rounded-lg bg-accent text-primary font-bold flex items-center justify-center">
                  2
                </button>
                <button className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  3
                </button>
                <button className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  4+
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold uppercase tracking-wider opacity-80">
                  Mortgage &amp; Debt
                </label>
                <span className="text-accent font-bold">$250,000</span>
              </div>
              <input
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                type="range"
              />
            </div>
          </div>
        </div>

        <div className="lg:w-[400px] bg-white/5 p-10 md:p-16 flex flex-col justify-center items-center text-center">
          <p className="text-white/60 text-sm font-medium mb-2 uppercase tracking-widest">
            Recommended Coverage
          </p>
          <div className="text-5xl md:text-6xl font-black text-white mb-6">$1,250,000</div>
          <div className="w-full h-[1px] bg-white/10 mb-8"></div>

          <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-between text-sm">
              <span className="opacity-60">Estimated Premium</span>
              <span className="font-bold">$42/month</span>
            </div>

            <button className="bg-accent text-primary w-full py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-accent/20 transition-all mt-4">
              Get Official Quote
            </button>

            <p className="text-[10px] opacity-40 italic mt-4">
              Estimates are based on average health profiles. Final pricing requires a medical assessment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
