import MIcon from "../../MIcon";

export default function KundlerHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Top strip */}
      <div className="absolute inset-x-0 top-0 h-64 bg-[linear-gradient(180deg,rgba(var(--primary),0.12),rgba(255,255,255,0))] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-700">
                Allianz Versicherung • Privatkunden (Demo)
              </span>
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 leading-tight">
              Die kalte Jahreszeit genießen –{" "}
              <span className="text-primary">mit starker Absicherung</span> an Ihrer Seite.
            </h1>

            <p className="mt-5 text-zinc-600 text-base sm:text-lg max-w-2xl">
              Empfehlungen, Services und persönliche Beratung – damit Sie im Alltag
              und in besonderen Momenten gut vorbereitet sind.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#support"
                className="bg-primary hover:bg-primary-dark text-zinc-900 px-6 py-3 rounded-full font-extrabold inline-flex items-center justify-center shadow-primary/20 transition"
              >
                Ansprechpartner:in vor Ort finden
                <MIcon name="arrow_forward" className="ml-2 text-[20px]" />
              </a>

              <a
                href="#plans"
                className="px-6 py-3 rounded-full font-extrabold border border-zinc-200 bg-white hover:bg-zinc-50 inline-flex items-center justify-center transition text-zinc-800"
              >
                Meine Allianz • Anmelden
              </a>
            </div>
          </div>

          {/* Right card */}
          <div className="relative">
            <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                <div className="font-extrabold text-zinc-900">Schnellzugriff</div>
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                  Kundler2 Brand
                </div>
              </div>

              <div className="p-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MIcon name="report" className="text-primary text-[20px]" />
                    </span>
                    <div className="font-extrabold text-zinc-900">24/7</div>
                  </div>
                  <div className="mt-2 text-sm text-zinc-600">Schaden melden</div>
                </div>

                <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MIcon name="support_agent" className="text-primary text-[20px]" />
                    </span>
                    <div className="font-extrabold text-zinc-900">Mo–Fr</div>
                  </div>
                  <div className="mt-2 text-sm text-zinc-600">Beratung 8–20 Uhr</div>
                </div>

                <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MIcon name="workspace_premium" className="text-primary text-[20px]" />
                    </span>
                    <div className="font-extrabold text-zinc-900">Top</div>
                  </div>
                  <div className="mt-2 text-sm text-zinc-600">Online-Antrag</div>
                </div>

                <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MIcon name="search" className="text-primary text-[20px]" />
                    </span>
                    <div className="font-extrabold text-zinc-900">Finden</div>
                  </div>
                  <div className="mt-2 text-sm text-zinc-600">Produkte & Beratung</div>
                </div>
              </div>
            </div>

            <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
