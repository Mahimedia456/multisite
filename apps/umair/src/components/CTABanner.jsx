export default function CTABanner() {
  return (
    <section className="bg-primary py-20">
      <div className="max-w-[1200px] mx-auto px-6 text-center text-white">
        <h2 className="text-4xl font-bold mb-6 italic">"Plan Today. Protect Tomorrow."</h2>
        <p className="text-lg opacity-70 mb-10 max-w-2xl mx-auto">
          Join over 2 million families who trust us with their financial legacy. Get your free,
          no-obligation quote in minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-accent text-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors">
            Get Your Free Quote
          </button>
          <button className="bg-white/10 border border-white/20 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors">
            Find an Agent
          </button>
        </div>
      </div>
    </section>
  );
}
