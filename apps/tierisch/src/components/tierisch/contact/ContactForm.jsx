import Card from "../../ui/Card";
import MIcon from "../../MIcon";

export default function ContactForm({
  title = "Schreiben Sie uns eine Nachricht",
  description = "Füllen Sie das Formular aus und wir melden uns schnellstmöglich zurück.",
  highlightSmall = "Kostenlose Beratung",
  highlightTitle = "Individuell, verständlich und unverbindlich.",
  submitLabel = "Nachricht senden",
  animalOptions = ["Hund", "Katze", "Pferd"],
}) {
  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

  return (
    <section id="kontaktformular" className="relative overflow-hidden bg-[rgb(var(--background))] py-24">
      <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-primary/10 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
              Kontaktformular
            </p>

            <h2 className="text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
              {title}
            </h2>

            <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-slate-600">
              {description}
            </p>

            <div className="mt-8 rounded-[2rem] bg-primary p-8 text-white shadow-lg shadow-primary/20">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                  <MIcon name="verified" className="text-[28px]" />
                </div>

                <div>
                  <div className="text-sm font-bold text-white/80">{highlightSmall}</div>
                  <div className="mt-2 text-2xl font-black leading-snug">
                    {highlightTitle}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Card className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm md:p-9">
            <form className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-xs font-black uppercase tracking-wide text-slate-600">
                  Vorname
                </label>
                <input className={inputClass} />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wide text-slate-600">
                  Nachname
                </label>
                <input className={inputClass} />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wide text-slate-600">
                  E-Mail
                </label>
                <input type="email" className={inputClass} />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wide text-slate-600">
                  Telefon
                </label>
                <input className={inputClass} />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-black uppercase tracking-wide text-slate-600">
                  Tierart
                </label>
                <select className={inputClass}>
                  {(animalOptions || []).map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-black uppercase tracking-wide text-slate-600">
                  Nachricht
                </label>
                <textarea rows={5} className={inputClass} />
              </div>

              <div className="md:col-span-2">
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                >
                  {submitLabel}
                  <MIcon name="send" className="ml-2 text-[20px]" />
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}