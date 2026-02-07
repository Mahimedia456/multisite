export default function HeroFI() {
  return (
    <section id="content" className="relative bg-black pt-24">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=2400&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/65 to-black" />

      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-10">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
          {/* Left */}
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold tracking-[0.28em] text-white/70">
              Frankfurt Intern e.V.
            </p>

            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              Wir sind wie Du - <br />
              Allianz-Agenturen <br />
              mit Unternehmergeist.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/75">
              Frankfurt Intern e.V. ist das Netzwerk der erfolgreichsten Allianz-Agenturen Deutschlands.
              Gemeinsam denken wir weiter, hinterfragen Bestehendes und entwickeln Lösungen für die Zukunft
              unserer Branche. Hier bekommst Du direkten Zugang zu Wissen, Austausch und Einfluss – und wirst
              Teil einer Gemeinschaft, die unternehmerisch denkt und handelt.
            </p>

            <a
              href="#kontakt"
              className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-xs font-extrabold tracking-widest text-black hover:bg-white/90"
            >
              Kontakt aufnehmen
            </a>
          </div>

          {/* Right stats cards */}
          <div className="grid gap-4">
            {[
              { big: "100+", small: "Mitglieder" },
              { big: "60+", small: "Standorte" },
              { big: "110 Mio.€", small: "Umsatzvolumen" },
            ].map((s) => (
              <div
                key={s.small}
                className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur"
              >
                <div className="text-4xl font-black text-white">{s.big}</div>
                <div className="mt-2 text-sm font-semibold text-white/80">{s.small}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
