export default function Hero({ tenant }) {
  const hero = tenant?.about?.hero || {};

  return (
    <section
      className="rounded-3xl min-h-[520px] flex flex-col items-center justify-center text-center p-8 relative"
      style={{
        backgroundImage:
          hero.background ||
          'linear-gradient(rgba(247,245,248,0.8), rgba(247,245,248,0.8)), url("https://images.unsplash.com/photo-1557804506-669a67965ba0")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl md:text-7xl font-black">
          {hero.title || "Built on trust."}
          <br />
          <span className="text-primary">
            {hero.highlight || "Focused on what matters."}
          </span>
        </h1>

        <p className="text-lg text-slate-600">
          {hero.subtitle ||
            "Experience premium insurance solutions tailored for your family."}
        </p>
      </div>
    </section>
  );
}
