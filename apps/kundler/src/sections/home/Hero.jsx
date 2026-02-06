export default function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[680px] overflow-hidden bg-black">
      {/* Desktop video */}
      <video
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/allianz-kundler-versicherung-berlin-goldelse-logo.webp"
      >
        <source
          src="/media/allianz-kundler-imagevideo-short-muted-4k.webm"
          type="video/webm"
        />
      </video>

      {/* Mobile image fallback */}
      <div className="absolute inset-0 md:hidden">
        <img
          src="/images/allianz-kundler-versicherung-berlin-goldelse-logo-1024x576.webp"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/80" />

      {/* Top micro nav (optional, not header) */}
      <div className="absolute left-0 right-0 top-0 z-10 px-5 pt-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-white/80 text-xs tracking-widest uppercase">
          <div className="flex items-center gap-6">
            <span className="opacity-80">Kundler</span>
            <span className="hidden sm:inline opacity-70">Berlin</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="opacity-70">Allianz</span>
            <span className="opacity-70">Versicherung</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-end px-5 pb-16">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-xl">
            <div className="text-white/70 text-[11px] uppercase tracking-[0.25em]">
              allianz versicherung berlin
            </div>
            <h1 className="mt-3 text-white text-4xl md:text-6xl font-semibold leading-[1.05]">
              Die Gegenwart wartet nicht.
            </h1>
            <p className="mt-5 text-white/80 text-lg md:text-xl">
              Große Pläne brauchen einen verlässlichen Partner.
            </p>
          </div>

          {/* Rating bar */}
          <div className="mt-12 flex items-center justify-start">
            <div className="rounded-full bg-white/10 backdrop-blur px-5 py-3 text-white/90 text-sm">
              <span className="font-semibold">5.0</span>{" "}
              <span className="ml-2">★★★★★</span>
              <span className="ml-3 text-white/70">400+ Google-Rezensionen</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
