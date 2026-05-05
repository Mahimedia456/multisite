const DEFAULT_TEAM = [
  {
    name: "Markus Weber",
    role: "Leiter Kundenberatung",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
  },
  {
    name: "Dr. Julia Neumann",
    role: "Service Excellence",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800",
  },
  {
    name: "Thomas Schmidt",
    role: "Regionalleiter Süd",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800",
  },
  {
    name: "Lena Meyer",
    role: "Expertin für Vorsorge",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800",
  },
];

function TeamCard({ person }) {
  return (
    <div className="group">
      <div
        className="aspect-[4/5] rounded-xl overflow-hidden mb-4 relative bg-gray-200 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${person.img}")` }}
      >
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <h5 className="font-bold text-lg">{person.name}</h5>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {person.role}
      </p>

      <div className="w-10 h-1 bg-primary" />
    </div>
  );
}

export default function TeamSection({
  headline = "Wir sind für Sie da",
  subheading = "Lernen Sie die Köpfe hinter unserer exzellenten Service-Qualität kennen.",
  buttonLabel = "Alle Ansprechpartner",
  buttonHref = "/kontakt",
  team = DEFAULT_TEAM,
}) {
  return (
    <section className="py-20 max-w-[1280px] mx-auto px-6 lg:px-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-bold mb-2">{headline}</h2>
          <p className="text-gray-600 dark:text-gray-400">{subheading}</p>
        </div>

        <a
          href={buttonHref}
          className="text-primary font-bold flex items-center gap-2 hover:underline"
        >
          {buttonLabel}
          <span className="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(team || []).map((person) => (
          <TeamCard key={person.name} person={person} />
        ))}
      </div>
    </section>
  );
}