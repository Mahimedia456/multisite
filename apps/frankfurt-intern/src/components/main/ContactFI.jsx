export default function ContactFI() {
  return (
    <section id="kontakt" className="bg-black">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-[11px] font-semibold tracking-[0.30em] text-white/60">
          Kontakt
        </p>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          Kontakt aufnehmen
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/65">
          Ob Fragen zur Mitgliedschaft, zu unseren Veranstaltungen oder zu aktuellen Themen – die Geschäftsstelle von
          Frankfurt Intern e.V. ist Deine erste Anlaufstelle. Nimm Kontakt auf, wir sind gerne für Dich da.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {/* left info */}
          <div className="rounded-2xl bg-white/10 p-7 ring-1 ring-white/15">
            <div className="space-y-4 text-sm text-white/80">
              <div>
                <div className="font-extrabold text-white">andrea.kaul@frankfurt-intern.de</div>
                <div className="text-white/70">Andrea Kaul</div>
              </div>
              <div className="font-extrabold text-white">+49 176 61330084</div>
              <div>
                <div className="font-extrabold text-white">Frankfurt Intern e.V.</div>
                <div className="text-white/70">Hohenzollerndamm 151, 14199 Berlin</div>
              </div>

              <button className="mt-2 rounded-full bg-white px-5 py-3 text-xs font-extrabold tracking-widest text-black hover:bg-white/90">
                Download der Satzung
              </button>
            </div>
          </div>

          {/* right purple form */}
          <div className="overflow-hidden rounded-2xl bg-purple-700 text-white shadow-[0_24px_70px_rgba(0,0,0,0.25)]">
            <div className="p-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input className="h-11 rounded-xl bg-white/10 px-4 text-sm outline-none ring-1 ring-white/15 placeholder:text-white/60" placeholder="Vorname" />
                <input className="h-11 rounded-xl bg-white/10 px-4 text-sm outline-none ring-1 ring-white/15 placeholder:text-white/60" placeholder="Nachname" />
                <input className="h-11 rounded-xl bg-white/10 px-4 text-sm outline-none ring-1 ring-white/15 placeholder:text-white/60" placeholder="Email" />
                <input className="h-11 rounded-xl bg-white/10 px-4 text-sm outline-none ring-1 ring-white/15 placeholder:text-white/60" placeholder="Telefonnummer" />

                <select className="h-11 rounded-xl bg-white/10 px-4 text-sm outline-none ring-1 ring-white/15 md:col-span-2">
                  <option>Thema auswählen...</option>
                  <option>Mitgliedschaft</option>
                  <option>Veranstaltungen</option>
                  <option>Allgemeine Anfrage</option>
                </select>

                <textarea
                  className="min-h-[120px] rounded-xl bg-white/10 px-4 py-3 text-sm outline-none ring-1 ring-white/15 placeholder:text-white/60 md:col-span-2"
                  placeholder="Deine Nachricht an uns..."
                />

                <p className="text-xs text-white/70 md:col-span-2">
                  Mit Klick auf "Absenden" bestätigen Sie, dass Sie die Datenschutzhinweise zur Kenntnis genommen haben.
                </p>

                <button className="h-11 rounded-xl bg-white px-5 text-xs font-extrabold tracking-widest text-black hover:bg-white/90 md:col-span-2">
                  Absenden
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* footer hero image hint */}
        <div className="mt-12 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
          <img
            className="h-40 w-full object-cover opacity-70"
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80"
            alt="Skyline von Frankfurt"
          />
        </div>
      </div>
    </section>
  );
}
