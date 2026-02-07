const items = [
  {
    text: "Weil unsere Stimme im direkten Austausch mit der Allianz-Zentrale gehört wird.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      </svg>
    ),
  },
  {
    text: "Weil wir von den Besten lernen und unser Netzwerk ausbauen wollen.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l4 4-4 4-4-4 4-4z" />
        <path d="M2 12l4-4 4 4-4 4-4-4z" />
        <path d="M12 14l4 4-4 4-4-4 4-4z" />
        <path d="M14 12l4-4 4 4-4 4-4-4z" />
      </svg>
    ),
  },
  {
    text: "Weil wir gemeinsam Antworten auf die Fragen entwickeln, die uns als Unternehmer:in bewegen.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
];

export default function BenefitsFI() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <p className="text-[11px] font-semibold tracking-[0.30em] text-zinc-400">
          Vorteile der Mitgliedschaft
        </p>

        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl">
          Warum Mitglied werden?
        </h2>

        <p className="mt-3 text-sm font-bold text-zinc-900">
          Frankfurt Intern e.V. – Wir sind wie Du. Werde eine(r) von uns!
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="group rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.10)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.14)]"
            >
              {/* Icon */}
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-purple-700/15 text-purple-700 ring-1 ring-purple-700/25">
                <div className="h-5 w-5">{item.icon}</div>
              </div>

              {/* Text */}
              <p className="text-sm leading-7 text-zinc-700">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
