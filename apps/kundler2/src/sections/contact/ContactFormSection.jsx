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
    <section className="bg-[#003781] py-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:px-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-primary">
            {eyebrow}
          </p>

          <h2 className="text-4xl font-black leading-tight md:text-5xl">
            {headline}
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-white/75">
            {subheading}
          </p>

          <div className="mt-8 rounded-3xl bg-white/10 p-6 border border-white/10">
            <p className="text-sm text-white/70">{phoneLabel}</p>
            <p className="mt-2 text-2xl font-black text-primary">{phone}</p>
          </div>
        </div>

        <form className="rounded-[2rem] bg-white p-8 text-zinc-900 shadow-2xl">
          <h3 className="mb-6 text-2xl font-black">{formTitle}</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Vorname"
              className="rounded-2xl border border-zinc-200 px-4 py-4 text-sm outline-none focus:border-primary"
            />

            <input
              placeholder="Nachname"
              className="rounded-2xl border border-zinc-200 px-4 py-4 text-sm outline-none focus:border-primary"
            />

            <input
              placeholder="Telefon"
              className="rounded-2xl border border-zinc-200 px-4 py-4 text-sm outline-none focus:border-primary"
            />

            <input
              placeholder="E-Mail"
              className="rounded-2xl border border-zinc-200 px-4 py-4 text-sm outline-none focus:border-primary"
            />
          </div>

          <textarea
            placeholder="Nachricht"
            rows={6}
            className="mt-4 w-full rounded-2xl border border-zinc-200 px-4 py-4 text-sm outline-none focus:border-primary"
          />

          <button
            type="button"
            className="mt-5 rounded-full bg-primary px-7 py-4 text-sm font-black text-black hover:opacity-90"
          >
            {buttonLabel}
          </button>
        </form>
      </div>
    </section>
  );
}