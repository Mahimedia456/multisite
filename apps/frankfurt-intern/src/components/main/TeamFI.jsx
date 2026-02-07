const people = [
  {
    name: "Manuel Vollbrecht",
    role: "Vorstandsvorsitzender",
    image:
      "https://cdn.prod.website-files.com/68b990e523135518225996b6/68ece383dfeb716fdbe4f1fd_manuel.JPG",
    link: "https://vertretung.allianz.de/agentur.vollbrecht/",
  },
  {
    name: "Nicola Maier",
    role: "Schatzmeisterin",
    image:
      "https://cdn.prod.website-files.com/68b990e523135518225996b6/68ece38c79a6cb9b9b159036_nicola.JPG",
    link: "https://vertretung.allianz.de/roskos.meier/",
  },
  {
    name: "Dirk Jakob",
    role: "Vorstand",
    image:
      "https://cdn.prod.website-files.com/68b990e523135518225996b6/68ece398499c8a9b93b86b9c_dirk.JPG",
    link: "https://vertretung.allianz.de/dirk.jakob/",
  },
  {
    name: "Stephan Hungerland",
    role: "Vorstand",
    image:
      "https://cdn.prod.website-files.com/68b990e523135518225996b6/68ece39f825f9f689486f13c_stephan.JPG",
    link: "https://vertretung.allianz.de/stephan.hungerland/",
  },
  {
    name: "Christian Schnubel",
    role: "Vorstand",
    image:
      "https://cdn.prod.website-files.com/68b990e523135518225996b6/68ece3ab532baf9d7a980d04_christian.JPG",
    link: "https://vertretung.allianz.de/christian.schnubel/",
  },
  {
    name: "Dr. Eberhard Theobald",
    role: "Kassenprüfer",
    image:
      "https://cdn.prod.website-files.com/68b990e523135518225996b6/68ece3b52c802d22e655d85e_eberhard%20.JPG",
  },
  {
    name: "Thomas Fülbier",
    role: "Kassenprüfer",
    image:
      "https://cdn.prod.website-files.com/68b990e523135518225996b6/68ece3bcce95f4a63e272da4_thomas.JPG",
  },
  {
    name: "Andreas Haase",
    role: "Beirat",
    image:
      "https://cdn.prod.website-files.com/68b990e523135518225996b6/68f246fb26a98abe19840c32_edit.png",
  },
  {
    name: "Ralf Krauss",
    role: "Beirat",
    image:
      "https://cdn.prod.website-files.com/68b990e523135518225996b6/68ece3d7532baf9d7a98193f_krauss.JPG",
  },
  {
    name: "Michael Prentas",
    role: "Beirat",
    image:
      "https://cdn.prod.website-files.com/68b990e523135518225996b6/68ece3e17b4f90a601936269_michael.JPG",
  },
  {
    name: "Claudia Sonnberger",
    role: "Beirat",
    image:
      "https://cdn.prod.website-files.com/68b990e523135518225996b6/68ff5f3249b0cd31fd6eda6a_Claudia%20Spreda1.jpeg",
  },
  {
    name: "Rouven Stieghahn",
    role: "Beirat",
    image:
      "https://cdn.prod.website-files.com/68b990e523135518225996b6/68ece3ebf52b293ce27cc525_rouven.JPG",
  },
];

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 3h7v7" />
      <path d="M10 14L21 3" />
      <path d="M21 14v7h-7" />
      <path d="M3 10v11h11" />
    </svg>
  );
}

export default function TeamFI() {
  return (
    <section id="team" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        {/* Header */}
        <p className="text-[11px] font-semibold tracking-[0.30em] text-zinc-400">
          Vorstand & Beirat
        </p>

        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl">
          Das Team hinter Frankfurt Intern e.V.
        </h2>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-600">
          Hinter jedem starken Netzwerk stehen engagierte Köpfe. Unser Vorstand
          bringt Ideen voran und gibt Frankfurt Intern e.V. ein Gesicht.
          Unterstützt wird er von Kassenprüfern und einem Beirat, die gemeinsam
          für Vielfalt, Kompetenz und Zukunftsorientierung sorgen.
        </p>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {people.map((p) => (
            <div
              key={p.name}
              className="group overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-black/5"
            >
              {/* Image */}
              <div className="relative h-52 sm:h-56 md:h-60">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover object-top"
                />

                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-zinc-900 shadow ring-1 ring-black/10 transition hover:scale-105"
                    aria-label="Zur Website"
                  >
                    <ExternalIcon />
                  </a>
                )}

                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
              </div>

              {/* Text */}
              <div className="p-4">
                <div className="text-sm font-extrabold text-zinc-900">
                  {p.name}
                </div>
                <div className="mt-1 text-xs font-semibold text-zinc-600">
                  {p.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
