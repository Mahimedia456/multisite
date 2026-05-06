import Card from "../../ui/Card";

export default function ContactForm({
  title = "Schreiben Sie uns eine Nachricht",
  description = "Füllen Sie das Formular aus und wir melden uns schnellstmöglich zurück.",
  highlightSmall = "Kostenlose Beratung",
  highlightTitle = "Individuell, verständlich und unverbindlich.",
  submitLabel = "Nachricht senden",
  animalOptions = ["Hund", "Katze", "Pferd"],
}) {
  return (
    <section id="kontaktformular" className="py-20 bg-[rgb(var(--background))]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-3xl font-extrabold text-zinc-900">
              {title}
            </h2>

            <p className="mt-4 text-zinc-600 leading-relaxed">
              {description}
            </p>

            <div className="mt-8 rounded-3xl bg-primary p-8 text-white shadow-primary/20">
              <div className="text-sm text-white/80">{highlightSmall}</div>

              <div className="mt-2 text-2xl font-extrabold">
                {highlightTitle}
              </div>
            </div>
          </div>

          <Card className="p-6">
            <form className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-slate-700">
                  Vorname
                </label>

                <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#00938F]" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">
                  Nachname
                </label>

                <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#00938F]" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">
                  E-Mail
                </label>

                <input
                  type="email"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#00938F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">
                  Telefon
                </label>

                <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#00938F]" />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Tierart
                </label>

                <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#00938F]">
                  {(animalOptions || []).map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Nachricht
                </label>

                <textarea
                  rows={5}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#00938F]"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="button"
                  className="w-full rounded-xl bg-[#00938F] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(0,147,143,0.25)] transition hover:-translate-y-0.5"
                >
                  {submitLabel}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}