export default function Hero() {
  return (
    <section
      className="rounded-3xl min-h-[520px] flex flex-col items-center justify-center text-center p-8 overflow-hidden relative"
      style={{
        backgroundImage:
          'linear-gradient(rgba(247,245,248,0.8), rgba(247,245,248,0.8)), url("https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-3xl space-y-6 relative z-10">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
          Built on trust.
          <br />
          <span className="text-primary">Focused on what matters.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium">
          Experience premium insurance solutions tailored for your modern family
          life and the companions that make it whole.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all">
            View Our Brands
          </button>
          <button className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-8 py-4 rounded-xl text-lg font-bold hover:bg-white dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}
