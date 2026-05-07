export default function ContactFormSection({
  eyebrow = "Nachricht senden",
  headline = "Wir melden uns schnellstmöglich bei Ihnen",
  subheading = "Füllen Sie das Formular aus und unser Beratungsteam kontaktiert Sie.",
  formTitle = "Kontakt aufnehmen",
  phoneLabel = "Telefonnummer",
  phone = "+49 000 000 000",
  buttonLabel = "Nachricht senden",
}) {
  return (
    <section className="relative overflow-hidden bg-primary py-24 text-white">
      <div className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-slate-950/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[0.9fr_1.1fr] md:items-center lg:px-10">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
            {eyebrow}
          </p>

          <h2 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
            {headline}
          </h2>

          <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-white/80">
            {subheading}
          </p>

          <div className="mt-8 rounded-[2rem] border border-white/15 bg-white/10 p-7 backdrop-blur">
            <p className="text-sm font-semibold text-white/70">{phoneLabel}</p>
            <p className="mt-2 text-3xl font-black text-white">{phone}</p>
          </div>
        </div>

        <form className="rounded-[2rem] bg-white p-8 text-slate-950 shadow-2xl md:p-10">
          <h3 className="mb-8 text-3xl font-black">{formTitle}</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Vorname"
              className="rounded-xl border border-slate-200 px-5 py-4 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />

            <input
              placeholder="Nachname"
              className="rounded-xl border border-slate-200 px-5 py-4 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />

            <input
              placeholder="Telefon"
              className="rounded-xl border border-slate-200 px-5 py-4 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />

            <input
              placeholder="E-Mail"
              className="rounded-xl border border-slate-200 px-5 py-4 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <textarea
            placeholder="Nachricht"
            rows={6}
            className="mt-4 w-full rounded-xl border border-slate-200 px-5 py-4 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />

          <button
            type="button"
            className="mt-6 inline-flex rounded-xl bg-primary px-7 py-4 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
          >
            {buttonLabel}
          </button>
        </form>
      </div>
    </section>
  );
}