export default function AboutFI() {
  return (
    <section id="ueber" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-stretch">
          
          {/* LEFT CONTENT */}
          <div className="flex flex-col">
            <p className="text-[11px] font-semibold tracking-[0.30em] text-zinc-400">
              Über uns
            </p>

            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl">
              Über Frankfurt Intern e.V.
            </h2>

            <p className="mt-3 text-sm font-bold text-zinc-900">
              Frankfurt Intern e.V. – Die Stimme der erfolgreichsten Allianz-Agenturen
            </p>

            <div className="mt-6 space-y-4 text-sm leading-7 text-zinc-600">
              <p>
                2014 gegründet, vereinen wir heute über 100 Spitzenagenturen mit
                Unternehmergeist und klarer Ausrichtung auf die Zukunft.
                Gemeinsam verschaffen wir den Leistungsträgern im Allianz-Konzern
                den Raum, den sie verdienen – auf Augenhöhe mit dem Management.
              </p>
              <p>
                Unsere Themen sind die Themen der Besten: Nachfolge,
                Digitalisierung, Transformation und die Zukunft der
                Ausschließlichkeitsagentur. Wir sichern Rahmenbedingungen,
                schaffen Spielräume für Wachstum und entwickeln Lösungen, die
                tragen – wie das Joint Venture Advania.
              </p>
              <p>
                Denn allein wird man schnell überhört. Gemeinsam geben wir der
                Spitze des AO-Vertriebs Gewicht und gestalten die Allianz von
                morgen mit.
              </p>
            </div>
          </div>

          {/* RIGHT IMAGES – SAME HEIGHT AS LEFT */}
          <div className="grid h-full grid-cols-2 grid-rows-2 gap-4">
            
            {/* BIG IMAGE (LEFT, FULL HEIGHT) */}
            <div className="row-span-2 overflow-hidden rounded-2xl ring-1 ring-black/5">
              <img
                src="https://cdn.prod.website-files.com/68b990e52313551822599693/68f246cf495b39b0caef063e_fi-vorstand.jpg"
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            {/* TOP RIGHT IMAGE */}
            <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
              <img
                src="https://cdn.prod.website-files.com/68b990e52313551822599693/68ecf6c1431234be64539aef_FI%20Event%20-%20065.JPG"
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            {/* BOTTOM RIGHT IMAGE */}
            <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
              <img
                src="https://cdn.prod.website-files.com/68b990e52313551822599693/68ecf7cc945e5b3131ea78ea_FI%20Event%20-%20023.JPG"
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
