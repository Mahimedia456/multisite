const steps = [
  {
    n: "1.",
    title: "Kontakt aufnehmen",
    text: "Melde Dich über unser Formular oder per E-Mail. Wir beantworten gerne Deine ersten Fragen und geben Dir einen schnellen Überblick.",
  },
  {
    n: "2.",
    title: "Ins Gespräch kommen",
    text: "In einem persönlichen Kennenlerngespräch finden wir heraus, ob unsere Ziele und Dein Unternehmergeist zusammenpassen. Offen, ehrlich und unverbindlich.",
  },
  {
    n: "3.",
    title: "Mitglied werden",
    text: "Wenn es passt, geht’s ganz einfach: Du erhältst alle Infos und wirst offiziell Teil von Frankfurt Intern e.V. – mit allen Vorteilen unseres starken Netzwerks.",
  },
];

export default function MembershipStepsFI() {
  return (
    <section id="mitgliedschaft" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-[11px] font-semibold tracking-[0.30em] text-zinc-400">
          Mitgliedschaft
        </p>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl">
          So wirst Du Mitglied
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-600">
          Der Weg zu Frankfurt Intern e.V. ist klar, unkompliziert – und von Anfang an ein Austausch auf Augenhöhe.
          Wenn Du Lust hast, Teil unseres Netzwerks zu werden, geh einfach die nächsten Schritte:
        </p>

        <a
          href="#kontakt"
          className="mt-6 inline-flex rounded-full bg-orange-500 px-5 py-3 text-xs font-extrabold tracking-widest text-black hover:bg-orange-400"
        >
          Kontakt aufnehmen
        </a>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.10)] ring-1 ring-black/5"
            >
              <div className="text-sm font-extrabold text-purple-700">{s.n} {s.title}</div>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
